import { get, isUndefined } from 'lodash';

export const filterRetailProduct = product =>
  isUndefined(get(product, 'marketplace_product_type'));

export const findGiftWrappingInSegment = segment =>
  get(segment, 'code') === 'giftwrapping';

export const findProductAllowGiftWrapping = product =>
  get(product, 'allow_gift_wrapping') === '1';
