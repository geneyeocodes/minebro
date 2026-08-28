import {
  getGridIngredients,
  getIngredientDetails,
} from "../../utils/itemUtils";

export default function RecipeGrid({ items, recipe, onSelectItem }) {
  if (!recipe) {
    return <p>No direct crafting recipe found.</p>;
  }

  const ingredients = getGridIngredients(recipe);

  return (
    <div className="crafting-grid">
      {ingredients.map((ingredientName, index) => {
        const ingredient = getIngredientDetails(items, ingredientName);

        const hasRecipe = ingredient?.recipes?.length > 0;

        return (
          <div
            key={index}
            onClick={() => {
              if (hasRecipe) {
                onSelectItem(ingredient.name);
              }
            }}
            className={`crafting-slot ${hasRecipe ? "clickable" : ""}`}
          >
            {ingredient?.image ? (
              <img
                src={ingredient.image}
                alt={ingredientName}
                title={ingredient.displayName}
                width={32}
                height={32}
              />
            ) : (
              <span className="slot-fallback-text">
                {ingredientName ? ingredientName.slice(0, 4) : ""}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
