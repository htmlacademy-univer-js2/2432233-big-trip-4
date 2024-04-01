import { POINTS_COUNT } from '../const.js';
import { generatePoint } from '../mock/point.js';

export default class PointsModel {
  #points = Array.from({ length: POINTS_COUNT }, () => generatePoint());

  get points() {
    return this.#points;
  }
}
