import { getRandomInteger, getRandomArrayElement } from '../utils/common.js';
import { getRandomDate } from '../utils/date.js';
import { TYPES } from '../const.js';

function generatePoint() {
  const date = getRandomDate();

  const offerIds = [];

  for (let i = 0; i < getRandomInteger(0, 5); i++) {
    offerIds.push(String(getRandomInteger(1, 15)));
  }

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(500, 2500),
    dateFrom: date,
    dateTo: getRandomDate(date),
    destination: getRandomInteger(1, 10),
    isFavorite: !!getRandomInteger(0, 1),
    offers: offerIds,
    type: getRandomArrayElement(TYPES)
  };
}

export { generatePoint };
