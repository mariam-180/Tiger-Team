"""add availability and show_stock_quantity columns to products table

Revision ID: 3c37380b76f0
Revises: 2d6b0a0f78b3
Create Date: 2024-08-30 16:39:51.568965

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '3c37380b76f0'
down_revision: Union[str, None] = '2d6b0a0f78b3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

availability_enum = sa.Enum('IN_STOCK', 'PRE_ORDER', name='availability_enum')

def upgrade() -> None:
    availability_enum.create(op.get_bind(), checkfirst=True)

    op.add_column('product', 
        sa.Column('availability', sa.Enum('IN_STOCK', 'PRE_ORDER', name='availability_enum'), 
                  server_default='IN_STOCK', nullable=False)
    )
    op.add_column('product', 
        sa.Column('show_stock_quantity', sa.Boolean(), 
                  server_default='1', nullable=False)
    )


def downgrade() -> None:
    op.drop_column('product', 'availability')
    op.drop_column('product', 'show_stock_quantity')
    
    availability_enum.drop(op.get_bind(), checkfirst=True)
