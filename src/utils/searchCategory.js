/**
 * Convert Active Filter
 * @param {Array} activeFilters
 * @return {Array}
 */
export const convertActiveFilters = activeFilters => {
  const arrFilter = [];
  let n = 0;
  activeFilters.forEach(item => {
    const splitData = item.value.toString().split(',');
    splitData.forEach(item2 => {
      n += 1;
      arrFilter.push({ ...item, id: n, value: item2 });
    });
  });
  return arrFilter;
};

/**
 * Remove Empty Object
 * @param {Object} obj
 * @return {Object}
 */
export const removeEmptyObject = obj => {
  const emptyFilter = {};
  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      emptyFilter[key] = obj[key];
    }
  });
  return emptyFilter;
};
