import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemsTemplate(filters, currentFilter) {
  return filters.map((filter) => `
  <div class="trip-filters__filter">
    <input
      id="filter-${filter.type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${filter.type}"
      ${currentFilter === filter.type ? 'checked' : ''}
      ${filter.isActive ? '' : 'disabled'}>
    <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
  </div>
  `).join('');
}

function createFiltersTemplate(filters, currentFilter) {
  return `
  <form class="trip-filters" action="#" method="get">

    ${createFilterItemsTemplate(filters, currentFilter)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
  `;
}

export default class FiltersView extends AbstractView {
  #filters = null;
  #handleFilterTypeChange = null;
  #currentFilter = null;

  constructor({filters, onFilterChange, currentFilter}) {
    super();
    this.#filters = filters;
    this.#handleFilterTypeChange = onFilterChange;
    this.#currentFilter = currentFilter;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
