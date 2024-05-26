import ListOfRoutePointsView from '../view/list-of-route-points-view.js';
import SortingView from '../view/sorting-view.js';
import ListEmptyView from '../view/list-empty-view.js';
import LoadingView from '../view/loading-view.js';

import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

import { render, remove, RenderPosition } from '../framework/render.js';
import { FilterType, SortType, UpdateType, UserAction, TimeLimit } from '../const.js';
import { sort } from '../utils/sort-points.js';
import { filter } from '../utils/filter.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class RoutePresenter {
  #routeContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #filterModel = null;

  #pointsListComponent = new ListOfRoutePointsView();
  #sortingComponent = null;
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();

  #pointsPresenters = new Map();
  #newPointBtnPresenter = null;
  #newPointPresenter = null;

  #currentSortType = SortType.DAY;

  #isCreating = false;
  #isLoading = true;
  #isLoadingError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
      onDataChange: this.#viewActionHandler,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#modelEventHandler);
    this.#filterModel.addObserver(this.#modelEventHandler);
  }

  get points() {
    const filterType = this.#filterModel.get();
    const filteredPoints = filter[filterType](this.#pointsModel.points);

    return sort[this.#currentSortType](filteredPoints);
  }

  init() {
    this.#renderRoute();
  }

  #renderSort() {
    this.#sortingComponent = new SortingView({
      onSortTypeChange: this.#sortTypeChangeHandler,
      currentSortType: this.#currentSortType
    });

    render(this.#sortingComponent, this.#routeContainer);
  }

  #renderPointsListContainer() {
    render(this.#pointsListComponent, this.#routeContainer);
  }

  #renderPoints() {
    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent.element,
      onDataChange: this.#viewActionHandler,
      onModeChange: this.#modeChangeHandler
    });
    this.#pointsPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point, this.#destinationsModel, this.#offersModel);
  }

  #renderLoading = ({isLoading, isLoadingError}) => {
    this.#loadingComponent = new LoadingView(isLoading, isLoadingError);
    render(this.#loadingComponent, this.#routeContainer, RenderPosition.AFTERBEGIN);
  };

  #renderEmpty() {
    this.#emptyListComponent = new ListEmptyView({
      filterType: this.#filterModel.get()
    });
    render(this.#emptyListComponent, this.#routeContainer);
  }

  #renderRoute = () => {
    const isLoading = this.#isLoading;
    const isLoadingError = this.#isLoadingError;

    if (this.#isLoading) {
      this.#renderLoading({isLoading, isLoadingError});
      return;
    }

    if (this.#isLoadingError) {
      this.#clearRoute({ resetSortType: true });
      this.#renderLoading({isLoading, isLoadingError});
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

  #clearPointsList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    this.#newPointPresenter.destroy();
  }

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

  handleNewPointBtnClick = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointBtnPresenter.disableButton();
    this.#newPointPresenter.init();
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearRoute();
    this.#renderRoute();
  };

  #modeChangeHandler = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #modelEventHandler = async (updateType, data) => {
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

  #viewActionHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #newPointDestroyHandler = ({ isCanceled }) => {
    this.#isCreating = false;
    this.#newPointBtnPresenter.enableButton();
    if (this.points.length === 0 && isCanceled) {
      this.#clearRoute();
      this.#renderRoute();
    }
  };
}
