export function getCategorySelectValue(categories, categoryId) {
  if (categoryId === null || categoryId === undefined || categoryId === '')
    return '';
  const normalize = (value) => String(value).replace(/^0+(?=\d)/, '');
  return (
    categories.find(
      (category) => normalize(category.id) === normalize(categoryId),
    )?.id ?? ''
  );
}

export function groupProductsByCategory(categories, products) {
  return Object.fromEntries(
    categories.map((category) => [
      category.id,
      products.filter(
        (product) => Number(product.category_id) === Number(category.id),
      ),
    ]),
  );
}

export function getCategorySectionId(category) {
  return `category-${encodeURIComponent(String(category.id))}-products`;
}

export async function loadAllProducts(fetchPage, pageSize = 100) {
  const products = [];
  for (let skip = 0; ; skip += pageSize) {
    const page = await fetchPage({ skip, limit: pageSize });
    if (!Array.isArray(page)) throw new Error('Invalid products response');
    products.push(...page);
    if (page.length < pageSize) return products;
  }
}
