import ListOfRoutePointsView from '../view/list-of-route-points-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../const.js';
import { sortPointsPrice, sortPointsTime } from '../utils/sort-points.js';
// import { filter } from '../utils/filter.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];
  #destinations = [];

  #pointsListComponent = new ListOfRoutePointsView();
  #sortingComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedRoutePoints = [];
  #emptyListComponent = new ListEmptyView();

  #pointsPresenters = new Map();

  constructor({ routeContainer, pointsModel, destinationsModel, offersModel }) {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];

    this.#sourcedRoutePoints = [...this.#pointsModel.points];
    // this.#routePoints = filter.future(this.#routePoints);

    this.#renderRoute();
  }

  #renderEmpty() {
    render(this.#emptyListComponent, this.#routeContainer);
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#routePoints.sort(sortPointsTime);
        break;
      case SortType.PRICE:
        this.#routePoints.sort(sortPointsPrice);
        break;
      default:
        this.#routePoints = [...this.#sourcedRoutePoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  };

  #renderSort() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortingComponent, this.#routeContainer);
  }

  #handlePointChange = (updatePoint) => {
    this.#routePoints = updateItem(this.#routePoints, updatePoint);
    this.#sourcedRoutePoints = updateItem(this.#routePoints, updatePoint);
    this.#pointsPresenters.get(updatePoint.id).init(updatePoint, this.#destinations, this.#offersModel);
  };

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    this.#pointsPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point, this.#destinations, this.#offersModel);
  }

  #renderPointsListContainer() {
    render(this.#pointsListComponent, this.#routeContainer);
  }

  #renderPoints() {
    for (let i = 0; i < this.#routePoints.length; i++) {
      this.#renderPoint(this.#routePoints[i]);
    }
  }

  #clearPointsList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #renderRoute() {
    if (this.#routePoints.length === 0) {
      this.#renderEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPointsListContainer();
    this.#renderPoints();
  }
}
