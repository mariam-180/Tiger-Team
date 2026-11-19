const sameId = (a, b) =>
  String(a).replace(/^0+(?=\d)/, '') === String(b).replace(/^0+(?=\d)/, '');

export function stockLimit(product) {
  const stock = Number(product?.stock_quantity);
  return Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;
}

export function cartQuantity(cart, product) {
  return cart.find((item) => sameId(item.id, product.id))?.quantity || 0;
}

export function setCartQuantity(cart, product, requested) {
  if (!Number.isFinite(Number(requested))) return cart;
  const quantity = Math.min(
    stockLimit(product),
    Math.max(0, Math.floor(Number(requested))),
  );
  const existing = cart.some((item) => sameId(item.id, product.id));
  if (quantity === 0)
    return cart.filter((item) => !sameId(item.id, product.id));
  if (!existing) return [...cart, { ...product, quantity }];
  return cart.map((item) =>
    sameId(item.id, product.id) ? { ...item, ...product, quantity } : item,
  );
}

export function reconcileCartStock(cart, products) {
  return cart.flatMap((item) => {
    const current = products.find((product) => sameId(product.id, item.id));
    if (!current || stockLimit(current) === 0) return [];
    return [
      {
        ...item,
        ...current,
        quantity: Math.min(item.quantity, stockLimit(current)),
      },
    ];
  });
}
