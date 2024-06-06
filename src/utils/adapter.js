function adaptToClient(point) {
  try {
    return {
      id: point.id,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      destination: point.destination,
      isFavorite: point['is_favorite'],
      offers: point.offers,
      type: point.type
    };
  } catch (error) {
    throw new Error('Error adapting point to client format:', error);
  }
}

function adaptToServer(point) {
  try {
    return {
      id: point.id,
      'base_price': Number(point.basePrice),
      'date_from': new Date(point.dateFrom).toISOString(),
      'date_to': new Date(point.dateTo).toISOString(),
      destination: point.destination,
      'is_favorite': point.isFavorite,
      offers: point.offers,
      type: point.type
    };
  } catch (error) {
    throw new Error('Error adapting point to server format:', error);
  }
}

export { adaptToClient, adaptToServer };
