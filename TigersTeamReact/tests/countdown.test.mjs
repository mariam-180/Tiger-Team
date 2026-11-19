import test from 'node:test';
import assert from 'node:assert/strict';
import { getCountdown } from '../src/utils/countdown.mjs';

test('counts every unit using the full API timestamp and timezone', () => {
  const now = Date.parse('2026-10-26T12:00:00Z');
  assert.deepEqual(getCountdown('2026-10-27T16:02:03+03:00', now), {
    started: false,
    timeLeft: { days: 1, hours: 1, minutes: 2, seconds: 3 },
  });
  assert.equal(
    getCountdown('2026-10-27T16:02:03+03:00', now + 1000).timeLeft.seconds,
    2,
  );
});

test('missing and invalid dates are unconfigured; past dates are finished', () => {
  for (const date of [null, undefined, '', 'invalid']) {
    assert.equal(getCountdown(date), null);
  }
  assert.deepEqual(getCountdown('2024-11-22', Date.parse('2026-10-26')), {
    started: true,
    timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
  });
});
