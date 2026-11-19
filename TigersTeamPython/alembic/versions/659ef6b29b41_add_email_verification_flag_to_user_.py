"""Add email verification flag to user table

Revision ID: 659ef6b29b41
Revises: 174bbfc2b928
Create Date: 2024-06-04 12:34:54.993854

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision: str = '659ef6b29b41'
down_revision: Union[str, None] = '174bbfc2b928'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def column_exists(table_name: str, column_name: str, connection) -> bool:
    inspector = Inspector.from_engine(connection)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def upgrade() -> None:
    connection = op.get_bind()
    if not column_exists('user', 'is_verified', connection):
        op.add_column('user', sa.Column('is_verified', sa.Boolean(), server_default=sa.text('0'), nullable=False))
    if not column_exists('user', 'verification_token', connection):
        op.add_column('user', sa.Column('verification_token', sa.String(length=255), nullable=True))


def downgrade() -> None:
    connection = op.get_bind()
    if column_exists('user', 'is_verified', connection):
        op.drop_column('user', 'is_verified')
    if column_exists('user', 'verification_token', connection):
        op.drop_column('user', 'verification_token')
