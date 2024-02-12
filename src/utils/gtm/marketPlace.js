import { get as prop, isUndefined, isNull } from 'lodash';

export const marketPlaceType = product => {
  if (
    !isNull(prop(product, 'marketplace_product_type_option')) &&
    !isUndefined(prop(product, 'marketplace_product_type_option'))
  ) {
    return prop(product, 'marketplace_product_type_option');
  }
  return 'Retail';
};

export const marketPlaceName = product => {
  if (
    !isNull(prop(product, 'marketplace_seller_option')) &&
    !isUndefined(prop(product, 'marketplace_seller_option'))
  ) {
    return prop(product, 'marketplace_seller_option');
  }
  return 'Central';
};
