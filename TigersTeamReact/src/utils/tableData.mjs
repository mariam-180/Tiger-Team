import { isValidElement } from 'react';

const naturalOrder = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

export function sortTableRows(first, second, columnId) {
  const value = (row) =>
    row.original?.__sortValues?.[columnId] ?? row.values[columnId];
  const a = value(first);
  const b = value(second);
  if (
    typeof a === 'number' &&
    typeof b === 'number' &&
    Number.isFinite(a) &&
    Number.isFinite(b)
  )
    return a - b;
  return naturalOrder.compare(searchText(a).trim(), searchText(b).trim());
}

export function searchText(value) {
  if (value == null || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  if (Array.isArray(value)) return value.map(searchText).join(' ');
  if (isValidElement(value)) {
    const { children, name, email, label, value: inputValue } = value.props;
    return [children, name, email, label, inputValue].map(searchText).join(' ');
  }
  return '';
}

export function filterTableRows(rows, _columnIds, query) {
  const text = String(query || '')
    .trim()
    .toLowerCase();
  return rows.filter((row) =>
    Object.values(row.values).some((value) =>
      searchText(value).toLowerCase().includes(text),
    ),
  );
}
