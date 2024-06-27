// timeUtils.js

export function formatTime(isoDateString, addThreeHours = false) {
  const date = new Date(isoDateString);

  if (addThreeHours) {
    date.setHours(date.getHours() + 3);
  }

  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Amman',
  });
}
