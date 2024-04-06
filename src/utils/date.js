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

// console.log(getTimeDifference(new Date(2023, 11, 4, 10, 0), new Date(2023, 11, 6, 13, 20)));

function getRandomDate(date = new Date(0)) {
  return dayjs(date).add(getRandomInteger(30, 1500), 'minute');
}

// console.log(getRandomDate().format('YYYY MMMM DD[D] HH[H] mm[M]'));

export { formatPointDate, formatPointTime, getTimeDifference, getRandomDate, formatEditDate };
