export function enumFromKeyStringOrThrow<T extends Record<string, string | number>>(
  enumObject: T,
  key: string
): T[keyof T] {
  if (!(key in enumObject)) {
    throw new Error(`Invalid enum key: "${key}"`);
  }
  return enumObject[key as keyof T];
}
