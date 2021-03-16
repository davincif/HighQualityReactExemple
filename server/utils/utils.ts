/**
 * Remove all duplicated entries from a Array
 * @param vect Vector to be converted.
 * @return A new vector with unique entries.
 */
export const removeDuplicated = (vect: any[]): any[] => {
  const set = new Set(vect);

  return [...set];
};

/**
 * Check weather the arrays are equal or not.
 * @param a Array A.
 * @param b Array B.
 * @param sort If you don't care about the order of the elements inside, turn this on. Default: false.
 */
export const arraysEqual = (a: any[], b: any[], sort = false) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // sort if needed
  if (sort) {
    a.sort();
    b.sort();
  }

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
};

/**
 * Check if the arrays are identical transforming then to strings and comparing.
 * @WARNING arrays must not contain {objects} or behavior may be undefined.
 * @param a Array A.
 * @param b Array B.
 */
export const arraysStrictlyEqual = (a: any[], b: any[]) => {
  return JSON.stringify(a) == JSON.stringify(a);
};

/**
 * Remove the first occurrence of 'value' in 'arr'.
 * @param arr Array to be remove from.
 * @param value to be removed, value or index must be present.
 * @param index index to be removed, if index is present, value is ignored.
 * @returns A new array with the 'value' removed
 */
export const removeItemOnce = (
  arr: any[],
  { value, index }: { value?: any; index?: string | number }
) => {
  if (!index) {
    index = arr.indexOf(value);
  }

  if (index > -1) {
    arr.splice(Number(index), 1);
  }

  return arr;
};

/**
 * Remove all occurrencies of 'value' in 'arr'.
 * @param arr Array to be remove from.
 * @param value to be removed.
 * @returns A new array with the 'value' removed
 */
export const removeItemAll = (arr: any[], value: any) => {
  let i = 0;

  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }

  return arr;
};
