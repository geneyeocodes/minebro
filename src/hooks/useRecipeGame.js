import { useCallback, useEffect, useState } from "react";
import { getItemsWithRecipes } from "../utils/itemUtils";
import { getUniqueIngredients, recipesMatch } from "../utils/recipeUtils";

const GAME_DURATION = 60;

export default function useRecipeGame(items) {
  const itemsWithRecipes = getItemsWithRecipes(items);

  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetItem, setTargetItem] = useState(null);
  const [playerGrid, setPlayerGrid] = useState(Array(9).fill(null));
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  const startNewRound = useCallback(() => {
    if (itemsWithRecipes.length === 0) {
      return;
    }

    const randomItem =
      itemsWithRecipes[Math.floor(Math.random() * itemsWithRecipes.length)];

    const recipe = randomItem.recipes[0];

    const correctIngredients = getUniqueIngredients(recipe);

    const otherItems = itemsWithRecipes
      .filter(
        (item) =>
          item.name !== randomItem.name &&
          !correctIngredients.includes(item.name),
      )
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.max(0, 9 - correctIngredients.length))
      .map((item) => item.name);

    const pool = [...correctIngredients, ...otherItems].sort(
      () => 0.5 - Math.random(),
    );

    setTargetItem(randomItem);
    setPlayerGrid(Array(9).fill(null));
    setSelectedSlotIndex(null);
    setAvailableIngredients(pool);
  }, [itemsWithRecipes]);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");

    startNewRound();
  }, [startNewRound]);

  const skipItem = useCallback(() => {
    if (gameState !== "playing") return;

    startNewRound();
  }, [gameState, startNewRound]);

  const finishRound = useCallback(
    (grid) => {
      if (!targetItem) return;

      const recipe = targetItem.recipes[0];
      const isCorrect = recipesMatch(recipe, grid);

      if (isCorrect) {
        setScore((previous) => previous + 1);
        startNewRound();
      }
    },
    [targetItem, startNewRound],
  );

  const selectSlot = useCallback(
    (index) => {
      if (gameState !== "playing") return;

      if (playerGrid[index] !== null) {
        const newGrid = [...playerGrid];
        newGrid[index] = null;

        setPlayerGrid(newGrid);
        setSelectedSlotIndex(index);

        finishRound(newGrid);
        return;
      }

      setSelectedSlotIndex((current) => (current === index ? null : index));
    },
    [gameState, playerGrid, finishRound],
  );

  const selectIngredient = useCallback(
    (ingredientName) => {
      if (gameState !== "playing" || selectedSlotIndex === null) {
        return;
      }

      const newGrid = [...playerGrid];

      newGrid[selectedSlotIndex] = ingredientName;

      setPlayerGrid(newGrid);
      setSelectedSlotIndex(null);

      finishRound(newGrid);
    },
    [gameState, playerGrid, selectedSlotIndex, finishRound],
  );

  const clearSelectedSlot = useCallback(() => {
    if (selectedSlotIndex === null) return;

    const newGrid = [...playerGrid];
    newGrid[selectedSlotIndex] = null;

    setPlayerGrid(newGrid);
  }, [playerGrid, selectedSlotIndex]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("gameover");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;

    const keyMap = {
      q: 0,
      w: 1,
      e: 2,
      a: 3,
      s: 4,
      d: 5,
      z: 6,
      x: 7,
      c: 8,
    };

    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        skipItem();
        return;
      }

      if (event.code === "Backspace" || event.code === "Delete") {
        event.preventDefault();
        clearSelectedSlot();
        return;
      }

      const index = keyMap[event.key.toLowerCase()];

      if (index !== undefined) {
        selectSlot(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, skipItem, clearSelectedSlot, selectSlot]);

  return {
    gameState,
    score,
    timeLeft,
    targetItem,
    playerGrid,
    availableIngredients,
    selectedSlotIndex,

    startGame,
    skipItem,
    selectSlot,
    selectIngredient,
  };
}
