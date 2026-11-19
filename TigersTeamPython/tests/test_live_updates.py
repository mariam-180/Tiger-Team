import asyncio
import socket
import threading
import time

import httpx
import uvicorn

from src.core.live_updates import ChangeHub, ChangeNotificationMiddleware, hub, updates


def test_hub_broadcasts_and_coalesces_changes_and_removes_disconnected_clients():
    async def run():
        changes = ChangeHub()
        async with changes.subscribe() as first, changes.subscribe() as second:
            changes.publish()
            changes.publish()
            assert first.qsize() == second.qsize() == 1
            assert await first.get() is True
            assert await second.get() is True
        assert not changes.listeners
    asyncio.run(run())


def test_real_http_stream_delivers_admin_save_to_two_open_clients(client, users, inventory, auth):
    """Exercise actual streaming sockets, not a buffered in-process HTTP transport."""
    from src.app import app
    listener = socket.socket()
    listener.bind(("127.0.0.1", 0))
    port = listener.getsockname()[1]
    server = uvicorn.Server(uvicorn.Config(app, log_level="error", lifespan="off"))
    thread = threading.Thread(target=lambda: server.run(sockets=[listener]), daemon=True)
    thread.start()
    try:
        deadline = time.monotonic() + 5
        while not server.started and time.monotonic() < deadline:
            time.sleep(0.01)
        assert server.started

        async def next_frame(lines):
            frame = []
            async for line in lines:
                if not line:
                    return "\n".join(frame)
                frame.append(line)
            raise AssertionError("Stream disconnected")

        async def run():
            async with httpx.AsyncClient(base_url=f"http://127.0.0.1:{port}", timeout=5) as api:
                async with api.stream("GET", "/updates") as first, api.stream("GET", "/updates") as second:
                    assert first.status_code == second.status_code == 200
                    first_lines, second_lines = first.aiter_lines(), second.aiter_lines()
                    assert "event: ready" in await next_frame(first_lines)
                    assert "event: ready" in await next_frame(second_lines)
                    saved = await api.patch(f"/products/{inventory[2].id}", headers=auth(users[2]), data={"price": "42"})
                    assert saved.status_code == 200, saved.text
                    assert await next_frame(first_lines) == "event: change\ndata: {}"
                    assert await next_frame(second_lines) == "event: change\ndata: {}"
                    catalog = await api.get("/products/")
                    assert catalog.json()[0]["price"] == 42
        asyncio.run(run())
    finally:
        server.should_exit = True
        thread.join(timeout=5)
        listener.close()
    assert not thread.is_alive()


def test_stream_has_no_private_payload_and_reconnects_catch_up():
    class Request:
        async def is_disconnected(self):
            return False

    async def run():
        response = await updates(Request())
        assert response.headers["x-accel-buffering"] == "no"
        iterator = response.body_iterator
        assert await anext(iterator) == "retry: 1000\nevent: ready\ndata: {}\n\n"
        hub.publish()
        assert await anext(iterator) == "event: change\ndata: {}\n\n"
        await iterator.aclose()
        assert not hub.listeners
    asyncio.run(run())


def test_only_successful_writes_notify_open_clients_after_response():
    async def run():
        for method, status, expected in [("GET", 200, False), ("POST", 201, True),
                                         ("PATCH", 200, True), ("DELETE", 204, True),
                                         ("POST", 409, False), ("PATCH", 403, False),
                                         ("POST", 500, False)]:
            sent = []

            async def app(scope, receive, send):
                await send({"type": "http.response.start", "status": status, "headers": []})
                await send({"type": "http.response.body", "body": b"", "more_body": False})

            async def send(message):
                sent.append(message)
                assert queue.empty(), "Notification must follow the completed response"

            async with hub.subscribe() as queue:
                await ChangeNotificationMiddleware(app)({"type": "http", "method": method}, None, send)
                assert (not queue.empty()) is expected
                assert len(sent) == 2
    asyncio.run(run())
