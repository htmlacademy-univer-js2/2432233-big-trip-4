import dayjs from 'dayjs';
import { SortType } from '../const';

function sortPointsByTime(pointA, pointB) {
  const timeA = dayjs(pointA.dateFrom).subtract(dayjs(pointA.dateTo));
  const timeB = dayjs(pointB.dateFrom).subtract(dayjs(pointB.dateTo));

  return timeA - timeB;
}

function sortPointsByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointsByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

const sort = {
  [SortType.DAY]: (points) => points.sort(sortPointsByDay),
  [SortType.PRICE]: (points) => points.sort(sortPointsByPrice),
  [SortType.TIME]: (points) => points.sort(sortPointsByTime),
};

export { sort };
