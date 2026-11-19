import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isClosedBranch,
  buildReportParams,
  reservationFingerprint,
  reservationTimestamp,
  reservationInputValue,
  reportTimestamp,
} from '../src/utils/adminData.mjs';

test('permanently closed branch is excluded regardless of label spacing or case', () => {
  for (const name of ['Snokardo', ' SNOKARDO ', 'sno-kardo', 'sno_kardo'])
    assert.equal(isClosedBranch(name), true);
  for (const name of ['Al-Kilo Circle', 'New branch', null])
    assert.equal(isClosedBranch(name), false);
});

test('report filters use exact API values and inclusive date boundaries', () => {
  assert.deepEqual(buildReportParams({}), {});
  const params = buildReportParams({
    actor: '000001',
    action: 'UPDATE',
    area: 'reservations',
    from: '2026-10-01',
    to: '2026-10-29',
  });
  assert.equal(params.user_id, '000001');
  assert.equal(params.table_name, 'reservations');
  assert.equal(new Date(params.start_date).getHours(), 0);
  assert.equal(new Date(params.end_date).getHours(), 23);
  assert.equal(new Date(params.end_date).getMilliseconds(), 999);
  assert.throws(
    () => buildReportParams({ from: '2026-10-29', to: '2026-10-01' }),
    /start date/,
  );
  assert.throws(
    () => buildReportParams({ from: 'invalid' }),
    /valid report dates/,
  );
});

test('review marks identify a particular booking revision', () => {
  const record = {
    updated_at: '2026-10-29T12:00:00',
    pc_id: 1,
    duration: 60,
    total_cost: 10,
  };
  const fingerprint = reservationFingerprint(record);
  assert.equal(reservationFingerprint({ ...record }), fingerprint);
  assert.notEqual(
    reservationFingerprint({ ...record, total_cost: 12 }),
    fingerprint,
  );
  assert.notEqual(
    reservationFingerprint({ ...record, updated_at: '2026-10-29T13:00:00' }),
    fingerprint,
  );
});

test('venue timestamps keep the same instant when editing and distinguish explicit UTC timestamps', () => {
  assert.equal(
    reservationTimestamp('2026-10-29T15:00:00'),
    reservationTimestamp('2026-10-29T12:00:00Z'),
  );
  assert.equal(
    reservationInputValue('2026-10-29T12:00:00Z'),
    '2026-10-29T15:00:00',
  );
  assert.equal(reservationInputValue('invalid'), '');
});

test('report timestamps without an offset are read as UTC', () => {
  assert.equal(
    reportTimestamp('2026-10-29T12:00:00'),
    Date.parse('2026-10-29T12:00:00Z'),
  );
  assert.equal(
    reportTimestamp('2026-10-29T15:00:00+03:00'),
    Date.parse('2026-10-29T12:00:00Z'),
  );
});
