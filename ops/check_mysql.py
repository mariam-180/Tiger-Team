"""Run migrations and API regressions against a disposable local MySQL database."""
import os
import secrets
import subprocess
import sys
import argparse
from pathlib import Path

import MySQLdb
from sqlalchemy.engine import URL
from sqlalchemy import create_engine
from alembic.migration import MigrationContext
from alembic.autogenerate import compare_metadata

root = Path(__file__).resolve().parents[1]
backend = root / 'TigersTeamPython'
parser = argparse.ArgumentParser(description='Validate migrations and API tests in a disposable MySQL database')
parser.add_argument('--host', default='127.0.0.1')
parser.add_argument('--port', type=int, default=13306)
parser.add_argument('--user', default='root')
parser.add_argument('--password-file', type=Path, default=root / '.local/mysql-root-secret')
args = parser.parse_args()
password = os.getenv('MYSQL_ROOT_PASSWORD') or args.password_file.read_text().strip()
database = 'tigers_regression_' + secrets.token_hex(5)
connection = MySQLdb.connect(host=args.host, port=args.port, user=args.user, passwd=password)
cursor = connection.cursor()
cursor.execute(f'CREATE DATABASE `{database}` CHARACTER SET utf8mb4')
env = {**os.environ, 'MYSQL_HOST': args.host, 'MYSQL_PORT': str(args.port), 'MYSQL_USER': args.user,
       'MYSQL_PASSWORD': password, 'MYSQL_DATABASE': database, 'ENV': 'test',
       'SECRET_KEY': secrets.token_urlsafe(48)}
env['TIGERS_TEST_DATABASE_URL'] = URL.create('mysql', username=args.user, password=password,
                                          host=args.host, port=args.port, database=database).render_as_string(hide_password=False)
try:
    subprocess.run([sys.executable, '-m', 'alembic', 'upgrade', 'head'], cwd=backend, env=env, check=True)
    sys.path.insert(0, str(backend))
    from src.infra.db.tables import SQLModel
    schema_engine = create_engine(env['TIGERS_TEST_DATABASE_URL'], hide_parameters=True)
    with schema_engine.connect() as schema_connection:
        differences = compare_metadata(MigrationContext.configure(schema_connection), SQLModel.metadata)
        assert not differences, f'Schema drift detected: {differences}'
    schema_engine.dispose()
    print('Schema comparison: zero differences.')
    subprocess.run([sys.executable, '-m', 'pytest', 'tests', '-q', '--disable-warnings', '--tb=short', '--maxfail=3'], cwd=backend, env=env, check=True)
    # Confirm migrations can return to an empty schema as well as initialize one.
    subprocess.run([sys.executable, '-m', 'alembic', 'downgrade', 'base'], cwd=backend, env=env, check=True)
    print('MySQL migration upgrade, API regressions, and downgrade passed.')
finally:
    cursor.execute(f'DROP DATABASE `{database}`')
    connection.close()
