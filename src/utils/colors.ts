import { clamp } from "./clamp";

const adjustTone = (hex: string, factor: number) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = clamp(((num >> 16) & 0xff) + 255 * factor, 0, 255);
  const g = clamp(((num >> 8) & 0xff) + 255 * factor, 0, 255);
  const b = clamp((num & 0xff) + 255 * factor, 0, 255);
  return `#${(
    (1 << 24) +
    (Math.round(r) << 16) +
    (Math.round(g) << 8) +
    Math.round(b)
  )
    .toString(16)
    .slice(1)}`;
};

const PALETTE = [
  { main: "#d47c6a", border: "#f4d1cb" },
  { main: "#7c85c2", border: "#e1e3f4" },
  { main: "#7ca0b8", border: "#d8e5ed" },
  { main: "#9bbf9e", border: "#d9e8d9" },
  { main: "#b8a6c9", border: "#e8e0ef" },
  { main: "#84c2b9", border: "#d4efec" },
  { main: "#f4d1cb", border: "#d47c6a" },
  { main: "#e1e3f4", border: "#7c85c2" },
  { main: "#d8e5ed", border: "#7ca0b8" },
  { main: "#d9e8d9", border: "#9bbf9e" },
  { main: "#e8e0ef", border: "#b8a6c9" },
  { main: "#d4efec", border: "#84c2b9" },
];

export const getSequentialColor = (index: number) => {
  const base = PALETTE[index % PALETTE.length]!;
  const toneCycle = Math.floor(index / PALETTE.length);
  const toneFactor = toneCycle * 0.05;
  const main = adjustTone(base.main, toneFactor);
  const border = adjustTone(base.border, toneFactor);
  return { main, border };
};
