import argparse
from datetime import date

from sqlmodel import Session, select

from src.infra.db.engine import engine
from src.infra.db.tables import Branch, Category, Event, PC, Product
from scripts.seeders.data import BRANCHES, CATEGORIES, EVENTS, PRODUCTS


def seed_branches(session):
    for values in BRANCHES:
        branch = session.exec(
            select(Branch).where(Branch.name == values["name"])
        ).first()
        if branch is None:
            branch = Branch(**values)
            session.add(branch)
        else:
            for key, value in values.items():
                setattr(branch, key, value)
    session.commit()


def seed_categories(session):
    for name, img_url in CATEGORIES:
        category = session.exec(
            select(Category).where(Category.name == name)
        ).first()
        if category is None:
            session.add(Category(name=name, img_url=img_url))
        else:
            category.img_url = img_url
    session.commit()


def seed_pcs(session):
    branch_ids = {
        branch.name: branch.id
        for branch in session.exec(select(Branch)).all()
    }
    for branch_name, count in (("Al-Kilo Circle", 7), ("Snokardo", 5)):
        branch_id = branch_ids[branch_name]
        for number in range(1, count + 1):
            pc_number = str(number)
            pc = session.exec(
                select(PC).where(
                    PC.branch_id == branch_id, PC.pc_number == pc_number
                )
            ).first()
            if pc is None:
                session.add(PC(branch_id=branch_id, pc_number=pc_number))
    session.commit()


def seed_events(session):
    for values in EVENTS:
        values = {**values, "date": date.fromisoformat(values["date"])}
        event = session.exec(select(Event).where(Event.name == values["name"])).first()
        if event is None:
            session.add(Event(**values))
        else:
            event.date = values["date"]
            event.is_active = values["is_active"]
    session.commit()


def seed_products(session):
    category_ids = {
        category.name: category.id
        for category in session.exec(select(Category)).all()
    }
    for values in PRODUCTS:
        product_values = {
            **values,
            "category_id": category_ids[values["category"]],
            "is_lowest_price": False,
        }
        product_values.pop("category")
        product = session.exec(
            select(Product).where(
                Product.name == product_values["name"],
                Product.category_id == product_values["category_id"],
            )
        ).first()
        if product is None:
            session.add(Product(**product_values))
        else:
            for key, value in product_values.items():
                setattr(product, key, value)
    session.commit()


def main():
    parser = argparse.ArgumentParser(description="Run idempotent Tigers Team seeders")
    parser.add_argument(
        "--only",
        choices=("all", "branches", "categories", "pcs", "events", "products"),
        default="all",
    )
    args = parser.parse_args()

    with Session(engine) as session:
        if args.only in ("all", "branches"):
            seed_branches(session)
        if args.only in ("all", "categories"):
            seed_categories(session)
        if args.only in ("all", "pcs"):
            if args.only == "pcs":
                seed_branches(session)
            seed_pcs(session)
        if args.only in ("all", "events"):
            seed_events(session)
        if args.only in ("all", "products"):
            if args.only == "products":
                seed_categories(session)
            seed_products(session)
    print(f"Seed complete: {args.only}")
