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

const itemsDir = path.join(assetsDir, "items");
const blocksDir = path.join(assetsDir, "blocks");
const mcData = MinecraftData(VERSION);

const getRelativePathIfExists = (filePath) =>
  fs.existsSync(filePath) ? path.relative(__dirname, filePath) : null;

const getItemImagePath = (itemName) =>
  getRelativePathIfExists(path.join(itemsDir, `${itemName}.png`)) ||
  getRelativePathIfExists(path.join(blocksDir, `${itemName}.png`));

const formattedItems = mcData.itemsArray
  .map((item) => {
    const image = getItemImagePath(item.name);
    if (!image) return null;

    const rawRecipes = mcData.recipes[item.id];

    // Default grid if no recipe or shaped recipe exists
    let grid = null;

    if (rawRecipes) {
      const shapedRecipe = rawRecipes.find((entry) => entry.inShape);
      if (shapedRecipe) {
        grid = Array.from({ length: 3 }, () => Array(3).fill(null));
        let hasMissingImage = false;

        shapedRecipe.inShape.forEach((row, rIdx) => {
          if (rIdx < 3) {
            row.forEach((ingredientId, cIdx) => {
              if (cIdx < 3 && ingredientId !== null && ingredientId !== -1) {
                const ingItem = mcData.items[ingredientId];
                if (ingItem && getItemImagePath(ingItem.name)) {
                  grid[rIdx][cIdx] = ingItem.name;
                } else {
                  hasMissingImage = true;
                }
              }
            });
          }
        });

        // If an ingredient is missing an image, clear the recipe grid
        if (hasMissingImage) {
          grid = null;
        }
      }
    }

    return {
      id: item.id,
      name: item.name,
      displayName: item.displayName,
      image,
      recipe: grid,
    };
  })
  .filter((item) => item !== null);

const outputPath = path.join(__dirname, "gameItems.json");
fs.writeFileSync(outputPath, JSON.stringify(formattedItems, null, 2));

console.log(`Successfully generated data for ${formattedItems.length} items!`);
