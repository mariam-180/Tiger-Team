"""Create event registrations table

Revision ID: d3395b25876b
Revises: 6f8a40888e0e
Create Date: 2024-05-12 15:09:06.608344

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


# revision identifiers, used by Alembic.
revision: str = 'd3395b25876b'
down_revision: Union[str, None] = '6f8a40888e0e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    registration_status = sa.Enum('REGISTERED', 'CONFIRMED', 'CANCELLED', name='registration_status')
    registration_status.create(op.get_bind(), checkfirst=True)

    op.create_table('event_registrations',
        sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), primary_key=True, autoincrement=True),
        sa.Column('first_name', sa.String(length=100), nullable=False),
        sa.Column('last_name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone_number', sa.String(length=15), nullable=False),
        sa.Column('registration_time', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
        sa.Column('status', registration_status, server_default='REGISTERED', nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('phone_number', name='uq_event_registrations_phone_number'),
        sa.UniqueConstraint('email', name='uq_event_registrations_email')
    )

def downgrade():
    op.drop_table('event_registrations')
    sa.Enum(name='registration_status').drop(op.get_bind(), checkfirst=True)


