import {createElement} from '../render.js';

function createLoadingTemplate() {
  return `
  
  `;
}

export default class LoadingView {
  getTemplate() {
    return createLoadingTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
