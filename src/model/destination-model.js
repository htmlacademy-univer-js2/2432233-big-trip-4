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
    try {
      this.#destinations = await this.#service.destinations;
    } catch (error) {
      this.#destinations = [];
      throw new Error('Error initializing destinations:', error);
    }

    return this.#destinations;
  }
}
