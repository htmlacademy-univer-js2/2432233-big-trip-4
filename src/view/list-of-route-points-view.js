import AbstractView from '../framework/view/abstract-view.js';


function createListOfRoutePointsTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class ListOfRoutePointsView extends AbstractView {
  get template() {
    return createListOfRoutePointsTemplate();
  }
}
