import dayjs from 'dayjs';

/**
 * Validate if the given date and time are not in the past.
 *
 * @param {dayjs.Dayjs} date
 * @param {dayjs.Dayjs} time
 * @return {boolean}
 */
export const validateDateTime = (date, time) => {
  const currentDate = dayjs();
  const selectedDateTime = date.hour(time.hour()).minute(time.minute());

  return selectedDateTime.isAfter(currentDate);
};

export default validateDateTime;
