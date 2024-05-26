import dayjs from 'dayjs';
import { SortType } from '../const';

function sortPointsTime(pointA, pointB) {
  const timeA = dayjs(pointA.dateFrom).subtract(dayjs(pointA.dateTo));
  const timeB = dayjs(pointB.dateFrom).subtract(dayjs(pointB.dateTo));

  if (timeA > timeB) {
    return 1;
  }
  if (timeA < timeB) {
    return -1;
  }

  return 0;
}

function sortPointsPrice(pointA, pointB) {
  if (pointA.basePrice < pointB.basePrice) {
    return 1;
  }
  if (pointA.basePrice > pointB.basePrice) {
    return -1;
  }

  return 0;
}

function sortPointsday(pointA, pointB) {
  if (pointA.dateFrom < pointB.dateFrom) {
    return -1;
  }
  if (pointA.dateFrom > pointB.dateFrom) {
    return 1;
  }

  return 0;
}

const sort = {
  [SortType.DAY]: (points) => points.sort(sortPointsday),
  [SortType.PRICE]: (points) => points.sort(sortPointsPrice),
  [SortType.TIME]: (points) => points.sort(sortPointsTime),
};

export { sort };
