import { useEffect, useState } from "react";

import { getRecipeItems } from "../utils/items";
import { getUniqueIngredients, recipeMatches } from "../utils/recipes";
import { GAME_DURATION, KEY_TO_SLOT } from "../utils/game";

export default function useRecipeGame(items) {
  const recipeItems = getRecipeItems(items);

  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetItem, setTargetItem] = useState(null);
  const [playerGrid, setPlayerGrid] = useState(Array(9).fill(null));
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  function startNewRound() {
    if (!recipeItems.length) return;

    const target = recipeItems[Math.floor(Math.random() * recipeItems.length)];

    const correctIngredients = getUniqueIngredients(target.recipe);

    const distractors = recipeItems
      .filter(
        (item) =>
          item.name !== target.name && !correctIngredients.includes(item.name),
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 9 - correctIngredients.length)
      .map((item) => item.name);

    const ingredients = [...correctIngredients, ...distractors].sort(
      () => Math.random() - 0.5,
    );

    setTargetItem(target);
    setPlayerGrid(Array(9).fill(null));
    setSelectedSlotIndex(null);
    setAvailableIngredients(ingredients);
  }

  function startGame() {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    startNewRound();
  }

  function skipItem() {
    if (gameState === "playing") {
      startNewRound();
    }
  }

  function updateGrid(grid) {
    setPlayerGrid(grid);

    if (targetItem && recipeMatches(targetItem.recipe, grid)) {
      setScore((currentScore) => currentScore + 1);
      startNewRound();
    }
  }

  function selectSlot(index) {
    if (gameState !== "playing") return;

    // Clicking an occupied slot removes the item.
    if (playerGrid[index] !== null) {
      const newGrid = [...playerGrid];
      newGrid[index] = null;

      setSelectedSlotIndex(index);
      updateGrid(newGrid);
      return;
    }

    // Clicking an empty slot selects/deselects it.
    setSelectedSlotIndex((current) => (current === index ? null : index));
  }

  function selectIngredient(name) {
    if (gameState !== "playing" || selectedSlotIndex === null) {
      return;
    }

    const newGrid = [...playerGrid];
    newGrid[selectedSlotIndex] = name;

    setSelectedSlotIndex(null);
    updateGrid(newGrid);
  }

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("gameover");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;

    function handleKeyDown(event) {
      if (event.code === "Space") {
        event.preventDefault();
        skipItem();
        return;
      }

      const index = KEY_TO_SLOT[event.key.toLowerCase()];

      if (index !== undefined) {
        selectSlot(index);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState, playerGrid, selectedSlotIndex, targetItem]);

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
