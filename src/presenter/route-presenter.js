import EditingFormView from '../view/editing-form-view.js';
import ListOfRoutePointsView from '../view/list-of-route-points-view.js';
import RoutePointView from '../view/route-point-view.js';
import SortingView from '../view/sorting-view.js';
import { render, replace } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import { filter } from '../utils/filter.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];
  #destinations = [];

  #pointsListComponent = new ListOfRoutePointsView();
  #sortingComponent = new SortingView();
  #emptyListComponent = new ListEmptyView();

  constructor({ routeContainer, pointsModel, destinationsModel, offersModel }) {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];

    if (this.#routePoints.length === 0) {
      render(this.#emptyListComponent, this.#routeContainer);
      return;
    }

    render(this.#sortingComponent, this.#routeContainer);
    render(this.#pointsListComponent, this.#routeContainer);

    this.#routePoints = filter.past(this.#routePoints);

    for (let i = 0; i < this.#routePoints.length; i++) {
      this.#renderPoint(this.#routePoints[i]);
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new RoutePointView({
      point: point,
      destinations: this.#destinations,
      offers: this.#offersModel.getByType(point.type).offers,
      onEditClick: () => {
        replacePointToEdit();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const formComponent = new EditingFormView({
      point: point,
      destinations: this.#destinations,
      offerItem: this.#offersModel.getByType(point.type),
      onSubmit: () => {
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onClose: () => {
        replaceEditToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToEdit() {
      replace(formComponent, pointComponent);
    }

    function replaceEditToPoint() {
      replace(pointComponent, formComponent);
    }

    render(pointComponent, this.#pointsListComponent.element);
  }
}
