import {createElement} from '../render.js';

function createListOfRoutePointsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class ListOfRoutePointsView {
  getTemplate() {
    return createListOfRoutePointsTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
