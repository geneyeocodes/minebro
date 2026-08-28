import GameTarget from "./GameTarget";
import GameGrid from "./GameGrid";
import IngredientPool from "./IngredientPool";

export default function GamePlaying({
  items,
  targetItem,
  score,
  timeLeft,
  playerGrid,
  availableIngredients,
  selectedSlotIndex,
  onSlotClick,
  onIngredientClick,
  onSkip,
}) {
  return (
    <div className="game-playing-screen">
      <div className="game-scoreboard">
        <span>Score: {score}</span>
        <span>Time: {timeLeft}s</span>
      </div>

      <GameTarget targetItem={targetItem} onSkip={onSkip} />

      <GameGrid
        items={items}
        playerGrid={playerGrid}
        selectedSlotIndex={selectedSlotIndex}
        onSlotClick={onSlotClick}
      />

      <IngredientPool
        items={items}
        ingredients={availableIngredients}
        onIngredientClick={onIngredientClick}
      />
    </div>
  );
}
