import test from 'node:test';
import assert from 'node:assert/strict';
import { sortPcs, hasFixedPcLayout } from '../src/utils/pcLayout.mjs';

test('API ordering does not change numbered positions on the physical map', () => {
  const pcs = [3, 1, 2, 7, 5, 6, 4].map((pc_number) => ({ pc_number }));
  const ordered = sortPcs(pcs);
  assert.equal(hasFixedPcLayout(ordered, 7), true);
  assert.equal(pcs[0].pc_number, 3);
});

test('empty, expanded, reduced, and nonconsecutive inventories use the adaptive grid', () => {
  for (const numbers of [
    [],
    [1],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 9],
  ]) {
    assert.equal(
      hasFixedPcLayout(sortPcs(numbers.map((pc_number) => ({ pc_number }))), 7),
      false,
    );
  }
});
