"""Add reset token and expiry to user table

Revision ID: bc415d26ed9d
Revises: 33619f9852bc
Create Date: 2024-07-05 12:13:50.064620

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'bc415d26ed9d'
down_revision: Union[str, None] = '33619f9852bc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user', sa.Column('reset_token', sa.String(length=255), nullable=True))
    op.add_column('user', sa.Column('reset_token_expiry', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('user', 'reset_token')
    op.drop_column('user', 'reset_token_expiry')