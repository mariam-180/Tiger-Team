"""Exercise the isolated Docker preview through Nginx, including real DB writes."""
from datetime import datetime, timedelta
from io import BytesIO
from pathlib import Path
from zoneinfo import ZoneInfo
import json
import secrets
import re
import subprocess
import httpx
from PIL import Image

root = Path(__file__).resolve().parents[1]
credentials = (root / '.local/docker-admin-access.txt').read_text().splitlines()
username = credentials[0].split(': ', 1)[1]
password = credentials[1].split(': ', 1)[1]
checks = []


def check(name, condition):
    assert condition, name
    checks.append(name)
    print('PASS:', name)


with httpx.Client(base_url='http://127.0.0.1:3001', timeout=30) as client:
    check('React homepage', client.get('/').status_code == 200)
    check('API and database health', client.get('/api/health').json()['status'] == 'ok')
    check('Anonymous access is rejected', client.get('/api/users/current').status_code == 401)
    login = client.post('/api/users/token', data={'username': username, 'password': password})
    check('Login through Nginx', login.status_code == 200)
    client.headers['Authorization'] = 'Bearer ' + login.json()['access_token']
    user = client.get('/api/users/current').json()
    check('Current user and role', user['role'] == 'SUPER_USER' and user['user_name'] == username)
    check('Reports API', client.get('/api/reports/').status_code == 200)
    check('API documentation uses public prefix', '/api/openapi.json' in client.get('/api/docs').text)
    check('Raw SRS management API is hidden', client.get('/srs-api/api/v1/streams/').status_code == 404)
    categories = client.get('/api/categories/').json()
    products = client.get('/api/products/').json()
    check('Seeded catalog', bool(categories) and bool(products))
    product = products[0]
    check('Product image', client.get(product['img_url']).status_code == 200)
    order = client.post('/api/orders/', json={'items': [{'product_id': int(product['id']), 'quantity': 1, 'price': 0}]})
    check('Checkout ignores browser price', order.status_code == 201 and order.json()['total_amount'] == product['price'])
    check('Order deletion', client.delete('/api/orders/' + order.json()['id']).status_code == 204)
    restored = client.get('/api/products/' + product['id']).json()
    check('Stock restored once', restored['stock_quantity'] == product['stock_quantity'])
    branch = client.get('/api/branches/').json()[0]
    start = (datetime.now(ZoneInfo('Asia/Amman')) + timedelta(days=2)).replace(second=0, microsecond=0)
    payload = {'branch_id': branch['id'], 'pc_id': 1, 'reservation_start': start.isoformat(),
               'reservation_end': (start + timedelta(minutes=30)).isoformat(), 'duration': 30, 'total_cost': 0}
    reservation = client.post('/api/reservations/', json=payload)
    check('Reservation charges server price', reservation.status_code == 201 and reservation.json()['total_cost'] > 0)
    check('Conflicting reservation rejected', client.post('/api/reservations/', json=payload).status_code == 409)
    check('Reservation cancellation', client.delete('/api/reservations/' + str(reservation.json()['id'])).status_code == 204)
    check('Future cancellation refunds balance', client.get('/api/users/current').json()['credit'] == user['credit'])
    image = BytesIO()
    Image.new('RGB', (12, 12), 'red').save(image, format='WEBP')
    response = client.post('/api/products/', data={'name': 'Gateway smoke ' + secrets.token_hex(4),
        'description': 'Temporary integration test', 'price': '10', 'stock_quantity': '1',
        'category_id': categories[0]['id']}, files={'image': ('Wheel.webp', image.getvalue(), 'image/webp')})
    check('Image upload', response.status_code == 201)
    uploaded = response.json()
    check('Uploaded image served', client.get(uploaded['img_url']).status_code == 200)
    check('Temporary product removed', client.delete('/api/products/' + uploaded['id']).status_code == 204)
    demo_name = 'gateway_' + secrets.token_hex(5)
    response = client.post('/api/users/', json={'first_name': demo_name, 'last_name': 'Test',
        'user_name': demo_name, 'email': demo_name + '@example.com', 'phone_number': demo_name,
        'password': 'TemporaryTestPassword123', 'role': 'SUPER_USER', 'credit': 99999, 'is_verified': True})
    check('Signup writes a development verification email', response.status_code == 201)
    check('Unverified login is rejected', client.post('/api/users/token', data={
        'username': demo_name, 'password': 'TemporaryTestPassword123'}).status_code == 403)
    docker = r'C:\Users\mariam\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe'
    reader = "from pathlib import Path; import os; print(next(p.read_text() for p in Path(os.environ['MAIL_OUTBOX']).glob('*.html') if " + repr(demo_name) + " in p.read_text()))"
    message = subprocess.check_output([docker, 'compose', '--env-file', str(root / '.local/compose-validation.env'),
        '-p', 'tigers-validation', 'exec', '-T', 'api', 'python', '-c', reader], cwd=root, text=True)
    link = re.search(r'http://localhost:3001/api/users/verify-email\?token=[A-Za-z0-9_-]+', message).group(0)
    check('Email verification redirect', client.get(link).status_code == 307)
    login = client.post('/api/users/token', data={'username': demo_name, 'password': 'TemporaryTestPassword123'})
    check('Verified customer login', login.status_code == 200)
    customer = client.get('/api/users/current', headers={'Authorization': 'Bearer ' + login.json()['access_token']}).json()
    check('Signup did not grant admin role or balance', customer['role'] == 'END_USER' and customer['credit'] == 0)
    check('Temporary customer removed', client.delete('/api/users/' + customer['id']).status_code == 204)

(root / 'docs/gateway-checks.json').write_text(json.dumps({'checks': checks, 'passed': len(checks)}, indent=2))
print(f'{len(checks)} gateway checks passed.')
