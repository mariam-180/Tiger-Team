import os
from concurrent.futures import ThreadPoolExecutor

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from src.app import app
from src.api.dependencies import get_db
from src.infra.db.tables import PC
from test_regressions import booking


pytestmark = pytest.mark.skipif(not os.getenv('TIGERS_TEST_DATABASE_URL'), reason='Requires real MySQL row locks')


def run_concurrently(db, payloads):
    def isolated_session():
        with Session(db.get_bind()) as session:
            yield session
    previous = app.dependency_overrides.get(get_db)
    app.dependency_overrides[get_db] = isolated_session
    try:
        def request(payload):
            headers, data = payload
            with TestClient(app, raise_server_exceptions=False) as client:
                response = client.post('/reservations/', headers=headers, json=data)
                return response.status_code, response.text
        with ThreadPoolExecutor(max_workers=2) as executor:
            return list(executor.map(request, payloads))
    finally:
        if previous:
            app.dependency_overrides[get_db] = previous
        else:
            app.dependency_overrides.pop(get_db, None)


def test_concurrent_customers_cannot_double_book(db, users, inventory, auth):
    data = booking(inventory)
    results = run_concurrently(db, [(auth(users[0]), data), (auth(users[1]), data)])
    assert sorted(code for code, _ in results) == [201, 409], results


def test_concurrent_requests_cannot_overspend_balance(db, users, inventory, auth):
    db.add(PC(branch_id=inventory[0].id, pc_number='2'))
    users[0].credit = 5
    db.add(users[0])
    db.commit()
    headers = auth(users[0])
    results = run_concurrently(db, [(headers, booking(inventory)), (headers, booking(inventory, pc_id=2))])
    assert sorted(code for code, _ in results) == [201, 402], results
    db.rollback()  # End the fixture's earlier MySQL REPEATABLE READ snapshot.
    db.refresh(users[0])
    assert users[0].credit == 0
