import { TYPES } from '../const.js';
import { getRandomInteger } from '../utils/common.js';
import { generateOffer } from '../mock/offer.js';

export default class OffersModel {
  #allOffers = TYPES.map((type) => ({
    type,
    offers: Array.from({ length: getRandomInteger(0, 5) }, () => generateOffer())
  }));

  get allOffers() {
    return this.#allOffers;
  }

  getByType(type) {
    return this.#allOffers.find((offer) => offer.type === type);
  }

  getById(id) {
    this.#allOffers.forEach((item) => {
      const res = item.offers.find((offer) => offer.id === id);
      if (res) {
        return res;
      }
    });
    return {};
  }
}
