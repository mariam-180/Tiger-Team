"""create categories table

Revision ID: 456ff535fca9
Revises: bc415d26ed9d
Create Date: 2024-08-18 09:34:07.125456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


# revision identifiers, used by Alembic.
revision: str = '456ff535fca9'
down_revision: Union[str, None] = 'bc415d26ed9d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('category',
        sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('img_url', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False, onupdate=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name', name='uq_category_name')
    )


def downgrade() -> None:
    op.drop_table('category')
