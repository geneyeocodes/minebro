# ⛏️ MineBro

A **Minecraft-styled web app** built with **React 19** and **Vite** that turns the vanilla
Minecraft crafting recipe table into a fast-paced guessing game and a browsable item catalog.

The app ships with **1,049 real items** (332 of which have craftable recipes), generated from
the official `minecraft-data` and `minecraft-assets` datasets. Item names, textures and every
shaped crafting recipe are pulled straight from the game files.

---

## ✨ Features

### 🎮 Recipe Guessing Game

- A **60-second timed challenge**: craft the target item as many times as you can before the clock runs out.
- A **3×3 player grid** and a **randomized 9-slot ingredient pool** filled with the correct items plus distractor items.
- **Auto-advancing rounds** — fill in the correct recipe and you instantly gain a point and get a new target.
- **Skip** any item you don't recognize — no penalty.
- **Full keyboard + mouse support**: `Q W E / A S D / Z X C` select cells, `Space` skips, `Backspace` / `Delete` clears a slot.

### 📚 Item Catalog

- **Searchable sidebar** — type to filter items by display name.
- **Recipe viewer** — click any item to inspect its 3×3 crafting-shaped layout built from real game data.
- **Clickable ingredients** — ingredients that themselves have recipes are linked, so you can drill down into chained crafting dependencies (e.g. follow a tool’s ingredients all the way back to raw materials).

### 🖥️ Minecraft-inspired UI

- Pixel "Press Start 2P" font, blocky stone/wood/grass color palette, and crafting-table arcade styling.

---

## 🚀 Getting Started

This project uses **Node.js** with **Vite** as the bundler and dev server. React 19 requires a modern Node version (**v18+ recommended**).

| Tool    | Version            |
| ------- | ------------------ |
| Node.js | v18 or newer (LTS) |
| npm     | bundled with Node  |

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`) — open it in your browser.

### 3. Build for production

```bash
npm run build
npm run preview   # locally serve the production build
```

### 4. Lint

```bash
npm run lint      # runs oxlint
```

---

## 📦 Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR |
| `npm run build`   | Build the app into `dist/`         |
| `npm run preview` | Serve the built `dist/` locally    |
| `npm run lint`    | Run the Oxlint linter              |

---

## 🎮 How to Play

1. Open the app — you land on the **Guessing Game** view with a start screen.
2. Click **Start Game**. A 60-second countdown begins and a random craftable target is shown in the banner.
3. Click a cell in the **3×3 grid** to select it (or press the matching key `Q W E / A S D / Z X C`).
4. Click an ingredient in the **pool** to drop it into the selected cell. Clicking a filled cell again clears it.
5. When your grid matches the target item’s recipe, you score **+1** and get a **new target**.
6. When time runs out, your **final score** is shown on the **Game Over** screen — hit **Play Again** to restart.

### ⌨️ Keyboard Controls

| Key                                     | Action                                               |
| --------------------------------------- | ---------------------------------------------------- |
| `Q` `W` `E` / `A` `S` `D` / `Z` `X` `C` | Select / clear grid cells (top-left to bottom-right) |
| `Space`                                 | Skip the current target                              |
| `Backspace` / `Delete`                  | Clear the currently selected cell                    |
| Mouse                                   | Click cells, pool ingredients, or buttons            |

> **Recipe matching rules** — the game understands real-game conventions:
>
> - **Shaped** recipes must match positionally, but the pattern may sit anywhere inside the 3×3 grid and the grid cannot contain stray leftover items outside the recipe shape.
> - **Shapeless** recipes match purely by ingredient count + multiset (order / position don’t matter).

---

## 🗃️ Where the Data Comes From

All item and recipe content lives in `src/data/sampleItems.json` — a static JSON snapshot generated once from official data packages. Each entry looks like:

```json
{
  "id": 4,
  "name": "diorite",
  "displayName": "Diorite",
  "stackSize": 64,
  "recipes": [
    {
      "type": "crafting_shaped",
      "ingredients": [
        ["cobblestone", "quartz", null],
        ["quartz", "cobblestone", null],
        [null, null, null]
      ]
    }
  ],
  "image": "../node_modules/minecraft-assets/minecraft-assets/data/26.1/blocks/diorite.png"
}
```

**To regenerate the dataset** (e.g. after updating the `minecraft-data` / `minecraft-assets` packages), run:

```bash
node src/data/extract.js
```

`src/data/extract.js` works by:

1. Reading `minecraft-data` for all items and their **shaped crafting recipes** (version **26.1**).
2. Reading `minecraft-assets` texture files (blocks + items) to resolve each item’s image path.
3. **Filtering aggressively**: only items with a valid texture — and recipes whose **every ingredient** also has a texture — are kept, so the game and catalog never render blank slots.
4. Writing the cleaned JSON back to `src/data/sampleItems.json`.

> ℹ️ Images are referenced relative to the project and served from `node_modules/` via Vite, so no external CDN is required.

---

## 🧩 Project Structure

```text
minebro/
├── index.html                       # Vite entry page
├── vite.config.js                    # Vite config + Node polyfills for minecraft-data
├── .oxlintrc.json                    # Oxlint rules (React hooks, export rules)
├── package.json
└── src/
    ├── main.jsx                      # React root
    ├── App.jsx                       # Top-level view switcher (game vs catalog)
    ├── App.css                       # All Minecraft-styled styles
    ├── components/
    │   ├── Header.jsx                # App header + nav toggles
    │   ├── Catalog/                  # The item catalog
    │   │   ├── Catalog.jsx           #   Catalog layout + state (search / selection)
    │   │   ├── CatalogSidebar.jsx    #   Searchable item list
    │   │   ├── CatalogDetail.jsx     #   Selected item detail view
    │   │   ├── RecipeGrid.jsx        #   3×3 recipe renderer (clickable ingredients)
    │   │   └── ItemIcon.jsx          #   (empty placeholder, not yet used)
    │   └── Game/                     # The guessing game
    │       ├── Game.jsx              # Game screen host + state machine routing
    │       ├── GameIdle.jsx          # Start screen
    │       ├── GamePlaying.jsx       # Active gameplay screen
    │       ├── GameGrid.jsx          # 3×3 player grid (9 slots)
    │       ├── GameTarget.jsx        # Target item banner + skip button
    │       ├── IngredientPool.jsx    # Ingredient pool
    │       └── GameOver.jsx          # Final score / restart screen
    ├── hooks/
    │   └── useRecipeGame.js          # All game logic: timer, scoring, keyboard
    ├── utils/
    │   ├── itemUtils.js              # Item lookup + recipe-grid helpers
    │   └── recipeUtils.js            # Recipe matching (shaped + shapeless)
    └── data/
        ├── extract.js                # Data generator script
        └── sampleItems.json          # Generated snapshot (1,049 items / 332 craftable)
```

---

## ⚙️ Configuration

| Setting       | Location                     | Notes                                |
| ------------- | ---------------------------- | ------------------------------------ |
| Game duration | `src/hooks/useRecipeGame.js` | `GAME_DURATION = 60` (seconds)       |
| Data versions | `src/data/extract.js`        | `VERSION`, `ASSET_VERSION` (26.1)    |
| Item dataset  | `src/data/sampleItems.json`  | Edit directly or regenerate          |
| UI theme      | `src/App.css` → `:root`      | CSS custom properties (colors, font) |

---

## ⚠️ Known Limitations

- **Filtering is aggressive**: only items that have both a valid texture and a recipe whose every ingredient also has a texture make it into the dataset — items without textures are dropped.
- **Shaped recipes only by design**: `extract.js` only reads `crafting_shaped` rows; furnace/smelting/block-transform recipes are not modeled.
- **2×2 recipes** are centered into the 3×3 grid for consistency with the matching logic.
- **Missing texture fallback**: `item` grid slots show a short text fallback when no image asset exists (handled via `ItemIcon` in the catalog).
- The game only draws from items **with a valid recipe**; purely decorative/non-craftable items appear only in the catalog.

---

## 🧭 Roadmap (Ideas)

- Add difficulty levels / adjustable round time.
- Support furnaces (smelting) and shapeless recipes in the dataset.
- Add multiple recipe variants per item and shape-rotation detection.
- Persist high scores, add sounds, and optimize for touch/mobile.

---

## 📄 License

This is a fan-made educational project. Minecraft is a trademark of Mojang AB / Microsoft. All game content, assets, and text used here are for educational, non-commercial purposes. It is **not** an official Mojang or Microsoft product. See the respective licenses of `minecraft-data` and `minecraft-assets` for their terms.

---

> Craft fast, bro. 🏆
