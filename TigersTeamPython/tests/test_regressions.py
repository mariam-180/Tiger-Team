from datetime import datetime, timedelta
from io import BytesIO

import pytest
from fastapi import UploadFile
from PIL import Image
from sqlmodel import select
from src.infra.db.tables import User, UserRole, Order, Product, Reservation, Event
from src.infra.crud.reservation_crud import local_now


def booking(inventory, **changes):
    branch, pc, _ = inventory
    start = (local_now() + timedelta(days=1)).replace(second=0, microsecond=0)
    data = dict(branch_id=branch.id, pc_id=int(pc.pc_number), reservation_start=start.isoformat(),
                reservation_end=(start + timedelta(hours=1)).isoformat(), duration=60, total_cost=0)
    return {**data, **changes}


def test_signup_cannot_grant_privileges(client, db, monkeypatch):
    monkeypatch.setattr("src.api.endpoints.user_router.send_verification_email", lambda *args: None)
    response = client.post("/users/", json=dict(first_name="New", last_name="User", email="new@example.com",
        user_name="new", phone_number="123456789", password="TestPassword123", role="SUPER_USER", credit=9999, is_verified=True))
    assert response.status_code == 201, response.text
    user = db.exec(select(User).where(User.email == "new@example.com")).one()
    assert (user.role, user.credit, user.is_verified) == (UserRole.END_USER, 0, False)


def test_failed_email_rolls_back_signup(client, db, monkeypatch):
    def fail(*args):
        raise OSError("SMTP unavailable")
    monkeypatch.setattr("src.api.endpoints.user_router.send_verification_email", fail)
    response = client.post("/users/", json=dict(first_name="New", email="new@example.com",
        user_name="new", phone_number="123", password="TestPassword123"))
    assert response.status_code == 503
    assert db.exec(select(User).where(User.email == "new@example.com")).first() is None


def test_lookup_requires_staff_and_never_exposes_secrets(client, users, auth):
    assert client.get("/users/by-email/customer@example.com").status_code == 401
    assert client.get("/users/by-email/customer@example.com", headers=auth(users[0])).status_code == 403
    response = client.get("/users/by-email/customer@example.com", headers=auth(users[2]))
    assert response.status_code == 200, response.text
    assert not {"password", "verification_token", "reset_token", "reset_token_expiry"} & response.json().keys()


@pytest.mark.parametrize("method,path", [("get", "/reports/1"), ("delete", "/reports/1"), ("post", "/reports/"), ("put", "/reports/1")])
def test_reports_require_authentication(client, method, path):
    assert getattr(client, method)(path).status_code == 401


def test_demoted_token_does_not_restore_role(client, users, auth, db):
    headers = auth(users[2])
    users[2].role = UserRole.END_USER
    db.add(users[2])
    db.commit()
    assert client.get("/users/", headers=headers).status_code == 403
    assert users[2].role == UserRole.END_USER


def test_checkout_uses_server_price_and_decrements_stock(client, users, inventory, auth, db):
    product = inventory[2]
    response = client.post("/orders/", headers=auth(users[0]), json={"items": [{"product_id": product.id, "quantity": 2, "price": 0.01}]})
    assert response.status_code == 201, response.text
    assert response.json()["total_amount"] == 40
    db.refresh(product)
    assert product.stock_quantity == 3
    order_id = response.json()["id"]
    assert client.get(f"/orders/{order_id}", headers=auth(users[1])).status_code == 403
    assert client.get("/orders/by-username/customer", headers=auth(users[1])).status_code == 403


def test_insufficient_stock_rolls_back_entire_order(client, users, inventory, auth, db):
    product = inventory[2]
    response = client.post("/orders/", headers=auth(users[0]), json={"items": [
        {"product_id": product.id, "quantity": 2, "price": 20}, {"product_id": product.id, "quantity": 4, "price": 20}]})
    assert response.status_code == 507, response.text
    db.refresh(product)
    assert product.stock_quantity == 5
    assert db.exec(select(Order)).all() == []


def test_negative_quantity_rejected(client, users, inventory, auth):
    response = client.post("/orders/", headers=auth(users[0]), json={"items": [{"product_id": inventory[2].id, "quantity": -1, "price": 20}]})
    assert response.status_code == 422, response.text


def test_reservation_uses_server_price_and_prevents_overlap(client, users, inventory, auth, db):
    response = client.post("/reservations/", headers=auth(users[0]), json=booking(inventory))
    assert response.status_code == 201, response.text
    assert response.json()["total_cost"] == 5
    db.refresh(users[0])
    assert users[0].credit == 95
    response = client.post("/reservations/", headers=auth(users[1]), json=booking(inventory))
    assert response.status_code == 409, response.text


@pytest.mark.parametrize("changes", [{"total_cost": -10}, {"duration": 0}, {"pc_id": []}, {"pc_id": [1, 1]}])
def test_invalid_reservation_rejected(client, users, inventory, auth, changes):
    assert client.post("/reservations/bulk", headers=auth(users[0]), json=booking(inventory, **changes)).status_code == 422


def test_bulk_booking_failure_is_atomic(client, users, inventory, auth, db):
    response = client.post("/reservations/bulk", headers=auth(users[0]), json=booking(inventory, pc_id=[1, 999]))
    assert response.status_code == 404, response.text
    db.refresh(users[0])
    assert users[0].credit == 100
    assert db.exec(select(Reservation)).all() == []


def test_profile_without_active_event(client, users, auth):
    response = client.get("/event_registrations/by_email/customer@example.com", headers=auth(users[0]))
    assert response.status_code == 200, response.text
    assert response.json() is None


def test_upload_matching_webp_filename_is_preserved(tmp_path, monkeypatch):
    from src.utils import upload_image
    monkeypatch.setattr(upload_image, "STATIC_ROOT", tmp_path / "static")
    data = BytesIO()
    Image.new("RGB", (10, 10)).save(data, format="WEBP")
    data.seek(0)
    result = upload_image.save_image(UploadFile(filename="Wheel.webp", file=data), "Wheel")
    assert (upload_image.STATIC_ROOT / result).is_file()


def test_cancel_then_delete_restores_stock_only_once(client, users, inventory, auth, db):
    product = inventory[2]
    created = client.post("/orders/", headers=auth(users[0]), json={"items": [{"product_id": product.id, "quantity": 2, "price": 0}]}).json()
    response = client.patch(f"/orders/{created['id']}", headers=auth(users[2]), json={"status": "CANCELLED"})
    assert response.status_code == 200, response.text
    assert client.delete(f"/orders/{created['id']}", headers=auth(users[2])).status_code == 204
    db.refresh(product)
    assert product.stock_quantity == 5


def test_admin_user_update_writes_safe_activity_report(client, users, auth):
    response = client.patch(f"/users/{users[0].id}", headers=auth(users[2]), json={"credit": 150})
    assert response.status_code == 200, response.text
    response = client.get("/reports/", headers=auth(users[2]))
    assert response.status_code == 200, response.text
    assert len(response.json()) == 1
    assert '"password"' not in response.text
    assert "reset_token" not in response.text


def test_future_reservation_cancellation_refunds_credit(client, users, inventory, auth, db):
    response = client.post("/reservations/", headers=auth(users[0]), json=booking(inventory))
    booking_id = response.json()["id"]
    response = client.delete(f"/reservations/{booking_id}", headers=auth(users[2]))
    assert response.status_code == 204, response.text
    db.refresh(users[0])
    assert users[0].credit == 100


def test_item_changes_reconcile_stock_and_order_total(client, users, inventory, auth, db):
    product = inventory[2]
    created = client.post("/orders/", headers=auth(users[0]), json={"items": [{"product_id": product.id, "quantity": 2, "price": 0}]}).json()
    item_id = created["items"][0]["id"]
    response = client.patch(f"/order-items/{item_id}", headers=auth(users[2]), json={"quantity": 3})
    assert response.status_code == 200, response.text
    db.refresh(product)
    assert product.stock_quantity == 2
    assert client.get(f"/orders/{created['id']}", headers=auth(users[0])).json()["total_amount"] == 60


def test_no_active_event_does_not_accept_registration(client):
    response = client.post("/event_registrations/", json=dict(first_name="Test", last_name="User", email="user@example.com", phone_number="123", status="CONFIRMED"))
    assert response.status_code == 409, response.text


def test_unknown_login_returns_unauthorized(client):
    assert client.post("/users/token", data={"username": "missing@example.com", "password": "something"}).status_code == 401


def test_publish_authentication_and_custom_playback_name(client, monkeypatch):
    from src.core.config import settings
    monkeypatch.setattr(settings, "SRS_PUBLISH_TOKEN", "test-publish-secret")
    monkeypatch.setattr(settings, "SRS_STREAM_KEY", "CustomStream")
    payload = dict(action="on_publish", app="live", stream="CustomStream", param="?token=wrong")
    assert client.post("/stream/on-publish", json=payload).json()["code"] == 403
    payload["param"] = "?token=test-publish-secret"
    assert client.post("/stream/on-publish", json=payload).json()["code"] == 0
    from src.api.endpoints.stream_router import playback_urls
    assert playback_urls()["hls_url"] == "/hls/live/CustomStream.m3u8"


def test_signup_verification_and_login_flow(client, monkeypatch):
    tokens = []
    monkeypatch.setattr("src.api.endpoints.user_router.send_verification_email", lambda name, email, token: tokens.append(token))
    response = client.post("/users/", json=dict(first_name="New", email="new@example.com", user_name="new", phone_number="123", password="TestPassword123"))
    assert response.status_code == 201, response.text
    credentials = {"username": "new@example.com", "password": "TestPassword123"}
    assert client.post("/users/token", data=credentials).status_code == 403
    response = client.get("/users/verify-email", params={"token": tokens[0]}, follow_redirects=False)
    assert response.status_code == 307, response.text
    response = client.post("/users/token", data=credentials)
    assert response.status_code == 200, response.text
    assert "access_token" in response.json()


def test_reset_password_consumes_token_and_invalidates_old_login(client, users, auth, monkeypatch):
    tokens = []
    headers = auth(users[0])
    monkeypatch.setattr("src.api.endpoints.user_router.send_reset_password_email", lambda name, email, token: tokens.append(token))
    assert client.post("/users/request-password-reset", json={"email": users[0].email}).status_code == 200
    payload = {"token": tokens[0], "new_password": "NewPassword123"}
    response = client.post("/users/reset-password", json=payload)
    assert response.status_code == 200, response.text
    assert client.get("/users/current", headers=headers).status_code == 401
    assert client.post("/users/reset-password", json=payload).status_code == 404
    assert client.post("/users/token", data={"username": users[0].email, "password": "NewPassword123"}).status_code == 200


def test_delete_user_records_activity_without_server_error(client, users, auth):
    response = client.delete(f"/users/{users[1].id}", headers=auth(users[2]))
    assert response.status_code == 204, response.text


def test_order_item_create_requires_parent_and_uses_server_price(client, users, inventory, auth):
    product = inventory[2]
    payload = {"product_id": product.id, "quantity": 1, "price": 0}
    assert client.post("/order-items/", headers=auth(users[2]), json=payload).status_code == 422
    created = client.post("/orders/", headers=auth(users[0]), json={"items": [payload]}).json()
    response = client.post("/order-items/", headers=auth(users[2]), json={**payload, "order_id": int(created["id"])})
    assert response.status_code == 201, response.text
    assert response.json()["price"] == 20


def test_delete_cannot_cascade_away_order_history(client, users, inventory, auth):
    product = inventory[2]
    response = client.post("/orders/", headers=auth(users[0]), json={"items": [{"product_id": product.id, "quantity": 1, "price": 0}]})
    assert response.status_code == 201
    assert client.delete(f"/products/{product.id}", headers=auth(users[2])).status_code == 409
    assert client.delete(f"/users/{users[0].id}", headers=auth(users[2])).status_code == 409
    assert client.delete(f"/categories/{product.category_id}", headers=auth(users[2])).status_code == 409


def test_reservation_edit_recalculates_price_and_balance(client, users, inventory, auth, db):
    payload = booking(inventory)
    created = client.post('/reservations/', headers=auth(users[0]), json=payload).json()
    start = datetime.fromisoformat(payload['reservation_start'])
    response = client.patch(f"/reservations/{created['id']}", headers=auth(users[2]),
        json={'duration': 120, 'reservation_end': (start + timedelta(hours=2)).isoformat(), 'total_cost': 0})
    assert response.status_code == 200, response.text
    assert response.json()['total_cost'] == 12
    db.refresh(users[0])
    assert users[0].credit == 88
    response = client.patch(f"/reservations/{created['id']}", headers=auth(users[2]), json={'duration': 30})
    assert response.status_code == 422, response.text


def test_product_pages_have_stable_id_order(client, db, inventory):
    original = inventory[2]
    for product_id in (900, 800):
        db.add(Product(id=product_id, name=f"Product {product_id}", description="Pagination test",
                       category_id=original.category_id, price=20, stock_quantity=5))
    db.commit()
    collected = []
    for skip in range(3):
        response = client.get("/products/", params={"skip": skip, "limit": 1})
        assert response.status_code == 200, response.text
        collected.extend(int(product["id"]) for product in response.json())
    assert collected == [original.id, 800, 900]
    assert client.get("/products/", params={"skip": 3, "limit": 1}).json() == []


@pytest.mark.parametrize("endpoint", ["/reservations/", "/reservations/bulk"])
def test_permanently_closed_branch_cannot_accept_booking(client, users, inventory, auth, db, endpoint):
    branch = inventory[0]
    branch.name = "Snokardo"
    db.add(branch)
    db.commit()
    response = client.post(endpoint, headers=auth(users[0]), json=booking(inventory))
    assert response.status_code == 409, response.text
    assert "permanently closed" in response.json()["detail"]
    db.refresh(users[0])
    assert users[0].credit == 100
    assert db.exec(select(Reservation)).all() == []


def test_customer_and_admin_share_catalog_orders_bookings_and_credit(client, users, inventory, auth):
    customer, _, admin = users
    product = inventory[2]
    changed = client.patch(f"/products/{product.id}", headers=auth(admin), data={"price": "35"})
    assert changed.status_code == 200, changed.text
    public_catalog = client.get("/products/")
    assert public_catalog.status_code == 200
    assert next(row for row in public_catalog.json() if int(row["id"]) == product.id)["price"] == 35

    created_order = client.post("/orders/", headers=auth(customer), json={"items": [{"product_id": product.id, "quantity": 1, "price": 0}]})
    assert created_order.status_code == 201, created_order.text
    order_id = created_order.json()["id"]
    assert created_order.json()["total_amount"] == 35
    assert any(int(row["id"]) == int(order_id) for row in client.get("/orders/", headers=auth(admin)).json())
    advanced = client.patch(f"/orders/{order_id}", headers=auth(admin), json={"status": "PROCESSING"})
    assert advanced.status_code == 200, advanced.text
    own_orders = client.get(f"/orders/by-username/{customer.user_name}", headers=auth(customer))
    assert own_orders.status_code == 200
    assert own_orders.json()[0]["status"] == "PROCESSING"

    balance = client.patch(f"/users/{customer.id}", headers=auth(admin), json={"credit": 120})
    assert balance.status_code == 200, balance.text
    assert client.get("/users/current", headers=auth(customer)).json()["credit"] == 120
    payload = booking(inventory)
    created_booking = client.post("/reservations/", headers=auth(customer), json=payload)
    assert created_booking.status_code == 201, created_booking.text
    booking_id = created_booking.json()["id"]
    assert client.get("/users/current", headers=auth(customer)).json()["credit"] == 115
    all_bookings = client.get("/reservations/", headers=auth(admin))
    assert all_bookings.status_code == 200
    assert any(int(row["id"]) == int(booking_id) for row in all_bookings.json())
    start = datetime.fromisoformat(payload["reservation_start"])
    updated_booking = client.patch(f"/reservations/{booking_id}", headers=auth(admin), json={"reservation_end": (start + timedelta(hours=2)).isoformat(), "duration": 120})
    assert updated_booking.status_code == 200, updated_booking.text
    own_bookings = client.get(f"/reservations/by-user/{customer.user_name}", headers=auth(customer))
    assert own_bookings.status_code == 200
    assert own_bookings.json()[0]["duration"] == 120
    assert own_bookings.json()[0]["total_cost"] == 12
    assert client.get("/users/current", headers=auth(customer)).json()["credit"] == 108
    assert client.get("/reports/", headers=auth(admin)).status_code == 200
    assert client.get("/reports/", headers=auth(customer)).status_code == 403
    assert client.get("/users/", headers=auth(customer)).status_code == 403
    assert client.patch(f"/products/{product.id}", headers=auth(customer), data={"price": "1"}).status_code == 403


def test_event_registration_admin_confirmation_and_removal_reach_customer(client, db, users, auth):
    customer, other, admin = users
    event = Event(name="Integration race", date=(local_now() + timedelta(days=7)).date(), is_active=True)
    db.add(event)
    db.commit()
    payload = dict(first_name=customer.first_name, last_name=customer.last_name,
                   email=customer.email, phone_number=customer.phone_number)
    registration = client.post("/event_registrations/", json=payload)
    assert registration.status_code == 201, registration.text
    registration_id = registration.json()["id"]
    duplicate = client.post("/event_registrations/", json=payload)
    assert duplicate.status_code == 409, duplicate.text
    listing = client.get("/event_registrations/", headers=auth(admin))
    assert listing.status_code == 200, listing.text
    assert listing.json()["total_unpaid"] == 1
    assert listing.json()["users"][0]["id"] == registration_id
    changed = client.patch(f"/event_registrations/{registration_id}", headers=auth(admin), json={"status": "CONFIRMED"})
    assert changed.status_code == 200, changed.text
    own_url = f"/event_registrations/by_email/{customer.email}"
    assert client.get(own_url, headers=auth(customer)).json()["status"] == "CONFIRMED"
    assert client.get(own_url, headers=auth(other)).status_code == 403
    assert client.patch(f"/event_registrations/{registration_id}", headers=auth(customer), json={"status": "CONFIRMED"}).status_code == 403
    assert client.delete(f"/event_registrations/{registration_id}", headers=auth(admin)).status_code == 200
    assert client.get(own_url, headers=auth(customer)).json() is None


def test_admin_cancellation_and_deletion_reconcile_customer_views(client, users, inventory, auth):
    customer, other, admin = users
    product = inventory[2]
    order = client.post("/orders/", headers=auth(customer), json={"items": [{"product_id": product.id, "quantity": 2, "price": 0}]})
    assert order.status_code == 201, order.text
    order_id = order.json()["id"]
    assert next(p for p in client.get("/products/").json() if int(p["id"]) == product.id)["stock_quantity"] == 3
    cancelled = client.patch(f"/orders/{order_id}", headers=auth(admin), json={"status": "CANCELLED"})
    assert cancelled.status_code == 200, cancelled.text
    assert client.get(f"/orders/by-username/{customer.user_name}", headers=auth(customer)).json()[0]["status"] == "CANCELLED"
    assert next(p for p in client.get("/products/").json() if int(p["id"]) == product.id)["stock_quantity"] == 5
    assert client.delete(f"/orders/{order_id}", headers=auth(admin)).status_code == 204
    assert client.get(f"/orders/by-username/{customer.user_name}", headers=auth(customer)).json() == []
    reservation = client.post("/reservations/", headers=auth(customer), json=booking(inventory))
    assert reservation.status_code == 201, reservation.text
    reservation_id = reservation.json()["id"]
    assert client.get(f"/reservations/by-user/{customer.user_name}", headers=auth(other)).status_code == 403
    assert client.delete(f"/reservations/{reservation_id}", headers=auth(admin)).status_code == 204
    assert client.get("/users/current", headers=auth(customer)).json()["credit"] == 100
    own_reservations = client.get(f"/reservations/by-user/{customer.user_name}", headers=auth(customer))
    assert own_reservations.status_code == 200, own_reservations.text
    assert own_reservations.json() == []


def test_product_creation_requires_description_and_real_image(client, users, inventory, auth, monkeypatch, tmp_path):
    monkeypatch.setattr("src.utils.upload_image.STATIC_ROOT", tmp_path / "static")
    data = dict(name="New wheel", description="Complete wheel description", price="20", stock_quantity="1", category_id=str(inventory[2].category_id))
    headers = auth(users[2])
    assert client.post("/products/", headers=headers, data=data).status_code == 422
    image = BytesIO()
    Image.new("RGB", (16, 16), "red").save(image, format="PNG")
    file = {"image": ("wheel.png", image.getvalue(), "image/png")}
    assert client.post("/products/", headers=headers, data={**data, "description": "   "}, files=file).status_code == 422
    assert client.post("/products/", headers=headers, data=data, files={"image": ("fake.png", b"not an image", "image/png")}).status_code == 422
    created = client.post("/products/", headers=headers, data=data, files=file)
    assert created.status_code == 201, created.text
    assert created.json()["img_url"]
    # Editing stock or price keeps the already uploaded image.
    updated = client.patch(f'/products/{created.json()["id"]}', headers=headers, data={"price": "25"})
    assert updated.status_code == 200, updated.text
    assert updated.json()["img_url"] == created.json()["img_url"]


def test_checkout_rejects_two_units_when_only_one_is_in_stock(client, db, users, inventory, auth):
    product = inventory[2]
    product.stock_quantity = 1
    db.add(product)
    db.commit()
    response = client.post("/orders/", headers=auth(users[0]), json={"items": [{"product_id": product.id, "quantity": 2, "price": 20}]})
    assert response.status_code == 507, response.text
    db.refresh(product)
    assert product.stock_quantity == 1
    assert db.exec(select(Order)).all() == []
