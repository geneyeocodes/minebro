export function getItemsWithRecipes(items) {
  return items.filter((item) => item.recipes && item.recipes.length > 0);
}

export function getIngredientDetails(items, ingredientName) {
  if (!ingredientName) return null;

  return (
    items.find((item) => item.name === ingredientName) || {
      name: ingredientName,
      displayName: ingredientName,
      image: null,
    }
  );
}

export function getGridIngredients(recipe) {
  if (!recipe) {
    return Array(9).fill(null);
  }

  const flat = recipe.ingredients.flat();

  // Special handling for 2x2 recipes.
  if (flat.length === 4) {
    return [flat[0], flat[1], null, flat[2], flat[3], null, null, null, null];
  }

  return flat.slice(0, 9);
}
