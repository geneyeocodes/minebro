import "./App.css";
import { useState } from "react";

import gameItems from "./data/gameItems.json";
import Header from "./components/common/Header";
import Catalog from "./components/catalog/Catalog";
import Game from "./components/game/Game";

export default function App() {
  const [view, setView] = useState("game");

  return (
    <div className="app">
      <Header view={view} onViewChange={setView} />

      <main className="app-content">
        {view === "game" ? (
          <Game items={gameItems} />
        ) : (
          <Catalog items={gameItems} />
        )}
      </main>
    </div>
  );
}
