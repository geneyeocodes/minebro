export default function GameOver({ score, onRestart }) {
  return (
    <div className="game-over-screen">
      <h2>Game Over!</h2>

      <p>
        Final Score: <strong>{score}</strong>
      </p>

      <button onClick={onRestart} className="game-restart-btn">
        Play Again
      </button>
    </div>
  );
}
