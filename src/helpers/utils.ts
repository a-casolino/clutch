/**
 * Check if a value is defined, not null, and not undefined
 */
export const isDefined = (value: unknown) =>
  value !== undefined && value !== null;

/**
 * Check if a value is not defined, null, or undefined
 */
export const isNotDefined = (value: unknown) => !isDefined(value);

/**
 * Compares two values to see if they are equal
 */
export const isEqual = (a: unknown, b: unknown) => a === b;

/**
 * Compares two values to see if they are not equal
 */
export const isNotEqual = (a: unknown, b: unknown) => !isEqual(a, b);

/**
 * Check if a value is truthy
 */
export const isTruthy = (value: unknown) => Boolean(value);

/**
 * Check if a value is falsy
 */
export const isFalsy = (value: unknown) => !isTruthy(value);

/**
 * Negates a value
 */
export const negate = (value: unknown) => !value;

/**
 * Ors two values
 */
export const or = (a: unknown, b: unknown) => a || b;

/**
 * Ands two values
 */
export const and = (a: unknown, b: unknown) => a && b;
