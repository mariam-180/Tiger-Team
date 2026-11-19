import test from 'node:test';
import assert from 'node:assert/strict';
import { getCategorySelectValue } from '../src/utils/productData.mjs';

test('editing a product uses the exact available category value despite padded API IDs', () => {
  const categories = [{ id: '000001' }, { id: '000002' }];
  assert.equal(getCategorySelectValue(categories, 1), '000001');
  assert.equal(getCategorySelectValue(categories, '1'), '000001');
  assert.equal(getCategorySelectValue(categories, '000002'), '000002');
  assert.equal(getCategorySelectValue([{ id: 1 }], '000001'), 1);
});

test('loading or removed categories leave the select empty without choosing another category', () => {
  assert.equal(getCategorySelectValue([], 1), '');
  assert.equal(getCategorySelectValue([{ id: '000002' }], 1), '');
  assert.equal(getCategorySelectValue([{ id: '000001' }], null), '');
  assert.equal(getCategorySelectValue([{ id: 'abc' }], 'abc'), 'abc');
});
