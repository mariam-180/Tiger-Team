"""create products table

Revision ID: 0ba8fa3ffe56
Revises: 456ff535fca9
Create Date: 2024-08-18 09:35:04.614044

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '0ba8fa3ffe56'
down_revision: Union[str, None] = '456ff535fca9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('product',
        sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('stock_quantity', sa.Integer(), nullable=False),
        sa.Column('is_lowest_price', sa.Boolean(), server_default='0', nullable=False),
        sa.Column('category_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('img_url', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False, onupdate=sa.text('now()')),
        sa.ForeignKeyConstraint(['category_id'], ['category.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name', 'category_id', name='uq_product_name_category')
    )


def downgrade() -> None:
    op.drop_table('product')
