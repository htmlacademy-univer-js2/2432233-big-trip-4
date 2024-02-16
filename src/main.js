import FiltersView from './view/filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import { render, RenderPosition } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoElement = siteHeaderElement.querySelector('.trip-main');
const headerFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter(siteMainElement);

render(new FiltersView(), headerFiltersElement);
render(new TripInfoView(), headerInfoElement, RenderPosition.AFTERBEGIN);

boardPresenter.init();
