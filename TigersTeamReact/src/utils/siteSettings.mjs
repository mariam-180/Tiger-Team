export const SITE_SETTINGS = [
  {
    name: 'ShowPrices',
    title: 'Product prices',
    area: 'Products',
    type: 'BOOLEAN',
    description:
      'Show or hide prices on product cards. Product prices and server-calculated order totals stay the same.',
    on: 'Prices visible',
    off: 'Prices hidden',
    fallback: 'Prices hidden',
    value: 'false',
  },
  {
    name: 'EventComingSoon',
    title: 'Championship coming soon',
    area: 'Championship and home preview',
    type: 'BOOLEAN',
    description:
      'Show the coming-soon screen instead of the championship page and hide its home-page preview. This does not close registration in the backend.',
    on: 'Coming-soon screen',
    off: 'Championship visible',
    fallback: 'Championship visible',
    value: 'false',
  },
  {
    name: 'EventStartDate',
    title: 'Championship countdown',
    area: 'Championship',
    type: 'DATE',
    description:
      'Set the countdown target date and time. Event records and registration dates are managed separately in Events.',
    fallback: 'No countdown target',
    value: '',
  },
  {
    name: 'SponsorAdsEnabled',
    title: 'Sponsor announcement strip',
    area: 'Home page',
    type: 'BOOLEAN',
    description:
      'Show or hide the scrolling sponsor strip on the home page. Set its text in Sponsor messages.',
    on: 'Strip visible',
    off: 'Strip hidden',
    fallback: 'Strip hidden',
    value: 'false',
  },
  {
    name: 'SponsorAdsTexts',
    title: 'Sponsor messages',
    area: 'Home page',
    type: 'STRING',
    description:
      'Write sponsor messages separated by commas. These appear only when Sponsor announcement strip is enabled.',
    fallback: 'No sponsor messages',
    value: '',
  },
];

export function settingSummary(definition, record) {
  if (!record) return definition.fallback;
  if (definition.type === 'BOOLEAN')
    return record.value === 'true' ? definition.on : definition.off;
  if (definition.type === 'DATE') {
    const date = new Date(record.start_date || '');
    return Number.isNaN(date.getTime())
      ? 'No valid countdown target'
      : date.toLocaleString();
  }
  return record.value || definition.fallback;
}

export function settingPayload(definition, record) {
  const data = {
    name: definition?.name || record.name,
    value: record.value,
    value_type: definition?.type || record.value_type,
  };
  if (data.value_type === 'DATE') {
    const date = new Date(record.start_date || '');
    if (!Number.isFinite(date.getTime()))
      throw new Error('Choose a valid start date and time.');
    data.start_date = date.toISOString();
    data.end_date = record.end_date || null;
    if (definition) data.value = data.start_date;
  }
  if (data.value_type === 'JSON') {
    try {
      JSON.parse(data.value);
    } catch {
      throw new Error('Enter valid JSON.');
    }
  }
  if (data.value_type === 'INTEGER' && !/^-?\d+$/.test(data.value))
    throw new Error('Enter a whole number.');
  return data;
}

export function localDateInput(value) {
  const date = new Date(value || '');
  return Number.isFinite(date.getTime())
    ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : '';
}
