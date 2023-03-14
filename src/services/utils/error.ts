export const isError = (v: unknown): v is Error => {
  return v instanceof Error;
};
