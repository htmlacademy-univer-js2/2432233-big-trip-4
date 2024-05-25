import Observable from '../framework/observable.js';
import { updateItem } from '../utils/common.js';

import { POINTS_COUNT } from '../const.js';
import { generatePoint } from '../mock/point.js';

export default class PointsModel extends Observable {
  #points = [];

  constructor() {
    super();
    this.#points = Array.from({ length: POINTS_COUNT }, () => generatePoint());
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, updatedPoint) {
    this.#points = updateItem(this.#points, updatedPoint);
    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points.push(newPoint);
    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, deletedPoint) {
    this.#points = this.#points.filter((point) => point.id !== deletedPoint.id);
    this._notify(updateType);
  }
}
