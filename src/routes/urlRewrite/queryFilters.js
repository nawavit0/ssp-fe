import { get as prop, setWith } from 'lodash';

const QueryFilter = queryParams => {
  const newQueryParams = {};
  const limit = prop(queryParams, 'limit', '24');
  if (limit !== null && limit !== '') setWith(newQueryParams, 'limit', limit);
  const sort = prop(queryParams, 'sort', 'recommended,desc');
  if (sort !== null && sort !== '') setWith(newQueryParams, 'sort', sort);
  const priceRange = prop(queryParams, 'price_range', null);
  if (priceRange !== null && priceRange !== '')
    setWith(newQueryParams, 'price_range', priceRange);
  const categoryId = prop(queryParams, 'category_id', null);
  if (categoryId !== null && categoryId !== '')
    setWith(newQueryParams, 'category_id', categoryId);
  const brandName = prop(queryParams, 'brand_name', null);
  if (brandName !== null && brandName !== '')
    setWith(newQueryParams, 'brand_name', brandName);
  const color = prop(queryParams, 'color', null);
  if (color !== null && color !== '') setWith(newQueryParams, 'color', color);
  const size = prop(queryParams, 'size', null);
  if (size !== null && size !== '') setWith(newQueryParams, 'size', size);
  const isSale = prop(queryParams, 'is_sale', null);
  if (isSale !== null && isSale !== '')
    setWith(newQueryParams, 'is_sale', isSale);
  const isNew = prop(queryParams, 'is_new', null);
  if (isNew !== null && isNew !== '') setWith(newQueryParams, 'is_new', isNew);
  const isFlashSale = prop(queryParams, 'is_flash_sale', null);
  if (isFlashSale !== null && isFlashSale !== '')
    setWith(newQueryParams, 'is_flash_sale', isFlashSale);
  return newQueryParams;
};

export default QueryFilter;
