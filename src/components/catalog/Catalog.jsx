import { useState } from "react";

import { getRecipeItems } from "../../utils/items";
import CatalogSidebar from "./CatalogSidebar";
import CatalogDetail from "./CatalogDetail";

export default function Catalog({ items }) {
  const recipeItems = getRecipeItems(items);

  const [search, setSearch] = useState("");
  const [selectedItemName, setSelectedItemName] = useState(
    recipeItems[0]?.name ?? null,
  );

  const filteredItems = recipeItems.filter((item) =>
    item.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedItem =
    recipeItems.find((item) => item.name === selectedItemName) ??
    filteredItems[0];

  return (
    <div className="catalog-layout">
      <CatalogSidebar
        items={filteredItems}
        search={search}
        selectedItemName={selectedItemName}
        onSearchChange={setSearch}
        onSelectItem={setSelectedItemName}
      />

      <CatalogDetail
        items={items}
        item={selectedItem}
        onSelectItem={setSelectedItemName}
      />
    </div>
  );
}
