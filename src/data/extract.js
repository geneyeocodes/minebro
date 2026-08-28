import MinecraftData from "minecraft-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSION = "26.1";
const ASSET_VERSION = "26.1";

const assetsDir = path.resolve(
  __dirname,
  "../../node_modules/minecraft-assets/minecraft-assets/data",
  ASSET_VERSION,
);

if (!fs.existsSync(assetsDir)) {
  console.error(
    `Could not find minecraft-assets data directory at: ${assetsDir}`,
  );
  process.exit(1);
}

const itemsDir = path.join(assetsDir, "items");
const blocksDir = path.join(assetsDir, "blocks");
const mcData = MinecraftData(VERSION);

const getRelativePathIfExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    return path.relative(__dirname, filePath);
  }
  return null;
};

// Helper function to check if an item/ingredient has a valid image asset
const getItemImagePath = (itemName) => {
  return (
    getRelativePathIfExists(path.join(itemsDir, `${itemName}.png`)) ||
    getRelativePathIfExists(path.join(blocksDir, `${itemName}.png`))
  );
};

const rawFormattedItems = mcData.itemsArray
  .map((item) => {
    let image = getItemImagePath(item.name);

    if (!image) {
      return null;
    }

    const recipes = [];

    // 1. Standard Shaped Crafting Recipes Only
    const rawRecipes = mcData.recipes[item.id];
    let hasInvalidIngredient = false;

    if (rawRecipes && rawRecipes.length > 0) {
      rawRecipes.forEach((recipeEntry) => {
        if (recipeEntry.inShape) {
          const grid = Array.from({ length: 3 }, () => Array(3).fill(null));
          let recipeHasMissingImage = false;

          recipeEntry.inShape.forEach((row, rIdx) => {
            if (rIdx < 3) {
              row.forEach((ingredientId, cIdx) => {
                if (cIdx < 3 && ingredientId !== null && ingredientId !== -1) {
                  const ingItem = mcData.items[ingredientId];
                  if (ingItem) {
                    // Check if the ingredient has an image
                    const ingImage = getItemImagePath(ingItem.name);
                    if (!ingImage) {
                      recipeHasMissingImage = true;
                    }
                    grid[rIdx][cIdx] = ingItem.name;
                  } else {
                    grid[rIdx][cIdx] = null;
                  }
                }
              });
            }
          });

          // Only add the recipe if all its ingredients have valid images
          if (!recipeHasMissingImage) {
            recipes.push({ type: "crafting_shaped", ingredients: grid });
          }
        }
      });
    }

    return {
      id: item.id,
      name: item.name,
      displayName: item.displayName,
      stackSize: item.stackSize || 64,
      recipes,
      image,
    };
  })
  .filter((item) => item !== null);

// Further filter out items whose recipes use ingredients that got filtered out
const formattedItems = rawFormattedItems.filter((item) => {
  const validItemNames = new Set(rawFormattedItems.map((i) => i.name));

  // Check if every ingredient in every recipe still exists in our valid item set
  item.recipes = item.recipes.filter((recipe) => {
    return recipe.ingredients.every((row) =>
      row.every((ingName) => ingName === null || validItemNames.has(ingName)),
    );
  });

  return true;
});

const outputPath = path.join(__dirname, "sampleItems.json");
fs.writeFileSync(outputPath, JSON.stringify(formattedItems, null, 2));

console.log(
  `Successfully generated data for all ${formattedItems.length} items!`,
);
