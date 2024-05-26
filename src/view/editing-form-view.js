import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

import { formatEditDate } from '../utils/date.js';
import { TYPES,EditingType, BLANK_POINT, ButtonLabels } from '../const.js';
import { capitalize } from '../utils/common.js';

import { encode } from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createPhotosTemplate(pictures) {
  return pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');
}

function createOffersTemplate({ offersList, point, isDisabled }) {
  return offersList.map((offer) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" data-offer-id="${offer.id}"
        id="event-offer-${offer.id}-1"
        type="checkbox"
        name="event-offer-${offer.id}"
        ${point.offers.includes(offer.id) ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>
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
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
        value="${type}" ${point.type === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
    </div>`).join('');
}

function createDestinationsTemplate(destinations) {
  return destinations.map((destination) => `<option value="${encode(destination.name)}"></option>`).join('');
}

function createDestinationsBlockTempalte(destination) {
  return `
    ${destination.pictures.length > 0 || destination.description ? `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${createPhotosTemplate(destination.pictures)}
      </div>
    </div>
  </section>` : ''}`;
}

function createRollupBtn(isDisabled) {
  return `
    <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`;
}

function createResetBtnTemplate({ type, isDeleting, isDisabled }) {
  let label;

  if (type === EditingType.NEW) {
    label = ButtonLabels.CANCEL;
  } else {
    label = isDeleting ? ButtonLabels.DELETE_IN_PROGRESS : ButtonLabels.DELETE_DEFAULT;
  }
  return `<button class="event__reset-btn" type="reset"
    ${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

function createSaveBtnTemplate({ isSaving, isDisabled }) {
  const label = isSaving ? ButtonLabels.SAVE_IN_PROGRESS : ButtonLabels.SAVE_DEFAULT;
  return `<button class="event__save-btn  btn  btn--blue" type="submit"
    ${isDisabled ? 'disabled' : ''}>${label}</button>`;
}

function createControlsButtonsTemplate({ type, isSaving, isDeleting, isDisabled }) {
  return `
    ${createSaveBtnTemplate({ isSaving, isDisabled })}
    ${createResetBtnTemplate({ type, isDeleting, isDisabled })}
    ${type === EditingType.UPDATE ? createRollupBtn(isDisabled) : ''}
  `;
}

function createEditingFormTemplate({ state, destinations, offerItem, type }) {

  const { point, isDisabled, isSaving, isDeleting } = state;
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
              <img class="event__type-icon" width="17" height="17" src="img/icons/${encode(point.type)}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list" >
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${createTypesTemplate(point)}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${encode(point.type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
              value="${destination ? encode(destination.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
            <datalist id="destination-list-1">

              ${createDestinationsTemplate(destinations)}

            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
              value="${dateFrom}" ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
              value="${dateTo}" ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price"
              value="${encode(String(point.basePrice))}" ${isDisabled ? 'disabled' : ''}>
          </div>

          ${createControlsButtonsTemplate({ type, isSaving, isDeleting, isDisabled })}

        </header>
        <section class="event__details">

          ${offersList.length ? `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createOffersTemplate({offersList, point, isDisabled})}
            </div>

          </section>` : ''}

          ${point.destination ? createDestinationsBlockTempalte(destination) : ''}

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
      state: this._state,
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

  static parsePointToState = ({
    point,
    isDisabled = false,
    isSaving = false,
    isDeleting = false
  }) => ({
    point,
    isDisabled,
    isSaving,
    isDeleting
  });

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
