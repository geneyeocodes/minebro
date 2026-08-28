import ItemImage from "../common/ItemImage";
import RecipeGrid from "./RecipeGrid";

export default function CatalogDetail({ items, item, onSelectItem }) {
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
            <RecipeGrid
              items={items}
              recipe={item.recipe}
              onSelectItem={onSelectItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
