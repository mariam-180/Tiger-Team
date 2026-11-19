import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import {
  adminSections,
  visibleAdminSections,
} from '../src/pages/admin/adminSections.mjs';
import { filterTableRows } from '../src/utils/tableData.mjs';
import { navigationForRole } from '../src/utils/accountRoles.mjs';

test('staff navigation opens management tools while customer navigation stays unchanged', () => {
  const routes = [
    { name: 'Reservations', route: '/reservations' },
    { name: 'Products', route: '/products' },
    { name: 'Admin', route: '/admin', requiredRole: 'EMPLOYEE_USER' },
  ];
  assert.deepEqual(
    navigationForRole(routes, null).map((item) => item.route),
    ['/reservations', '/products'],
  );
  assert.deepEqual(
    navigationForRole(routes, 'END_USER').map((item) => item.route),
    ['/reservations', '/products'],
  );
  assert.deepEqual(
    navigationForRole(routes, 'SUPER_USER').map((item) => item.route),
    ['/admin'],
  );
  assert.equal(routes[0].route, '/reservations');
});

test('administration navigation excludes tools outside the current role', () => {
  assert.equal(visibleAdminSections('END_USER').length, 0);
  assert.equal(visibleAdminSections(undefined).length, 0);
  const employee = visibleAdminSections('EMPLOYEE_USER');
  assert.equal(employee.length, 0);
  assert.equal(visibleAdminSections('SUPER_USER').length, adminSections.length);
});

test('table searches rendered labels, customer emails, numbers and nested text', () => {
  const customer = () => null;
  const rows = [
    {
      values: {
        author: createElement(customer, {
          email: 'driver@example.com',
          name: 'Sara',
        }),
        credit: 0,
        role: createElement('span', null, 'END USER'),
      },
    },
    {
      values: {
        author: 'Other driver',
        credit: 125,
        status: createElement('span', null, [
          'Awaiting ',
          createElement('strong', { key: 'status' }, 'payment'),
        ]),
      },
    },
  ];
  for (const query of ['DRIVER@EXAMPLE.COM', 'Sara', 'end user', '0'])
    assert.deepEqual(filterTableRows(rows, [], query), [rows[0]]);
  assert.deepEqual(filterTableRows(rows, [], 'payment'), [rows[1]]);
  assert.deepEqual(filterTableRows(rows, [], '125'), [rows[1]]);
  assert.deepEqual(filterTableRows(rows, [], ''), rows);
  assert.deepEqual(filterTableRows(rows, [], 'nonexistent'), []);
  assert.deepEqual(filterTableRows([], [], 'anything'), []);
});
