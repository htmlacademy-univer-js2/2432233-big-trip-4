import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

function createListEmptyTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    const message = FilterMessage[this.#filterType];
    return createListEmptyTemplate(message);
  }
}
