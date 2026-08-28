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

// Local public assets directory
const publicAssetsDir = path.resolve(__dirname, "../../public/assets");

const mcData = MinecraftData(VERSION);

// Make sure public/assets exists
fs.mkdirSync(publicAssetsDir, { recursive: true });

const getSourceImagePath = (itemName) => {
  const itemImage = path.join(itemsDir, `${itemName}.png`);

  if (fs.existsSync(itemImage)) {
    return itemImage;
  }

  const blockImage = path.join(blocksDir, `${itemName}.png`);

  if (fs.existsSync(blockImage)) {
    return blockImage;
  }

  return null;
};

const copyItemImage = (itemName) => {
  const sourcePath = getSourceImagePath(itemName);

  if (!sourcePath) {
    return null;
  }

  const fileName = `${itemName}.png`;
  const destinationPath = path.join(publicAssetsDir, fileName);

  fs.copyFileSync(sourcePath, destinationPath);

  // Public assets are served from the site root
  return `/assets/${fileName}`;
};

const formattedItems = mcData.itemsArray
  .map((item) => {
    const image = copyItemImage(item.name);

    // Skip items that don't have an available image
    if (!image) {
      return null;
    }

    const rawRecipes = mcData.recipes[item.id];

    // Default grid if no recipe or shaped recipe exists
    let grid = null;

    if (rawRecipes) {
      const shapedRecipe = rawRecipes.find((entry) => entry.inShape);

      if (shapedRecipe) {
        grid = Array.from({ length: 3 }, () => Array(3).fill(null));

        let hasMissingImage = false;

        shapedRecipe.inShape.forEach((row, rIdx) => {
          if (rIdx >= 3) return;

          row.forEach((ingredientId, cIdx) => {
            if (cIdx < 3 && ingredientId !== null && ingredientId !== -1) {
              const ingItem = mcData.items[ingredientId];

              if (ingItem && getSourceImagePath(ingItem.name)) {
                grid[rIdx][cIdx] = ingItem.name;
              } else {
                hasMissingImage = true;
              }
            }
          });
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

console.log(`Copied item images to: ${publicAssetsDir}`);

console.log(`Generated JSON at: ${outputPath}`);
