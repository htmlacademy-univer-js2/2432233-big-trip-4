import EditingFormView from '../view/editing-form-view.js';
import ListOfRoutePointsView from '../view/list-of-route-points-view.js';
import RoutePointView from '../view/route-point-view.js';
import SortingView from '../view/sorting-view.js';
import { render } from '../render.js';

export default class RoutePresenter {
  pointsListComponent = new ListOfRoutePointsView();
  sortingComponent = new SortingView();

  constructor({ routeContainer, pointsModel, destinationsModel, offersModel }) {
    this.routeContainer = routeContainer;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.get()];
    this.destinations = [...this.destinationsModel.get()];
    this.offers = [...this.offersModel.get()];

    render(this.sortingComponent, this.routeContainer);
    render(this.pointsListComponent, this.routeContainer);

    render(new EditingFormView({
      point: this.routePoints[0],
      destinations: this.destinations,
      offerItem: this.offersModel.getByType(this.routePoints[0].type)
    }),
    this.pointsListComponent.getElement());

    for (let i = 1; i < this.routePoints.length; i++) {
      render(new RoutePointView({
        point: this.routePoints[i],
        destinations: this.destinations,
        offers: this.offersModel.getByType(this.routePoints[i].type).offers
      }),
      this.pointsListComponent.getElement());
    }
  }
}
