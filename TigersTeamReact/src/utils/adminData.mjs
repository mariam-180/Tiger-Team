export function isClosedBranch(name) {
  return (
    String(name || '')
      .toLowerCase()
      .replace(/[\s_-]/g, '') === 'snokardo'
  );
}

export function buildReportParams(filters) {
  const params = {};
  if (filters.actor) params.user_id = filters.actor;
  if (filters.action) params.action = filters.action;
  if (filters.area) params.table_name = filters.area;
  const start = filters.from ? new Date(`${filters.from}T00:00:00`) : null;
  const end = filters.to ? new Date(`${filters.to}T23:59:59.999`) : null;
  if (
    (start && Number.isNaN(start.getTime())) ||
    (end && Number.isNaN(end.getTime()))
  )
    throw new Error('Choose valid report dates.');
  if (start && end && start > end)
    throw new Error('The start date must be before the end date.');
  if (start) params.start_date = start.toISOString();
  if (end) params.end_date = end.toISOString();
  return params;
}

export function reservationFingerprint(record) {
  return JSON.stringify([
    record.updated_at,
    record.branch_id,
    record.pc_id,
    record.user_id,
    record.reservation_start,
    record.reservation_end,
    record.duration,
    record.total_cost,
  ]);
}

// The API stores venue-local timestamps in BUSINESS_TIMEZONE (Asia/Amman).
export function reservationTimestamp(value) {
  if (!value) return NaN;
  return Date.parse(
    /[Zz]|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}+03:00`,
  );
}

export function reservationInputValue(value) {
  const timestamp = reservationTimestamp(value);
  return Number.isNaN(timestamp)
    ? ''
    : new Date(timestamp + 3 * 3600000).toISOString().slice(0, 19);
}

export function reportTimestamp(value) {
  if (!value) return NaN;
  // Report records use naive UTC in the database, unlike venue booking times.
  return Date.parse(/[Zz]|[+-]\d{2}:\d{2}$/.test(value) ? value : `${value}Z`);
}
