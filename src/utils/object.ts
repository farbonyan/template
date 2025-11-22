/**
 * Get if two objects are deep equal
 *
 * @param a First object
 * @param b Second object
 * @returns Returns true if two objects are equal
 */
export const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (a === null || b === null) return a === b;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((el, idx) => deepEqual(el, b[idx]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every((key) => {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      return deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      );
    });
  }

  return false;
};

/**
 * Get if an object has all keys
 *
 * @param obj Object
 * @param keys Key array of object
 * @returns Returns true if all keys exists in object
 */
export const hasKeys = <T extends object>(
  obj: T,
  keys: readonly Exclude<keyof T, symbol>[],
) => {
  return keys.some((key) => key in obj);
};

/**
 * Get if an object has other keys
 *
 * @param obj Object
 * @param keys Key array of object
 * @returns Returns true if other keys exists in object
 */
export const hasOtherKeys = <T extends object>(
  obj: T,
  keys: readonly Exclude<keyof T, symbol>[],
) => {
  return Object.keys(obj).some(
    (key) => !keys.includes(key as Exclude<keyof T, symbol>),
  );
};

/**
 * Get if an object has all keys without key type checking
 *
 * @param obj Object
 * @param keys Key array of object
 * @returns Returns true if all keys exists in object
 */
export const hasStringKeys = <T extends object>(obj: T, keys: string[]) => {
  return keys.some((key) => key in obj);
};

/**
 * Parse array of ids into an object with keys of ids and value of true
 *
 * @param ids List of ids
 * @returns An object with keys of ids and value of true
 */
export const parseIdsToObjectKey = (ids: number[]) => {
  return Object.fromEntries(ids.map((id) => [id, true]));
};

/**
 * Parse object with keys of ids into array of ids
 *
 * @param obj Object with values of ids and value of boolean
 * @returns List of all keys of object with value of true
 */
export const parseKeyObjectToIds = (obj: Record<string, boolean>) => {
  return Object.keys(obj)
    .filter((key) => obj[key])
    .map((key) => Number.parseInt(key));
};
