export default function GameTarget({ targetItem, onSkip }) {
  return (
    <div className="game-target-banner">
      <span>Craft:</span>

      {targetItem.image && (
        <img
          src={targetItem.image}
          alt={targetItem.displayName}
          width={32}
          height={32}
        />
      )}

      <strong>{targetItem.displayName}</strong>

      <button
        onClick={onSkip}
        className="game-skip-btn"
        title="Skip this item (Spacebar)"
      >
        Skip (Space)
      </button>
    </div>
  );
}
