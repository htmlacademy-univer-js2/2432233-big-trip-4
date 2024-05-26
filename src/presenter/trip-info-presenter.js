import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';

export default class TripInfoPresenter {
  #container = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({container, pointsModel, destinationsModel, offersModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get points() {
    return this.#pointsModel.points;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.allOffers;
  }

  init() {
    this.#renderTripInfo();
    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  #renderTripInfo = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      points: this.points,
      offers: this.offers,
      destinations: this.destinations
    });

    if (!prevTripInfoComponent) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #modelEventHandler = () => {
    this.#renderTripInfo();
  };
}
