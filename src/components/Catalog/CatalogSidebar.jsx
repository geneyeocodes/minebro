import ItemImage from "../common/ItemImage";

export default function CatalogSidebar({
  items,
  search,
  selectedItemName,
  onSearchChange,
  onSelectItem,
}) {
  return (
    <div className="catalog-sidebar">
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="search-input"
      />

      <div className="item-list">
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => onSelectItem(item.name)}
            className={`item-row ${
              selectedItemName === item.name ? "active" : ""
            }`}
          >
            {item.image ? (
              <ItemImage item={item} size={28} className="item-icon" />
            ) : (
              <div className="item-icon-placeholder" />
            )}

            <span className="item-name">{item.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
