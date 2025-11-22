import * as React from "react";

export const useArrayState = <T>(initialValue: T[] | (() => T[])) => {
  const [values, setValues] = React.useState(initialValue);

  const append = React.useCallback((value: T) => {
    setValues((values) => [...values, value]);
  }, []);

  const update = React.useCallback((index: number, value: T) => {
    setValues((values) => {
      const newValues = [...values];
      newValues.splice(index, 1, value);
      return newValues;
    });
  }, []);

  const partialUpdate = React.useCallback(
    (index: number, updateValue: Partial<T>) => {
      setValues((values) => {
        const value = values[index];
        if (!value) return values;
        const newValues = [...values];
        newValues.splice(index, 1, { ...value, ...updateValue });
        return newValues;
      });
    },
    [],
  );

  const swap = React.useCallback((i1: number, i2: number) => {
    setValues((values) => {
      const newValues = [...values];
      const v1 = newValues[i1]!;
      newValues[i1] = newValues[i2]!;
      newValues[i2] = v1;
      return newValues;
    });
  }, []);

  const remove = React.useCallback((index: number) => {
    setValues((values) => {
      const newValues = [...values];
      newValues.splice(index, 1);
      return newValues;
    });
  }, []);

  return {
    values,
    setValues,
    append,
    update,
    partialUpdate,
    swap,
    remove,
  };
};
