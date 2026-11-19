import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cartQuantity,
  setCartQuantity,
  reconcileCartStock,
} from '../src/utils/cartStock.mjs';

test('a single remaining unit cannot be added twice or increased beyond stock', () => {
  const product = { id: '000001', stock_quantity: 1, price: 20 };
  let cart = [];
  for (let i = 0; i < 5; i += 1)
    cart = setCartQuantity(cart, product, cartQuantity(cart, product) + 1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 1);
  assert.equal(setCartQuantity(cart, product, 10)[0].quantity, 1);
  assert.deepEqual(setCartQuantity(cart, product, 0), []);
});

test('zero stock cannot be added; catalog changes update prices and cap quantities', () => {
  assert.deepEqual(setCartQuantity([], { id: 1, stock_quantity: 0 }, 1), []);
  const cart = [
    { id: 1, quantity: 3, price: 20 },
    { id: 2, quantity: 1 },
  ];
  const updated = reconcileCartStock(cart, [
    { id: '000001', stock_quantity: 1, price: 30 },
  ]);
  assert.equal(updated.length, 1);
  assert.equal(updated[0].quantity, 1);
  assert.equal(updated[0].price, 30);
});
