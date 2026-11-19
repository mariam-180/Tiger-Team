export function safeRedirect(value, fallback = '/') {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !/[\\\x00-\x20]/.test(value)
    ? value
    : fallback;
}

export function apiErrorMessage(data, fallback) {
  if (typeof data?.detail === 'string') return data.detail;
  if (Array.isArray(data?.detail))
    return data.detail
      .map((item) => `${item.loc?.slice(1).join(' ') || 'Field'}: ${item.msg}`)
      .join('. ');
  if (typeof data?.failure_detail === 'string') return data.failure_detail;
  return fallback;
}
