import useRecipeGame from "../../hooks/useRecipeGame";

import GameIdle from "./GameIdle";
import GamePlaying from "./GamePlaying";
import GameOver from "./GameOver";

export default function Game({ items }) {
  const game = useRecipeGame(items);

  return (
    <div className="game-container">
      {game.gameState === "idle" && <GameIdle onStart={game.startGame} />}

      {game.gameState === "playing" && game.targetItem && (
        <GamePlaying
          items={items}
          targetItem={game.targetItem}
          score={game.score}
          timeLeft={game.timeLeft}
          playerGrid={game.playerGrid}
          availableIngredients={game.availableIngredients}
          selectedSlotIndex={game.selectedSlotIndex}
          onSlotClick={game.selectSlot}
          onIngredientClick={game.selectIngredient}
          onSkip={game.skipItem}
        />
      )}

      {game.gameState === "gameover" && (
        <GameOver score={game.score} onRestart={game.startGame} />
      )}
    </div>
  );
}
