/**
 * Remove null and undefined value from object
 * @param {*} object
 */
export function cleanObject(obj) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });

  return obj;
}
