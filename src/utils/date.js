import dayjs from 'dayjs';
import { getRandomInteger } from './common';

function formatPointDate(date) {
  return date ? dayjs(date).format('MMM D') : '';
}

function formatPointTime(date) {
  return date ? dayjs(date).format('HH:mm') : '';
}

function formatEditDate(date) {
  return date ? dayjs(date).format('DD/MM/YY HH:mm') : '';
}

function getTimeDifference(dateFrom, dateTo) {
  const timeDifference = dayjs(dateTo).subtract(dayjs(dateFrom));

  const timeDifferenceInHours = timeDifference / 60000 / 60;
  const timeDifferenceInDays = timeDifference / 60000 / 60 / 24;

  if (timeDifferenceInHours < 1) {
    return dayjs(timeDifference).format('mm[M]');
  }
  else if (timeDifferenceInDays < 1) {
    return dayjs(timeDifference.subtract(5, 'hours')).format('HH[H] mm[M]');
  }
  else {
    return dayjs(timeDifference.subtract(29, 'hours')).format('DD[D] HH[H] mm[M]');
  }
}

function getRandomDate(date = new Date()) {
  return dayjs(date).add(getRandomInteger(30, 1500), 'minute').toDate();
}

function isMinorUpdate(pointA, pointB) {
  const timeA = dayjs(pointA.dateFrom).subtract(dayjs(pointA.dateTo));
  const timeB = dayjs(pointB.dateFrom).subtract(dayjs(pointB.dateTo));

  const date = !dayjs(pointA.dateFrom).isSame(dayjs(pointB.dateFrom));
  const price = pointA.basePrice !== pointB.basePrice;
  const time = !dayjs(timeA).isSame(dayjs(timeB));

  return date || price || time;
}

export { formatPointDate, formatPointTime, getTimeDifference, getRandomDate, formatEditDate, isMinorUpdate };
