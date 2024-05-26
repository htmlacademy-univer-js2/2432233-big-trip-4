import NewPointBtnView from '../view/new-point-btn-view';
import { render } from '../framework/render.js';

export default class NewPointBtnPresenter {
  #container = null;
  #button = null;
  #handleButtonClick = null;

  constructor({container}) {
    this.#container = container;
  }

  init({onButtonClick}) {
    this.#handleButtonClick = onButtonClick;
    this.#button = new NewPointBtnView({onClick: this.#buttonClickHandler});
    render(this.#button, this.#container);
  }

  disableButton() {
    this.#button.setDisabled(true);
  }

  enableButton() {
    this.#button.setDisabled(false);
  }

  #buttonClickHandler = () => {
    this.#handleButtonClick();
  };
}
