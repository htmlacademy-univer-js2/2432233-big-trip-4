import FiltersView from './view/filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import RoutePresenter from './presenter/route-presenter.js';

import { render, RenderPosition } from './framework/render.js';

import PointsModel from './model/point-model.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import { generateFilter } from './mock/filter.js';

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoElement = siteHeaderElement.querySelector('.trip-main');
const headerFiltersElement = siteHeaderElement.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');

const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel();

const routePresenter = new RoutePresenter({
  routeContainer: siteMainElement,
  pointsModel,
  destinationsModel,
  offersModel
});

const filters = generateFilter(pointsModel.points);

render(new FiltersView({ filters }), headerFiltersElement);
render(new TripInfoView(), headerInfoElement, RenderPosition.AFTERBEGIN);

routePresenter.init();
