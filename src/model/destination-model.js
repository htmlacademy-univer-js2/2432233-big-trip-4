import { generateDestination } from '../mock/destination';

export default class DestinationsModel {
  #destinations = Array.from({length: 3}, () => generateDestination());

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
