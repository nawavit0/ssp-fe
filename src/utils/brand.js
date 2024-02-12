import { groupBy, indexOf, keys, sortBy } from 'lodash';
export const isFullBoutique = parentCate => {
  const defaultCategory = [2, 260];
  return parentCate > 0 && indexOf(defaultCategory, parentCate) === -1;
};
export const isStandardBoutique = parentCate => {
  const defaultCategory = [2, 260];
  return parentCate > 0 && indexOf(defaultCategory, parentCate) !== -1;
};
export const transformBrandGroupByAlphabetic = brands => {
  if (brands) {
    const groupedBrands = groupBy(
      sortBy(brands, [brand => brand.name.toLowerCase()]),
      brand => brand.name.toUpperCase().substr(0, 1),
    );
    const groupedBrandsKeys = keys(groupedBrands);

    return {
      groups: groupedBrands,
      characters: groupedBrandsKeys,
    };
  }

  return brands;
};
