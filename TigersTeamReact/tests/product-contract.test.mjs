import test from 'node:test';
import assert from 'node:assert/strict';
import {
  groupProductsByCategory,
  getCategorySectionId,
  loadAllProducts,
} from '../src/utils/productData.mjs';

test('API category IDs with leading zeroes match numeric product foreign keys', () => {
  const products = [
    { id: '000101', category_id: 1, name: 'Wheel' },
    { id: '000102', category_id: 2, name: 'Pedal' },
  ];
  const grouped = groupProductsByCategory(
    [
      { id: '000001', name: 'Wheels' },
      { id: '000002', name: 'Pedals' },
    ],
    products,
  );
  assert.deepEqual(grouped['000001'], [products[0]]);
  assert.deepEqual(grouped['000002'], [products[1]]);
});

test('an empty category remains available without fabricating products', () => {
  assert.deepEqual(
    groupProductsByCategory([{ id: '000003', name: 'Empty' }], []),
    { '000003': [] },
  );
});

test('renaming and duplicate category names cannot mix product groups or break anchors', () => {
  const categories = [
    { id: 1, name: 'Same name' },
    { id: 2, name: 'Same name' },
  ];
  const products = [
    { id: 101, category_id: 1 },
    { id: 102, category_id: 2 },
  ];
  const grouped = groupProductsByCategory(categories, products);
  assert.deepEqual(grouped[1], [products[0]]);
  assert.deepEqual(grouped[2], [products[1]]);
  assert.notEqual(
    getCategorySectionId(categories[0]),
    getCategorySectionId(categories[1]),
  );
  assert.equal(
    getCategorySectionId(categories[0]),
    getCategorySectionId({ id: 1, name: 'Renamed' }),
  );
});

test('arbitrary category labels cannot introduce spaces or fragment delimiters into anchors', () => {
  const section = getCategorySectionId({
    id: 'a/# b',
    name: 'New / category # 1',
  });
  assert.doesNotMatch(section, /[ #/]/);
  assert.deepEqual(groupProductsByCategory([], []), {});
});

test('catalogs larger than the API default page are fully loaded without dropping later categories', async () => {
  const catalog = Array.from({ length: 205 }, (_, i) => ({
    id: i + 1,
    category_id: i < 100 ? 1 : 2,
  }));
  const calls = [];
  const products = await loadAllProducts(async ({ skip, limit }) => {
    calls.push(skip);
    return catalog.slice(skip, skip + limit);
  });
  assert.deepEqual(calls, [0, 100, 200]);
  assert.equal(products.length, 205);
  assert.equal(
    groupProductsByCategory([{ id: 2, name: 'Later category' }], products)[2]
      .length,
    105,
  );
});

test('empty catalogs terminate immediately and invalid API payloads are rejected', async () => {
  assert.deepEqual(await loadAllProducts(async () => []), []);
  await assert.rejects(
    () => loadAllProducts(async () => ({ detail: 'unavailable' })),
    /Invalid products response/,
  );
});
