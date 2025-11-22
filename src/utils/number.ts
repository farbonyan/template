/**
 * Get a number value between min and max
 *
 * @param value Value
 * @param min Minimum range
 * @param max Maximum range
 * @returns Value that is in range
 */
export const between = (value: number, min: number, max: number) => {
  if (value > max) return max;
  if (value < min) return min;
  return value;
};

/**
 * Get a function that gives the value between min and max
 *
 * @param min Minimum range
 * @param max Maximum range
 * @returns Function to get value in range
 */
export const getBetween = (min: number, max: number) => (value: number) => {
  if (value > max) return max;
  if (value < min) return min;
  return value;
};
