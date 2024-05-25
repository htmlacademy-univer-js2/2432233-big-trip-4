import { render, replace, remove } from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import { UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';

export default class FilterPresenter {
  #container = null;
  #filterComponent = null;

  #filterModel = null;
  #pointsModel = null;

  #currentFilter = null;

  constructor({ container, filterModel, pointsModel }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    return Object.entries(filter).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        isActive: filterPoints(points).length > 0
      })
    );
  }

  init() {
    this.#currentFilter = this.#filterModel.get();
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      onFilterChange: this.#handleFilterTypeChange,
      currentFilter: this.#currentFilter
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#container);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
