export default class OffersModel {
  #allOffers = [];
  #service = null;

  constructor(service) {
    this.#service = service;
  }

  async init() {
    this.#allOffers = await this.#service.offers;
    return this.#allOffers;
  }

  get allOffers() {
    return this.#allOffers;
  }

  getByType(type) {
    return this.#allOffers.find((offer) => offer.type === type).offers;
  }
}
