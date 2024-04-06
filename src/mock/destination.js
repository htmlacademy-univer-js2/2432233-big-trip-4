import { DESCRIPTIONS, PLACES } from '../const.js';
import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';

function generatePictures(place) {
  const result = [];

  for (let i = 0; i < getRandomInteger(3, 6); i++) {
    result.push({
      src: `https://loremflickr.com/248/152?random=${getRandomInteger(1, 150)}`,
      description: `${place} event photo`
    });
  }

  return result;
}

function generateDestination() {

  const place = getRandomArrayElement(PLACES);

  return {
    id: crypto.randomUUID(),
    description: getRandomArrayElement(DESCRIPTIONS),
    name: place,
    pictures: generatePictures(place)
  };
}

export { generateDestination };
