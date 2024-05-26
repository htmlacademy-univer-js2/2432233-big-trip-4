import AbstractView from '../framework/view/abstract-view.js';
import { FilterMessage } from '../const.js';

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
