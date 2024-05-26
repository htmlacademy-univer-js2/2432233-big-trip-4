import TripInfoView from './view/trip-info-view.js';
import RoutePresenter from './presenter/route-presenter.js';
import NewPointBtnPresenter from './presenter/new-point-btn-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import PointsModel from './model/point-model.js';
import DestinationsModel from './model/destination-model.js';
import OffersModel from './model/offer-model.js';
import FilterModel from './model/filter-model.js';

import { render, RenderPosition } from './framework/render.js';
import { AUTHORIZATION, END_POINT } from './const.js';

import PointsApiService from './points-api-service.js';

const siteHeaderElement = document.querySelector('.page-header');
const headerInfoElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');
const filterElement = headerInfoElement.querySelector('.trip-controls__filters');


const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsModel = new DestinationsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const pointsModel = new PointsModel({
  service: pointsApiService,
  destinationsModel,
  offersModel
});

const filterModel = new FilterModel();

const newPointBtnPresenter = new NewPointBtnPresenter({
  container: headerInfoElement,
});

const filterPresenter = new FilterPresenter({
  container: filterElement,
  filterModel,
  pointsModel
});

const routePresenter = new RoutePresenter({
  routeContainer: siteMainElement,
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,
  newPointBtnPresenter
});

render(new TripInfoView(), headerInfoElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
routePresenter.init();

pointsModel.init().finally(() => {
  newPointBtnPresenter.init({
    onButtonClick: routePresenter.handleNewPointBtnClick
  });
});
