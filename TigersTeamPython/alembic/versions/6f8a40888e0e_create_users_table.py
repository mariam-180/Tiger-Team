"""create users table

Revision ID: 6f8a40888e0e
Revises: 
Create Date: 2024-02-05 23:01:33.066674

"""
from typing import Sequence, Union

import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import mysql

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '6f8a40888e0e'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('user',
    sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), nullable=False),
    sa.Column('user_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('first_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('last_name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('email', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('password', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('phone_number', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('role', sa.Enum('SUPER_USER', 'EMPLOYEE_USER', 'END_USER', name='userrole'), server_default='END_USER', nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('credit', sa.Float(), nullable=False, server_default='0'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_name', name='uq_user_name'),
    sa.UniqueConstraint('phone_number', name='uq_phone_number'),
    sa.UniqueConstraint('email', name='uq_email')
    )


def downgrade() -> None:
    op.drop_table('user')
