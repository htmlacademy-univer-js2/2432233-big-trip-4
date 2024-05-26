import Observable from '../framework/observable.js';
import { updateItem } from '../utils/common.js';
import { UpdateType } from '../const.js';
import { adaptToClient, adaptToServer } from '../utils/adapter.js';

export default class PointsModel extends Observable {
  #points = [];
  #service = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({ service, destinationsModel, offersModel }) {
    super();
    this.#service = service;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#service.points;
      this.#points = points.map(adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});
    } catch {
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  get points() {
    return this.#points;
  }

  getById(id) {
    return this.#points.find((point) => point.id === id);
  }

  async updatePoint(updateType, point) {
    try {
      const updatedPoint = await this.#service.updatePoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(updatedPoint);
      this.#points = updateItem(this.#points, adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch {
      throw new Error('Невозможно обновить точку');
    }
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
