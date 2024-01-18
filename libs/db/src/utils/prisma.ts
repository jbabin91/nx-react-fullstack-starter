type BooleanObject<T> = {
  [K in keyof T]?: boolean;
};

export const excludeFields = <const T>(
  fields: T,
  excludes: (keyof T)[],
): BooleanObject<T> => {
  const keys = Object.keys(fields!).filter(
    (key) => !excludes.includes(key as keyof T),
  ) as (keyof T)[];
  const object: BooleanObject<T> = {};
  for (const key of keys) {
    object[key] = true;
  }
  return object;
};
