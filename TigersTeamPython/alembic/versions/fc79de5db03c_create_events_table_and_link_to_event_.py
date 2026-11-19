"""create events table and link to event registrations

Revision ID: fc79de5db03c
Revises: 3c37380b76f0
Create Date: 2024-10-24 09:59:24.563130

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = 'fc79de5db03c'
down_revision: Union[str, None] = '3c37380b76f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Create the 'events' table
    op.create_table('events',
        sa.Column('id', mysql.INTEGER(display_width=6, zerofill=True), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='0'),
        sa.Column('date', sa.Date(), nullable=False),
        sa.UniqueConstraint('name', name='uq_events_name')
    )

    # Add the 'event_id' foreign key to 'event_registrations'
    op.add_column('event_registrations',
        sa.Column('event_id', mysql.INTEGER(display_width=6, zerofill=True), sa.ForeignKey('events.id'), nullable=True)
    )

    # Create a unique constraint for email and event_id combination
    op.create_unique_constraint('uq_event_registrations_email_event', 'event_registrations', ['email', 'event_id'])
    op.create_unique_constraint('uq_event_registrations_phone_number_event', 'event_registrations', ['phone_number', 'event_id'])

    # Drop existing unique constraints
    op.drop_constraint('uq_event_registrations_email', 'event_registrations', type_='unique')
    op.drop_constraint('uq_event_registrations_phone_number', 'event_registrations', type_='unique')
    


def downgrade():
    # Drop the trigger first
    op.execute('DROP TRIGGER IF EXISTS ensure_single_active_event')

    # Check if the unique constraint exists before trying to drop it
    conn = op.get_bind()
    result = conn.execute(text("SHOW INDEX FROM event_registrations WHERE Key_name = 'uq_event_registrations_email_event'"))
    if result.fetchone() is not None:
        op.drop_constraint('uq_event_registrations_email_event', 'event_registrations', type_='unique')

    # Check if the foreign key constraint exists before trying to drop it
    result = conn.execute(text("SHOW TABLE STATUS LIKE 'event_registrations'"))
    if result.fetchone():
        op.drop_constraint('event_registrations_ibfk_1', 'event_registrations', type_='foreignkey')

    # Drop the 'event_id' column from 'event_registrations'
    op.drop_column('event_registrations', 'event_id')

    # Recreate the original unique constraints
    op.create_unique_constraint('uq_event_registrations_email', 'event_registrations', ['email'])
    op.create_unique_constraint('uq_event_registrations_phone_number', 'event_registrations', ['phone_number'])
    
    # Drop the 'events' table
    op.drop_table('events')
