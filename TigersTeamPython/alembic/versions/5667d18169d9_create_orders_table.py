"""create orders table

Revision ID: 5667d18169d9
Revises: 0ba8fa3ffe56
Create Date: 2024-08-18 09:36:05.558550

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '5667d18169d9'
down_revision: Union[str, None] = '0ba8fa3ffe56'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

order_status_enum = sa.Enum('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', name='orderstatus')

def upgrade() -> None:
    order_status_enum.create(op.get_bind())

    op.create_table('order',
    sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
    sa.Column('user_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
    sa.Column('total_amount', sa.Float(), nullable=False),
    sa.Column('status', order_status_enum, nullable=False, server_default='PENDING'),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False, onupdate=sa.text('now()')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
)



def downgrade() -> None:
    op.drop_table('order')
    order_status_enum.drop(op.get_bind())
