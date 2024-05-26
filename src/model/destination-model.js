export default class DestinationsModel {
  #destinations = [];
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  get destinations() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }

  async init() {
    this.#destinations = await this.#service.destinations;
    return this.#destinations;
  }
}
