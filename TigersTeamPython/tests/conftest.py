import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
for key, value in {
    "ENV": "test", "SECRET_KEY": "test-secret-for-isolated-regression-tests-only",
    "MYSQL_USER": "test", "MYSQL_PASSWORD": "test", "MYSQL_HOST": "localhost",
    "MYSQL_PORT": "3306", "MYSQL_DATABASE": "test", "DATABASE_URL": "sqlite://",
    "EMAIL_DELIVERY": "file", "LOG_DIRECTORY": ".local/test-logs",
}.items():
    os.environ[key] = value

import bcrypt
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine
from src.app import app
from src.api.dependencies import get_db
from src.infra.db.tables import User, UserRole, Branch, PC, Category, Product
from src.infra.security.authentication import create_access_token


@pytest.fixture
def db():
    url = os.getenv("TIGERS_TEST_DATABASE_URL")
    if url:
        engine = create_engine(url, hide_parameters=True)
    else:
        engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
        SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
        session.rollback()
        if url:
            # Tests use a newly-created disposable database, never a user database.
            for table in reversed(SQLModel.metadata.sorted_tables):
                session.execute(table.delete())
            session.commit()
    engine.dispose()


@pytest.fixture
def users(db):
    users = []
    for name, role in (("customer", UserRole.END_USER), ("other", UserRole.END_USER), ("admin", UserRole.SUPER_USER)):
        user = User(first_name=name, last_name="Test", email=f"{name}@example.com",
                    phone_number=name, user_name=name,
                    password=bcrypt.hashpw(b"TestPassword123", bcrypt.gensalt()).decode(),
                    role=role, credit=100, is_verified=True)
        db.add(user)
        users.append(user)
    db.commit()
    return users


@pytest.fixture
def inventory(db):
    branch = Branch(name="Test branch", location="Cairo", price=6, total_price={"60": 5})
    category = Category(name="Test category")
    db.add(branch)
    db.add(category)
    db.flush()
    pc = PC(branch_id=branch.id, pc_number="1")
    product = Product(name="Wheel", description="Test", category_id=category.id, price=20, stock_quantity=5)
    db.add(pc)
    db.add(product)
    db.commit()
    return branch, pc, product


@pytest.fixture
def client(db):
    def override():
        yield db
    app.dependency_overrides[get_db] = override
    with TestClient(app, raise_server_exceptions=False) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
def auth():
    return lambda user: {"Authorization": f"Bearer {create_access_token(user)}"}
