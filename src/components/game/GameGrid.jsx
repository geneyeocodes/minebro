import { getItem } from "../../utils/items";
import { KEY_LABELS } from "../../utils/game";
import ItemImage from "../common/ItemImage";

export default function GameGrid({
  items,
  playerGrid,
  selectedSlotIndex,
  onSlotClick,
}) {
  return (
    <div className="game-player-grid">
      {playerGrid.map((name, index) => {
        const item = getItem(items, name);

        return (
          <div
            key={index}
            onClick={() => onSlotClick(index)}
            className={`game-grid-slot ${
              selectedSlotIndex === index ? "selected" : ""
            }`}
          >
            <span className="game-slot-key">{KEY_LABELS[index]}</span>

            <ItemImage item={item} />
          </div>
        );
      })}
    </div>
  );
}
