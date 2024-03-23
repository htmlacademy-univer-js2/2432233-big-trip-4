import { generateDestination } from '../mock/destination';

export default class DestinationsModel {
  constructor() {
    this.destinations = Array.from({length: 3}, () => generateDestination());
  }

  get() {
    return this.destinations;
  }

  getById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }
}
