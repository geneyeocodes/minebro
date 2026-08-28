export const GAME_DURATION = 60;

export const KEY_LABELS = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];

export const KEY_TO_SLOT = Object.fromEntries(
  KEY_LABELS.map((key, index) => [key.toLowerCase(), index]),
);
