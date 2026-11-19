"""Create report table

Revision ID: 33619f9852bc
Revises: 659ef6b29b41
Create Date: 2024-06-30 18:08:40.576992

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


# revision identifiers, used by Alembic.
revision: str = "33619f9852bc"
down_revision: Union[str, None] = "659ef6b29b41"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reports",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column(
            "timestamp", sa.DateTime, nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "user_id", mysql.INTEGER(display_width=6, zerofill=True), nullable=False
        ),
        sa.Column("action", sa.String(255), nullable=False),
        sa.Column("table_name", sa.String(255), nullable=False),
        sa.Column("record_id", sa.Integer, nullable=False),
        sa.Column("description", sa.String(255), nullable=False),
        sa.Column("details", sa.JSON, nullable=True),
        sa.UniqueConstraint("id", name="uq_report_id"),
    )


def downgrade() -> None:
    op.drop_table("reports")
