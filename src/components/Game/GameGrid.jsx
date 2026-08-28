import { getIngredientDetails } from "../../utils/itemUtils";

const KEY_LABELS = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

export default function GameGrid({
  items,
  playerGrid,
  selectedSlotIndex,
  onSlotClick,
}) {
  return (
    <div className="game-player-grid">
      {playerGrid.map((ingredientName, index) => {
        const ingredient = getIngredientDetails(items, ingredientName);

        const isSelected = selectedSlotIndex === index;

        return (
          <div
            key={index}
            onClick={() => onSlotClick(index)}
            className={`game-grid-slot ${isSelected ? "selected" : ""}`}
          >
            <span className="game-slot-key">{KEY_LABELS[index]}</span>

            {ingredient?.image && (
              <img
                src={ingredient.image}
                alt={ingredientName}
                width={32}
                height={32}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
