"""create controllers table with flexible control

Revision ID: 2d6b0a0f78b3
Revises: d120cb6bb412
Create Date: 2024-08-26 08:41:23.962424

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '2d6b0a0f78b3'
down_revision: Union[str, None] = 'd120cb6bb412'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

value_type_enum = sa.Enum('STRING', 'INTEGER', 'BOOLEAN', 'DATE', 'JSON', name='value_type_enum')

def upgrade() -> None:
    op.create_table(
        'controller',
        sa.Column('id', sa.Integer, primary_key=True, index=True),
        sa.Column('name', sa.String(255), unique=True, nullable=False),
        sa.Column('value', sa.Text, nullable=False),
        sa.Column('value_type', value_type_enum, nullable=False, server_default='STRING'),
        sa.Column('start_date', sa.DateTime, nullable=True),
        sa.Column('end_date', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('controller')
    value_type_enum.drop(op.get_bind())
