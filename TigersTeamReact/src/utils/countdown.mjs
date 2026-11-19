export function getCountdown(targetDate, now = Date.now()) {
  const target =
    typeof targetDate === 'string' && targetDate.trim()
      ? Date.parse(targetDate)
      : NaN;
  if (!Number.isFinite(target)) return null;
  const remaining = Math.max(0, Math.floor((target - now) / 1000));
  return {
    started: target <= now,
    timeLeft: {
      days: Math.floor(remaining / 86400),
      hours: Math.floor((remaining / 3600) % 24),
      minutes: Math.floor((remaining / 60) % 60),
      seconds: remaining % 60,
    },
  };
}
