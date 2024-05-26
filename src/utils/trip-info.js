import { SortType, DESTINATIONS_TRIP_INFO_MAX_COUNT } from '../const';
import { sort } from './sort-points';
import { formatTripInfoDate } from './date';

function getTripTitle(points = [], destinations = []) {
  const destinationTitles = sort[SortType.DAY]([...points]).
    map((point) => destinations.find((dest) => dest.id === point.destination).name);

  return destinationTitles.length <= DESTINATIONS_TRIP_INFO_MAX_COUNT
    ? destinationTitles.join('&nbsp;&mdash;&nbsp;')
    : `${destinationTitles.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationTitles.at(-1)}`;
}

function getTripDuration(points = []) {
  const sortedPoints = sort[SortType.DAY]([...points]);

  return sortedPoints.length > 0
    ? `${formatTripInfoDate(sortedPoints.at(0).dateFrom)}&nbsp;&mdash;&nbsp;${formatTripInfoDate(sortedPoints.at(-1).dateTo)}`
    : '';
}

function getOffersCost(offerIds = [], offers = []) {
  return offerIds.reduce((result, id) => result + (offers.find((offer) => offer.id === id)?.price ?? 0),0);
}

function getTripCost(points = [], offers = []) {
  return points.reduce(
    (result, point) => result + point.basePrice + getOffersCost(point.offers, offers.find((offer) => point.type === offer.type)?.offers),
    0
  );
}

export { getTripTitle, getTripDuration, getTripCost };
