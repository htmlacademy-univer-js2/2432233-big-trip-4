import { getRandomInteger } from '../utils/common.js';
import { OFFERS } from '../const.js';

function generateOffer(id) {
  return {
    id: String(id),
    title: OFFERS[id],
    price: getRandomInteger(100, 500)
  };
}

export { generateOffer };
