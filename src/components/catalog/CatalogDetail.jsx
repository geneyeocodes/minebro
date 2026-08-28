import { useEffect, useState } from "react";
import ItemImage from "../common/ItemImage";
import RecipeGrid from "./RecipeGrid";

export default function CatalogDetail({ items, item, onSelectItem }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!item) return;

    setLoading(true);

    // Clear the grid immediately, then allow the new one
    // to render on the next tick.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [item?.name]);

  if (!item) {
    return (
      <div className="catalog-detail">
        <p>Select an item from the sidebar to view its recipe.</p>
      </div>
    );
  }

  return (
    <div className="catalog-detail">
      <div className="detail-container">
        <div className="detail-header">
          {item.image ? (
            <ItemImage item={item} size={64} className="detail-icon" />
          ) : (
            <div className="detail-icon-placeholder" />
          )}

          <div>
            <h2>{item.displayName}</h2>

            <p className="item-id">
              Registry Name: <code>{item.name}</code>
            </p>
          </div>
        </div>

        <div className="properties-card">
          <h3>Recipe</h3>

          <div className="recipe-box">
            {loading ? (
              <div className="recipe-loading" />
            ) : (
              <RecipeGrid
                key={item.name}
                items={items}
                recipe={item.recipe}
                onSelectItem={onSelectItem}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
