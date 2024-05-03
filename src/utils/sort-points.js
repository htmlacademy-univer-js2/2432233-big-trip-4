import { getTimeDifference } from './date.js';

function sortPointsTime(taskA, taskB) {
  const timeA = getTimeDifference(taskA.dateFrom, taskA.dateTo);
  const timeB = getTimeDifference(taskB.dateFrom, taskB.dateTo);

  if (timeA < timeB) {
    return 1;
  }
  if (timeA > timeB) {
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
