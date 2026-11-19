"""Payload-free invalidation notifications for the single-worker API deployment."""
import asyncio
from contextlib import asynccontextmanager

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse


class ChangeHub:
    def __init__(self):
        self.listeners = set()

    @asynccontextmanager
    async def subscribe(self):
        queue = asyncio.Queue(maxsize=1)
        self.listeners.add(queue)
        try:
            yield queue
        finally:
            self.listeners.discard(queue)

    def publish(self):
        for queue in tuple(self.listeners):
            if queue.empty():
                queue.put_nowait(True)


hub = ChangeHub()
router = APIRouter()


@router.get("/updates", include_in_schema=False)
async def updates(request: Request):
    async def stream():
        async with hub.subscribe() as queue:
            # Reconnecting clients re-read their authorized data, catching missed changes.
            yield "retry: 1000\nevent: ready\ndata: {}\n\n"
            while not await request.is_disconnected():
                try:
                    await asyncio.wait_for(queue.get(), timeout=15)
                    yield "event: change\ndata: {}\n\n"
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"

    # Public stream carries no IDs, resource names, tokens or customer data.
    # Existing authenticated API reads remain the only source of private data.
    return StreamingResponse(stream(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache, no-store", "X-Accel-Buffering": "no",
    })


class ChangeNotificationMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or scope.get("method") not in {"POST", "PUT", "PATCH", "DELETE"}:
            return await self.app(scope, receive, send)
        status = None

        async def notify_send(message):
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
            await send(message)
            if message["type"] == "http.response.body" and not message.get("more_body", False):
                if status is not None and 200 <= status < 300:
                    hub.publish()

        await self.app(scope, receive, notify_send)
