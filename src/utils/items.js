export function getRecipeItems(items) {
  return items.filter((item) => item.recipe);
}

export function getItem(items, name) {
  return items.find((item) => item.name === name);
}
