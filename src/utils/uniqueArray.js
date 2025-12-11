const uniqueArray = (array) => {
  const result = [];
  const map = new Map();
  // eslint-disable-next-line no-restricted-syntax
  for (const item of array) {
    if (!map.has(item.status)) {
      map.set(item.status, item.status); // set any value to Map
      result.push(item);
    }
  }
  return result;
};

export default uniqueArray;
