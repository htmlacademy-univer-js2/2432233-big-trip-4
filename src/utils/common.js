function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { updateItem, capitalize };
