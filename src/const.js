const TYPES = ['taxi', 'bus', 'train', 'ship', 'flight', 'check-in', 'sightseeing', 'restaurant'];

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

const AUTHORIZATION = 'Basic spveve93f4dhg';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const BLANK_POINT = {
  basePrice: 1,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

const ButtonLabels = {
  CANCEL: 'Cancel',
  DELETE_DEFAULT: 'Delete',
  DELETE_IN_PROGRESS: 'Deleting...',
  SAVE_DEFAULT: 'Save',
  SAVE_IN_PROGRESS: 'Saving...'
};

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const LoadingMessage = {
  LOADING: 'Loading',
  ERROR: 'Failed to load latest route information'
};

const DESTINATIONS_TRIP_INFO_MAX_COUNT = 3;

export {
  TYPES, SortType, FilterType, UserAction,
  UpdateType, EditingType, Method, TimeLimit,
  AUTHORIZATION, END_POINT, Mode, BLANK_POINT,
  ButtonLabels, FilterMessage, LoadingMessage,
  DESTINATIONS_TRIP_INFO_MAX_COUNT
};
