type DictionaryDiff<T> = {
  [K in keyof T]: {
    prop: K;
    oldValue: T[K];
    newValue: T[K];
  };
}[keyof T];

interface ArrayDiff<R extends string, T extends Record<R, string>> {
  removed: { ref: string; value: T }[];
  added: { ref: string; index: number; value: T }[];
  updated: { ref: string; index: number; value: T; updates: DictionaryDiff<T>[] }[];
}

export const diffArrayOfObject = <R extends string, T extends Record<R, string>>(
  refercence: R,
  oldValue: T[],
  newValue: T[]
): ArrayDiff<R, T> => {
  const oldMap = new Map(oldValue.map((item) => [item[refercence], item]));
  const newMap = new Map(newValue.map((item) => [item[refercence], item]));

  const removed: { ref: string; value: T }[] = [];
  const added: { ref: string; index: number; value: T }[] = [];
  const updated: { ref: string; index: number; value: T; updates: DictionaryDiff<T>[] }[] = [];

  for (const [id, oldValue] of oldMap.entries()) {
    if (!newMap.has(id)) {
      removed.push({ ref: id, value: oldValue });
    }
  }

  newValue.forEach((newItem, index) => {
    const oldItem = oldMap.get(newItem[refercence]);
    if (!oldItem) {
      added.push({ ref: newItem[refercence], index, value: newItem });
      return;
    }

    const updates: DictionaryDiff<T>[] = [];
    for (const key in newItem) {
      if (key !== 'id' && oldItem[key] !== newItem[key]) {
        updates.push({
          prop: key as keyof T,
          oldValue: oldItem[key],
          newValue: newItem[key],
        });
      }
    }
    if (updates.length > 0) {
      updated.push({ ref: newItem[refercence], value: newItem, updates, index });
    }
  });

  return { removed, added, updated };
};
