export function getIngredients(recipe) {
  return recipe?.flat() ?? [];
}

export function getUniqueIngredients(recipe) {
  return [...new Set(getIngredients(recipe).filter(Boolean))];
}

export function recipeMatches(recipe, grid) {
  const ingredients = getIngredients(recipe);

  return (
    ingredients.length === 9 &&
    grid.length === 9 &&
    ingredients.every(
      (ingredient, index) => (ingredient || null) === grid[index],
    )
  );
}
