import { formatEditDate } from '../utils/date.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES } from '../const.js';
import { EditingType } from '../const.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  id: null,
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

function createPhotosTemplate(pictures) {
  return pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
}

function createOffersTemplate(offerItem, point) {
  return offerItem.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" data-offer-id="${offer.id}" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${point.offers.includes(offer.id) ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join('');
}

function createTypesTemplate(point) {
  return TYPES.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`).join('');
}

function createDestinationsTemplate(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join('');
}

function createRollupBtn() {
  return `
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;
}

function createResetBtnTemplate(type) {
  const label = type === EditingType.NEW ? 'Cancel' : 'Delete';
  return `<button class="event__reset-btn" type="reset">${label}</button>`;
}

function createControlsButtonsTemplate(type) {
  return `
    ${createResetBtnTemplate(type)}
    ${type === EditingType.UPDATE ? createRollupBtn() : ''}
  `;
}

function createEditingFormTemplate({ point, destinations, offerItem, type }) {

  const dateFrom = formatEditDate(point.dateFrom ? point.dateFrom : '');
  const dateTo = formatEditDate(point.dateTo ? point.dateTo : '');

  const offersList = offerItem.find((offer) => offer.type === point.type).offers;

  const destination = destinations.find((dest) => dest.id === point.destination);

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createTypesTemplate(point)}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${point.type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
              value="${destination ? destination.name : ''}" list="destination-list-1">
            <datalist id="destination-list-1">

              ${createDestinationsTemplate(destinations)}

            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${dateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${point.basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>

          ${createControlsButtonsTemplate(type)}

        </header>
        <section class="event__details">

          ${offersList.length ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersTemplate(offersList, point)}
            </div>

          </section>` : ''}

          ${destination.pictures.length > 0 ? `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${createPhotosTemplate(destination.pictures)}
              </div>
            </div>
          </section>` : ''}

        </section>
      </form>
    </li>
  `;
}

export default class EditingFormView extends AbstractStatefulView {
  #destinations = null;
  #offerItem = null;

  #handleSubmitClick = null;
  #handleCloseClick = null;
  #handleEditReset = null;

  #datePickerFrom = null;
  #datePickerTo = null;

  #eventType = null;

  constructor({ point = BLANK_POINT, destinations, offerItem, onSubmit, onClose, onDelete, eventType = EditingType.UPDATE }) {
    super();
    this.#destinations = destinations;
    this.#offerItem = offerItem;
    this.#handleSubmitClick = onSubmit;
    this.#handleCloseClick = onClose;
    this.#handleEditReset = onDelete;
    this.#eventType = eventType;

    this._setState(EditingFormView.parsePointToState({point}));

    this._restoreHandlers();
  }

  get template() {
    return createEditingFormTemplate({
      point: this._state.point,
      destinations: this.#destinations,
      offerItem: this.#offerItem,
      type: this.#eventType
    });
  }

  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick(EditingFormView.parseStateToPoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  _restoreHandlers = () => {
    this.element.querySelector('form')
      .addEventListener('submit', this.#submitClickHandler);

    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#offerChangeHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    if (this.#eventType === EditingType.UPDATE) {
      this.element.querySelector('.event__rollup-btn')
        ?.addEventListener('click', this.#closeClickHandler);
      this.element.querySelector('.event--edit')
        .addEventListener('reset', this.#deleteButtonClickHandler);
    }
    if (this.#eventType === EditingType.NEW) {
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#deleteButtonClickHandler);
    }

    this.#setDatepickers();
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const currentDestination = this.#destinations
      .find((pointDestination) => pointDestination.name === evt.target.value);

    const currentDestinationId = currentDestination ? currentDestination.id : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: currentDestinationId
      }
    });
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((elem) => elem.dataset.offerId)
      }
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value
      }
    });
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditReset(EditingFormView.parseStateToPoint(this._state));
  };

  reset = (point) => this.updateElement({point});

  static parsePointToState = (point) => ({ ...point });

  static parseStateToPoint = (state) => state.point;

  removeElement = () => {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate
      }
    });
    this.#datePickerTo.set('minDate', this._state.point.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate
      }
    });
    this.#datePickerFrom.set('maxDate', this._state.point.dateTo);
  };

  #setDatepickers = () => {
    const [dateFromElem, dateToElem] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };

    this.#datePickerFrom = flatpickr(
      dateFromElem,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.point.dateTo
      }
    );

    this.#datePickerTo = flatpickr(
      dateToElem,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.point.dateFrom
      }
    );
  };
}
