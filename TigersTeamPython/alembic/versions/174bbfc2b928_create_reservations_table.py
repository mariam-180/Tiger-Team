"""create Reservations table

Revision ID: 174bbfc2b928
Revises: 0e55157e0975
Create Date: 2024-05-27 16:35:28.994720

"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import mysql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '174bbfc2b928'
down_revision: Union[str, None] = '0e55157e0975'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'reservation',
        sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('branch_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('pc_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('user_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('reservation_start', sa.DateTime(), nullable=False),
        sa.Column('reservation_end', sa.DateTime(), nullable=False),
        sa.Column('duration', sa.Integer(), nullable=False),
        sa.Column('total_cost', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['pc_id'], ['pc.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id']),
        sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###

def downgrade() -> None:
    op.drop_table('reservation')
