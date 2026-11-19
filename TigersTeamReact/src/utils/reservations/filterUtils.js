// utils/filterUtils.js

const filterByHistoryFlag = (rows, showHistory, showAcknowledged) => {
  return rows.filter((reservation) => {
    const isNotExpired =
      new Date(reservation.reservation_end).getTime() >= new Date().getTime();
    const isAcknowledged = reservation.acknowledged;

    if (showHistory && showAcknowledged) {
      return true;
    } else if (showHistory && !showAcknowledged) {
      return !isAcknowledged;
    } else if (!showHistory && showAcknowledged) {
      return isNotExpired;
    } else {
      return isNotExpired && !isAcknowledged;
    }
  });
};

export default filterByHistoryFlag;
