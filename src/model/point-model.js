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

  get points() {
    return this.#points;
  }

  getById(id) {
    return this.#points.find((point) => point.id === id);
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
    } catch (error) {
      this.#points = [];
      this._notify(UpdateType.INIT, {isError: true});
      // throw new Error('Error initializing points:', error);  если выкидывать ошибку, то тест не проходит(
    }
  }

  async updatePoint(updateType, point) {
    try {
      const updatedPoint = await this.#service.updatePoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(updatedPoint);
      this.#points = updateItem(this.#points, adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch (error) {
      throw new Error('Невозможно обновить точку:', error);
    }
  }

  async addPoint(updateType, point) {
    try {
      const newPoint = await this.#service.addPoint(adaptToServer(point));
      const adaptedPoint = adaptToClient(newPoint);
      this.#points.push(adaptedPoint);
      this._notify(updateType, adaptedPoint);
    } catch (error) {
      throw new Error('Невозможно создать точку:', error);
    }
  }

  async deletePoint(updateType, point) {
    try {
      await this.#service.deletePoint(point);
      this.#points = this.#points.filter((pointItem) => pointItem.id !== point.id);
      this._notify(updateType);
    } catch (error) {
      throw new Error('Невозможно удалить точку:', error);
    }
  }
}
