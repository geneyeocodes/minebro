import { getItem } from "../../utils/items";
import { getIngredients } from "../../utils/recipes";
import ItemImage from "../common/ItemImage";

export default function RecipeGrid({ items, recipe, onSelectItem }) {
  if (!recipe) {
    return <p>No direct crafting recipe found.</p>;
  }

  return (
    <div className="crafting-grid">
      {getIngredients(recipe).map((name, index) => {
        const item = getItem(items, name);
        const clickable = Boolean(item?.recipe);

        return (
          <div
            key={index}
            onClick={() => clickable && onSelectItem(item.name)}
            className={`crafting-slot ${clickable ? "clickable" : ""}`}
          >
            {item?.image ? (
              <ItemImage item={item} />
            ) : (
              <span className="slot-fallback-text">{name?.slice(0, 4)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
