export default function Header({ view, onViewChange }) {
  return (
    <header className="app-header">
      <h1>MineBro</h1>

      <nav className="app-nav">
        <button
          onClick={() => onViewChange("game")}
          className={`nav-btn ${view === "game" ? "active" : ""}`}
        >
          Guessing Game
        </button>

        <button
          onClick={() => onViewChange("catalog")}
          className={`nav-btn ${view === "catalog" ? "active" : ""}`}
        >
          Catalog
        </button>
      </nav>
    </header>
  );
}
