const hashStringToNumber = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const generateColorFromHash = (
  hash: number,
  saturation: number,
  lightness: number,
) => {
  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const generateColorsFromString = (seed: string) => {
  const hash = hashStringToNumber(seed);

  const background = generateColorFromHash(hash, 50, 90);
  const text = generateColorFromHash(hash + 1, 80, 30);
  const border = generateColorFromHash(hash + 2, 60, 80);

  return { background, text, border };
};