import EditingFormView from '../view/editing-form-view.js';
import ListOfRoutePointsView from '../view/list-of-route-points-view.js';
import RoutePointView from '../view/route-point-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  listComponent = new ListOfRoutePointsView();

  constructor(boardContainer) {
    this.container = boardContainer;
  }

  init() {
    render(new SortingView(), this.container);
    render(this.listComponent, this.container);
    render(new EditingFormView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.listComponent.getElement());
    }
  }
}
