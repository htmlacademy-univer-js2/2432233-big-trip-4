function getRandomArrayElement(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export { getRandomArrayElement, getRandomInteger, updateItem };
