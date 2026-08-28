export default function GameIdle({ onStart }) {
  return (
    <div className="game-idle-screen">
      <h2>Recipe Guessing Game</h2>

      <p>
        Craft as many correct items as you can before time runs out!
        <br />
        Use keys <strong>Q W E / A S D / Z X C</strong> to select cells,{" "}
        <strong>Spacebar</strong> to skip.
      </p>

      <button onClick={onStart} className="game-start-btn">
        Start Game
      </button>
    </div>
  );
}
