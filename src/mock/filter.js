import { filter } from '../utils/filter';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      isActive: filterPoints(points).length > 0
    })
  );
}

export { generateFilter };
