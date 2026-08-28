import useRecipeGame from "../../hooks/useRecipeGame";

import ItemImage from "../common/ItemImage";
import GameGrid from "./GameGrid";
import IngredientPool from "./IngredientPool";

export default function Game({ items }) {
  const {
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
  } = useRecipeGame(items);

  if (gameState === "idle") {
    return (
      <div className="game-container">
        <div className="game-idle-screen">
          <h2>Recipe Guessing Game</h2>

          <p>
            Craft as many correct items as you can before time runs out!
            <br />
            Match the recipe exactly as shown in the Catalog.
            <br />
            Use keys <strong>Q W E / A S D / Z X C</strong> to select cells,{" "}
            <strong>Spacebar</strong> to skip.
          </p>

          <button onClick={startGame} className="game-start-btn">
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "gameover") {
    return (
      <div className="game-container">
        <div className="game-over-screen">
          <h2>Game Over!</h2>

          <p>
            Final Score: <strong>{score}</strong>
          </p>

          <button onClick={startGame} className="game-restart-btn">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-playing-screen">
        <div className="game-scoreboard">
          <span>Score: {score}</span>
          <span>Time: {timeLeft}s</span>
        </div>

        <div className="game-target-banner">
          <span>Craft:</span>

          <ItemImage item={targetItem} />

          <strong>{targetItem.displayName}</strong>

          <button
            onClick={skipItem}
            className="game-skip-btn"
            title="Skip this item (Spacebar)"
          >
            Skip (Space)
          </button>
        </div>

        <GameGrid
          items={items}
          playerGrid={playerGrid}
          selectedSlotIndex={selectedSlotIndex}
          onSlotClick={selectSlot}
        />

        <IngredientPool
          items={items}
          ingredients={availableIngredients}
          onIngredientClick={selectIngredient}
        />
      </div>
    </div>
  );
}
