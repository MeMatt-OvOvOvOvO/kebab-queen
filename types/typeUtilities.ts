export type ObjectValues<T> = T[keyof T];

export type PropertiesToNumeric<T> = {
  [K in keyof T]: number | null;
};
