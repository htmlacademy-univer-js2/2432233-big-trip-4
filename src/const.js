const TYPES = ['taxi', 'bus', 'train', 'ship', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const PLACES = ['Amsterdam', 'Chamonix', 'Geneva', 'Moscow', 'Tokyo', 'Seoul', 'Miami', 'Omsk', 'London', 'Rome', 'Berlin'];
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'
];
const OFFERS = [
  'Add luggage',
  'Comfort class',
  'Add meal',
  'Choose seats',
  'Travel by train',
  'Registration of insurance',
  'Car rental',
  'Private transfer'
];

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE',
  ADD_POINT: 'ADD',
  DELETE_POINT: 'DELETE',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};

const EditingType = {
  UPDATE: 'UPDATE',
  NEW: 'NEW'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export { TYPES, DESCRIPTIONS, PLACES, OFFERS, SortType, FilterType, UserAction, UpdateType, EditingType, Method, TimeLimit };
