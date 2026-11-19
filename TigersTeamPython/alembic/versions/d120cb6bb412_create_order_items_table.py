"""create order_items table

Revision ID: d120cb6bb412
Revises: 5667d18169d9
Create Date: 2024-08-18 09:36:42.782186

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


# revision identifiers, used by Alembic.
revision: str = 'd120cb6bb412'
down_revision: Union[str, None] = '5667d18169d9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('order_item',
        sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('order_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('product_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False, onupdate=sa.text('now()')),
        sa.ForeignKeyConstraint(['order_id'], ['order.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['product.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('order_item')
