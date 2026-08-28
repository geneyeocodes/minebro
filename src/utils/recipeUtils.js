export function getRecipeIngredients(recipe) {
  return recipe.ingredients.flat();
}

export function getUniqueIngredients(recipe) {
  return [...new Set(getRecipeIngredients(recipe).filter(Boolean))];
}

export function recipesMatch(recipe, playerGrid) {
  const targetFlat = getRecipeIngredients(recipe);

  const isShapeless = recipe.type === "shapeless" || recipe.shapeless;

  if (isShapeless) {
    return checkShapelessMatch(targetFlat, playerGrid);
  }

  return checkShapedMatch(targetFlat, playerGrid);
}

function checkShapelessMatch(targetFlat, playerGrid) {
  const targetItems = targetFlat.filter(Boolean).sort();
  const playerItems = playerGrid.filter(Boolean).sort();

  return (
    targetItems.length === playerItems.length &&
    targetItems.every((value, index) => value === playerItems[index])
  );
}

function checkShapedMatch(targetFlat, currentGrid) {
  let minRow = 3;
  let maxRow = -1;
  let minCol = 3;
  let maxCol = -1;

  const targetGrid = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

  targetFlat.forEach((value, index) => {
    if (!value) return;

    const row = Math.floor(index / 3);
    const col = index % 3;

    targetGrid[row][col] = value;

    minRow = Math.min(minRow, row);
    maxRow = Math.max(maxRow, row);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
  });

  if (maxRow === -1) {
    return false;
  }

  const targetHeight = maxRow - minRow + 1;
  const targetWidth = maxCol - minCol + 1;

  const playerGrid = Array(3)
    .fill(null)
    .map((_, row) =>
      Array(3)
        .fill(null)
        .map((_, col) => currentGrid[row * 3 + col] || null),
    );

  for (let rowOffset = 0; rowOffset <= 3 - targetHeight; rowOffset++) {
    for (let colOffset = 0; colOffset <= 3 - targetWidth; colOffset++) {
      if (
        matchesPosition(
          targetGrid,
          playerGrid,
          minRow,
          maxRow,
          minCol,
          maxCol,
          rowOffset,
          colOffset,
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function matchesPosition(
  targetGrid,
  playerGrid,
  minRow,
  maxRow,
  minCol,
  maxCol,
  rowOffset,
  colOffset,
) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const expected =
        row >= minRow && row <= maxRow && col >= minCol && col <= maxCol
          ? targetGrid[row][col]
          : null;

      const actual = playerGrid[row + rowOffset]?.[col + colOffset] || null;

      if ((expected || null) !== (actual || null)) {
        return false;
      }
    }
  }

  return !hasExtraItems(
    playerGrid,
    rowOffset,
    colOffset,
    maxRow - minRow + 1,
    maxCol - minCol + 1,
  );
}

function hasExtraItems(
  playerGrid,
  rowOffset,
  colOffset,
  targetHeight,
  targetWidth,
) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const insideRecipe =
        row >= rowOffset &&
        row < rowOffset + targetHeight &&
        col >= colOffset &&
        col < colOffset + targetWidth;

      if (!insideRecipe && playerGrid[row][col] !== null) {
        return true;
      }
    }
  }

  return false;
}
