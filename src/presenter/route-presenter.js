import ListOfRoutePointsView from '../view/list-of-route-points-view.js';
import SortingView from '../view/sorting-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { FilterType, SortType } from '../const.js';
import { sortPointsPrice, sortPointsTime, sortPointsday } from '../utils/sort-points.js';
import { filter } from '../utils/filter.js';
import { UpdateType, UserAction } from '../const.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';

export default class RoutePresenter {
  #routeContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #pointsListComponent = new ListOfRoutePointsView();
  #sortingComponent = null;
  #currentSortType = SortType.DAY;
  #emptyListComponent = null;

  #pointsPresenters = new Map();

  #isCreating = false;
  #newPointBtnPresenter = null;
  #newPointPresenter = null;

  #loadingComponent = new LoadingView();
  #isLoading = true;
  #isLoadingError = false;

  constructor({ routeContainer, pointsModel, destinationsModel, offersModel, filterModel, newPointBtnPresenter }) {
    this.#routeContainer = routeContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.#newPointBtnPresenter = newPointBtnPresenter;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#pointsListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointsday);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsTime);
    }

    return filteredPoints;
  }

  init() {
    this.#renderRoute();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearRoute();
    this.#renderRoute();
  };

  #renderEmpty() {
    this.#emptyListComponent = new ListEmptyView({
      filterType: this.#filterModel.get()
    });
    render(this.#emptyListComponent, this.#routeContainer);
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #handleModelEvent = async (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters?.get(data.id)?.init(data, this.#destinationsModel, this.#offersModel);
        break;
      case UpdateType.MINOR:
        this.#clearRoute();
        this.#renderRoute();
        break;
      case UpdateType.MAJOR:
        this.#clearRoute(true);
        this.#renderRoute();
        break;
      case UpdateType.INIT:
        this.#isLoadingError = data.isError;
        this.#isLoading = false;
        this.#clearRoute();
        this.#renderRoute();
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  handleNewPointBtnClick = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointBtnPresenter.disableButton();
    this.#newPointPresenter.init();
  };

  #newPointDestroyHandler = ({ isCanceled }) => {
    this.#isCreating = false;
    this.#newPointBtnPresenter.enableButton();
    if (this.points.length === 0 && isCanceled) {
      this.#clearRoute();
      this.#renderRoute();
    }
  };

  #renderSort() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType
    });

    render(this.#sortingComponent, this.#routeContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    // console.log(this.#destinations);
    this.#pointsPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point, this.#destinationsModel, this.#offersModel);
  }

  #renderPointsListContainer() {
    render(this.#pointsListComponent, this.#routeContainer);
  }

  #renderPoints() {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderLoading = () => {
    render(this.#loadingComponent, this.#routeContainer, RenderPosition.AFTERBEGIN);
  };

  #clearPointsList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    this.#newPointPresenter.destroy();
  }

  #renderRoute = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#isLoadingError) {
      this.#clearRoute({ resetSortType: true });
      return;
    }

    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderEmpty();
      return;
    }

    this.#renderSort();
    this.#renderPointsListContainer();
    this.#renderPoints();
  };

  #clearRoute = ({resetSortType = false} = {}) => {
    this.#clearPointsList();
    remove(this.#emptyListComponent);
    remove(this.#sortingComponent);
    this.#sortingComponent = null;
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };
}
