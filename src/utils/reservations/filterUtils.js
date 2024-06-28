// utils/filterUtils.js

const filterByHistoryFlag = (rows, showHistory) => {
  if (showHistory) {
    return rows;
  } else {
    return rows.filter(
      (reservation) =>
        new Date(reservation.reservation_end).getTime() >= new Date().getTime(),
    );
  }
};

export default filterByHistoryFlag;
