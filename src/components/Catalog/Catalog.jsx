import { useMemo, useState } from "react";
import { getItemsWithRecipes } from "../../utils/itemUtils";

import CatalogSidebar from "./CatalogSidebar";
import CatalogDetail from "./CatalogDetail";

export default function Catalog({ items }) {
  const itemsWithRecipes = useMemo(() => getItemsWithRecipes(items), [items]);

  const [search, setSearch] = useState("");

  const [selectedItemName, setSelectedItemName] = useState(
    itemsWithRecipes.length > 0 ? itemsWithRecipes[0].name : null,
  );

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase();

    return itemsWithRecipes.filter((item) =>
      item.displayName.toLowerCase().includes(query),
    );
  }, [itemsWithRecipes, search]);

  const selectedItem =
    itemsWithRecipes.find((item) => item.name === selectedItemName) ||
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
