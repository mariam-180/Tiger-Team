"""create PCs table

Revision ID: 0e55157e0975
Revises: d895443ca665
Create Date: 2024-05-27 16:33:59.951555

"""
from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import mysql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '0e55157e0975'
down_revision: Union[str, None] = 'd895443ca665'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'pc',
        sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('branch_id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
        sa.Column('pc_number', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('branch_id', 'pc_number', name='uq_branch_pc_number'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('pc')
