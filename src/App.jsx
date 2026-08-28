import { useState } from "react";
import sampleItems from "./data/sampleItems.json";
import "./App.css";

import Header from "./components/Header";
import Catalog from "./components/Catalog/Catalog";
import Game from "./components/Game/Game";

export default function App() {
  const [view, setView] = useState("game");

  return (
    <div className="app-container">
      <Header view={view} onViewChange={setView} />

      <main className="app-content">
        {view === "game" ? (
          <Game items={sampleItems} />
        ) : (
          <Catalog items={sampleItems} />
        )}
      </main>
    </div>
  );
}
