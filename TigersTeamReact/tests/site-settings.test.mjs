import test from 'node:test';
import assert from 'node:assert/strict';
import { SITE_SETTINGS, settingPayload, settingSummary } from '../src/utils/siteSettings.mjs';

test('missing settings report the same defaults used by site consumers', () => {
  for (const name of ['ShowPrices', 'EventComingSoon', 'SponsorAdsEnabled']) {
    const definition = SITE_SETTINGS.find(setting => setting.name === name);
    assert.equal(settingSummary(definition, null), settingSummary(definition, { value: 'false' }));
    assert.notEqual(settingSummary(definition, { value: 'true' }), definition.fallback);
    assert.equal(settingPayload(definition, { value: 'true' }).name, name);
  }
});

test('countdown saves the exact instant in start_date consumed by the banner', () => {
  const definition = SITE_SETTINGS.find(setting => setting.name === 'EventStartDate');
  const payload = settingPayload(definition, { value: '', start_date: '2027-01-02T15:30:00+03:00' });
  assert.equal(payload.start_date, '2027-01-02T12:30:00.000Z');
  assert.equal(payload.value, payload.start_date);
  assert.throws(() => settingPayload(definition, { start_date: '' }), /valid start date/);
});

test('custom values retain their identity and reject invalid typed values', () => {
  assert.deepEqual(settingPayload(null, { name: 'Onw', value: '1', value_type: 'STRING' }), { name: 'Onw', value: '1', value_type: 'STRING' });
  assert.throws(() => settingPayload(null, { value: '{', value_type: 'JSON' }), /valid JSON/);
  assert.throws(() => settingPayload(null, { value: '2.3', value_type: 'INTEGER' }), /whole number/);
});
