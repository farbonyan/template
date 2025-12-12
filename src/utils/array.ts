/**
 * Find an item in array and return the item and the rest of the array
 *
 * @param array Array of data
 * @param predicate function to find an item
 * @returns The found item and the rest of the array
 */
export const findOne = <T>(
  array: T[],
  predicate: (value: T, index: number) => boolean,
) => {
  const index = array.findIndex(predicate);
  if (index < -1) {
    return [undefined, array] as const;
  }
  const newArray = [...array];
  newArray.splice(index, 1);
  return [array[index], newArray] as const;
};

/**
 * Swap two items in array and return a new one
 *
 * @param array Array of data
 * @param srcIndex Index of source item
 * @param targetIndex Index of target item
 * @returns New array that items are swapped
 */
export const swap = <T>(array: T[], srcIndex: number, targetIndex: number) => {
  const newArray = [...array];
  const tmp = newArray[srcIndex]!;
  newArray[srcIndex] = newArray[targetIndex]!;
  newArray[targetIndex] = tmp;
  return newArray;
};

/**
 * Move two items in array and return a new one
 *
 * @param array Array of data
 * @param srcIndex Index of source item
 * @param targetIndex Index of target item
 * @returns New array that items are moved
 */
export const move = <T>(array: T[], srcIndex: number, targetIndex: number) => {
  const newArray = [...array];
  const [item] = newArray.splice(srcIndex, 1);
  newArray.splice(targetIndex, 0, item as T);
  return newArray;
};

/**
 * Get a unique array of data
 *
 * @param array Array of data
 * @returns Unique array
 */
export const unique = <T>(array: T[]) => {
  return [...new Set(array)];
};

/**
 * Get an array of object that are unique by a key
 *
 * @param array Array of data
 * @param key Key of data item that would be unique in result
 * @returns Array of data that are unique by the key
 */
export const uniqueByKey = <TObj, TKey extends keyof TObj>(
  array: TObj[],
  key: TKey,
) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};

/**
 * Get single unique value of object that is the same in whole array
 *
 * @param array Array of data
 * @param key Key of data item that would be unique in result
 * @returns Single unique value of a key in objects
 */
export const getUniqueValue = <TObj, TKey extends keyof TObj>(
  array: TObj[],
  key: TKey,
  filterEmpty?: boolean,
) => {
  const values = [
    ...new Set(
      (filterEmpty
        ? array.filter(
            (item) => item[key] !== null && typeof item[key] !== "undefined",
          )
        : array
      ).map((item) => item[key]),
    ),
  ];
  return values.length === 1 ? values[0] : undefined;
};

/**
 * Get sum of a list of numbers
 *
 * @param array Array of numbers
 * @returns Sum of all items
 */
export const sum = (array: number[]) => {
  return array.reduce((pre, cur) => pre + cur, 0);
};

/**
 * Get a splitted array which items are less than max
 *
 * @param array Array of data
 * @param key Key of data
 * @param max Maximum value that could be in a list
 * @returns
 */
export const splitMaxByKey = <TObj, TKey extends keyof TObj>(
  array: TObj[],
  key: TKey,
  max: number,
) => {
  return array.reduce<TObj[][]>(
    (pre, cur) => {
      const lastArray = pre.at(-1);
      if (!lastArray) return pre;
      const value = cur[key] as number;
      const lastArrayValues = lastArray.map((item) => item[key]) as number[];
      const s = sum(lastArrayValues) + value;
      if (lastArray.length > 0 && s > max) return [...pre, [cur]];
      return [...pre.slice(0, -1), [...lastArray, cur]];
    },
    [[]],
  );
};

/** Tree node type of generic type T with configurable children key */
export type TreeNode<T, K extends string = "_children"> = T &
  Partial<Record<K, TreeNode<T, K>[]>>;

/** Tree type of generic type T with configurable children key */
export type Tree<T, K extends string = "_children"> = TreeNode<T, K>[];

/**
 * Make tree from an array of objects
 *
 * @param array Array of items (with id and parentId)
 * @param id Array item identifier
 * @param parentId Array parent item identifier
 * @param childrenKey Key to children array
 * @returns Tree of array
 */
export const makeTree = <T extends object, K extends string = "_children">(
  array: T[],
  idKey: keyof T,
  parentIdKey: keyof T,
  childrenKey: K = "_children" as K,
): Tree<T, K> => {
  const lookup = new Map<unknown, TreeNode<T, K>>();
  const tree: Tree<T, K> = [];

  // First pass: create all nodes
  for (const item of array) {
    lookup.set(item[idKey], { ...item });
  }

  // Second pass: link children
  for (const item of array) {
    const node = lookup.get(item[idKey])!;
    const parentId = item[parentIdKey];
    if (parentId == null || !lookup.has(parentId)) {
      tree.push(node);
    } else {
      const parent = lookup.get(parentId)!;
      if (!parent[childrenKey]) {
        parent[childrenKey] = [] as TreeNode<T, K>[K];
      }
      parent[childrenKey]!.push(node);
    }
  }

  return tree;
};

/**
 * Get leaf nodes of a tree
 *
 * @param array Array of items (with id and parentId)
 * @param key Key to children array
 * @returns Array of leaf nodes
 */
export const getLeafNodes = <T, K extends string = "_children">(
  array: Tree<T, K>,
  key: K = "_children" as K,
): {
  item: T;
  parents: T[];
  indexes: number[];
}[] => {
  return array.flatMap((item, index) => {
    if (!item[key]?.length) {
      return [{ item, indexes: [index], parents: [item] }];
    }
    const children = getLeafNodes(item[key], key).map((node) => ({
      item: node.item,
      indexes: [index, ...node.indexes],
      parents: [item, ...node.parents],
    }));
    return children;
  });
};

/**
 * Get leaf node of a tree
 *
 * @param array Array of items (with id and parentId)
 * @param indexes Indexes to reach the leaf
 * @param key Key to children array
 * @returns Leaf node
 */
export const getLeafNode = <T, K extends string = "_children">(
  array: Tree<T, K>,
  indexes: number[],
  key: K = "_children" as K,
): { item: T; parents: T[] } | undefined => {
  if (indexes.length === 0) return undefined;
  const item = array[indexes[0]!];
  if (!item) return undefined;
  if (indexes.length === 1) {
    return { item, parents: [] };
  }
  const node = item[key]
    ? getLeafNode(item[key], indexes.slice(1), key)
    : undefined;
  return node
    ? { item: node.item, parents: [...node.parents, item] }
    : undefined;
};

/**
 * Get depth a tree
 *
 * @param array Array of items (with id and parentId)
 * @param key Key to children array
 * @returns Leaf node
 */
export const getDepth = <T, K extends string = "_children">(
  array: Tree<T, K>,
  key: K = "_children" as K,
): number => {
  return Math.max(
    0,
    ...array.map((item) => {
      return item[key] ? getDepth(item[key], key) + 1 : 0;
    }),
  );
};

/**
 * Get if two arrays are equal
 *
 * @param array1 Array of items
 * @param array2 Array of items
 * @returns boolean
 */
export const isEqual = <T>(array1: T[], array2: T[]) => {
  return (
    array1.length === array2.length &&
    array1.every((item, index) => {
      return item === array2[index];
    })
  );
};

/**
 * Get all nodes of a tree
 *
 * @param array Array of items (with id and parentId)
 * @param key Key to children array
 * @returns Array of all nodes
 */
export const getAllNodes = <T, K extends string = "_children">(
  array: Tree<T, K>,
  key: K = "_children" as K,
): {
  item: T;
  parents: T[];
  indexes: number[];
}[] => {
  return array.flatMap((item, index) => {
    if (!item[key]?.length) {
      return [{ item, indexes: [index], parents: [item] }];
    }
    const children = getLeafNodes(item[key], key).map((node) => ({
      item: node.item,
      indexes: [index, ...node.indexes],
      parents: [item, ...node.parents],
    }));
    return [
      {
        item,
        indexes: [index],
        parents: [item],
      },
      ...children,
    ];
  });
};

/**
 * Get flat parent items of a tree
 *
 * @param items List of items
 * @param childrenKey Key to children array
 * @returns
 */
export const getFlatParents = <T, K extends string = "_children">(
  items: TreeNode<T, K>[],
  childrenKey: K = "_children" as K,
): TreeNode<T, K>[] => {
  return items.flatMap((item) => {
    const children = item[childrenKey];
    return children ? [...getFlatParents(children, childrenKey), item] : [];
  });
};

/**
 * Get flat items of a tree
 *
 * @param items List of items
 * @param childrenKey Key to children array
 * @returns
 */
export const getFlatChildren = <T, K extends string = "_children">(
  items: TreeNode<T, K>[],
  childrenKey: K = "_children" as K,
): TreeNode<T, K>[] => {
  return items.flatMap((item) => {
    const children = item[childrenKey];
    return children ? getFlatChildren(children, childrenKey) : [item];
  });
};

/**
 * Get filtered tree by string and array of columns
 *
 * @param items Array of items
 * @param columns List of keys that items should be filtered by
 * @param search Searched string
 * @returns Array of items that are filtered by the searched string
 */
export const getFilteredItems = <T, K extends string = "_children">(
  items: Tree<T, K>,
  filter: (item: T) => boolean,
  childrenKey: K = "_children" as K,
): Tree<T, K> => {
  return items
    .map((item) => {
      if (filter(item)) return item;
      const _children = item[childrenKey];
      if (!_children) return null;
      const children = getFilteredItems(_children, filter, childrenKey);
      if (!children.length) return null;
      return {
        ...item,
        [childrenKey]: children,
      };
    })
    .filter((item): item is TreeNode<T, K> => !!item);
};

/**
 * Make a map of unique groups of values
 *
 * @param array Array of items
 * @param key Key of item to group by
 * @returns Map of groups of values
 */
export const groupBy = <T, K extends keyof T>(array: T[], key: K) => {
  const groups = new Map<T[K], T[]>();
  array.forEach((item) => {
    const items = groups.get(item[key]);
    items ? items.push(item) : groups.set(item[key], [item]);
  });
  return groups;
};

/**
 * Make a map of unique groups of values
 *
 * @param array Array of items
 * @param getKey Getter of key of item to group by
 * @returns Map of groups of values
 */
export const groupByMap = <T, K>(array: T[], getKey: (item: T) => K) => {
  const groups = new Map<K, T[]>();
  array.forEach((item) => {
    const items = groups.get(getKey(item));
    items ? items.push(item) : groups.set(getKey(item), [item]);
  });
  return groups;
};

/**
 * Get sliced array with count of extra items
 * @param array Array of items
 * @param maxLength Maximum length of array
 * @returns sliced array with count of extra items
 */
export const slice = <T>(array: T[], maxLength = 3) => {
  if (array.length <= maxLength) {
    return [array, 0] as const;
  }
  return [array.slice(0, maxLength - 1), array.length - maxLength + 1] as const;
};

/**
 * Get if first array is subset of second array
 * @param first Array of items
 * @param second Array of items
 * @param equals Function that checks if items are the same
 */
export const isSubset = <T>(
  first: T[],
  second: T[],
  equals?: (firstItem: T, secondItem: T) => boolean,
) => {
  return (
    first.length <= second.length &&
    first.every((firstItem) =>
      second.some((secondItem) => {
        return equals
          ? equals(firstItem, secondItem)
          : firstItem === secondItem;
      }),
    )
  );
};
