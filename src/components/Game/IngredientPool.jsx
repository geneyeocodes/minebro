import { getIngredientDetails } from "../../utils/itemUtils";

export default function IngredientPool({
  items,
  ingredients,
  onIngredientClick,
}) {
  return (
    <div className="game-ingredient-pool">
      {ingredients.map((ingredientName, index) => {
        const ingredient = getIngredientDetails(items, ingredientName);

        return (
          <div
            key={`${ingredientName}-${index}`}
            onClick={() => onIngredientClick(ingredientName)}
            className="pool-item"
            title={ingredientName}
          >
            {ingredient?.image ? (
              <img
                src={ingredient.image}
                alt={ingredientName}
                width={32}
                height={32}
              />
            ) : (
              <span className="pool-fallback-text">
                {ingredientName.slice(0, 4)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
