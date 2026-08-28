import { getItem } from "../../utils/items";
import ItemImage from "../common/ItemImage";

export default function IngredientPool({
  items,
  ingredients,
  onIngredientClick,
}) {
  return (
    <div className="game-ingredient-pool">
      {ingredients.map((name, index) => {
        const item = getItem(items, name);

        return (
          <div
            key={`${name}-${index}`}
            onClick={() => onIngredientClick(name)}
            className="pool-item"
            title={name}
          >
            {item?.image ? (
              <ItemImage item={item} />
            ) : (
              <span className="pool-fallback-text">{name.slice(0, 4)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
