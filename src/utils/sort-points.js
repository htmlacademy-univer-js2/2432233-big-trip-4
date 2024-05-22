import dayjs from 'dayjs';

function sortPointsTime(taskA, taskB) {
  const timeA = dayjs(taskA.dateFrom).subtract(dayjs(taskA.dateTo));
  const timeB = dayjs(taskB.dateFrom).subtract(dayjs(taskB.dateTo));

  if (timeA > timeB) {
    return 1;
  }
  if (timeA < timeB) {
    return -1;
  }

  return 0;
}

function sortPointsPrice(taskA, taskB) {
  if (taskA.basePrice < taskB.basePrice) {
    return 1;
  }
  if (taskA.basePrice > taskB.basePrice) {
    return -1;
  }

  return 0;
}

export { sortPointsTime, sortPointsPrice };
