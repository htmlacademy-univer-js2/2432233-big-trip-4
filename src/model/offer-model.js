export default class OffersModel {
  #allOffers = [];
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  get allOffers() {
    return this.#allOffers;
  }

  getByType(type) {
    return this.#allOffers.find((offer) => offer.type === type).offers;
  }

  async init() {
    try {
      this.#allOffers = await this.#service.offers;
    } catch (error) {
      this.#allOffers = [];
      throw new Error('Error initializing offers:', error);
    }

    return this.#allOffers;
  }
}
