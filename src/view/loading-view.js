import AbstractView from '../framework/view/abstract-view.js';
import { LoadingMessage } from '../const.js';

function createLoadingTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class LoadingView extends AbstractView {
  #isLoading = null;
  #isError = null;

  constructor(isLoading, isLoadingError) {
    super();
    this.#isLoading = isLoading;
    this.#isError = isLoadingError;
  }

  get template() {
    let message;

    if (this.#isLoading) {
      message = LoadingMessage.LOADING;
    } else if (this.#isError) {
      message = LoadingMessage.ERROR;
    }

    return createLoadingTemplate(message);
  }
}
