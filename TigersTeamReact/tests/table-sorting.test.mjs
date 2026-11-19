import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { sortTableRows } from '../src/utils/tableData.mjs';

const row = (value, raw) => ({
  values: { field: value },
  original: { __sortValues: raw === undefined ? {} : { field: raw } },
});
test('numbers, padded IDs, PC labels and rendered status labels sort by their actual values', () => {
  assert.ok(sortTableRows(row(2.5), row(10), 'field') < 0);
  assert.ok(sortTableRows(row('000002'), row('000010'), 'field') < 0);
  assert.ok(sortTableRows(row('PC 2'), row('PC 10'), 'field') < 0);
  assert.ok(
    sortTableRows(
      row(React.createElement('span', { label: 'Cancelled' })),
      row(React.createElement('span', { label: 'Pending' })),
      'field',
    ) < 0,
  );
});
test('formatted dates sort chronologically across days, months and years using raw timestamps', () => {
  const december = row('31/12/2025, 23:59', Date.parse('2025-12-31T23:59:00Z'));
  const january = row('01/01/2026, 00:00', Date.parse('2026-01-01T00:00:00Z'));
  assert.ok(sortTableRows(december, january, 'field') < 0);
  assert.equal(sortTableRows(row(null), row(undefined), 'field'), 0);
});
