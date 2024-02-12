import { get as prop, map } from 'lodash';
import btoa from 'btoa';
import atob from 'atob';
import moment from 'moment';

import queryString from 'query-string';
export const checkProductInStock = product => {
  const isInStock = prop(
    product,
    'extension_attributes.stock_item.is_in_stock',
  );
  const qty = prop(product, 'extension_attributes.stock_item.qty');

  return isInStock && qty > 0;
};

export const encodeBase64 = value => {
  return value && btoa(value);
};

export const decodeBase64 = value => {
  try {
    return value && atob(value);
  } catch (e) {
    return value;
  }
};

export const findActiveProduct = (product, activeProduct) => {
  let tempProduct = activeProduct;
  if (activeProduct) {
    const childPrice = prop(product, 'price', null);
    let childSpecialPrice = prop(product, 'special_price_option')
      ? prop(product, 'special_price_option')
      : prop(product, 'special_price', childPrice); // for graphQl
    if (childSpecialPrice === null) childSpecialPrice = childPrice;

    const activePrice = prop(activeProduct, 'price', null);
    let activeSpecialPrice = prop(activeProduct, 'special_price_option')
      ? prop(activeProduct, 'special_price_option')
      : prop(activeProduct, 'special_price', activePrice); // for graphQl
    if (activeSpecialPrice === null) activeSpecialPrice = activePrice;

    const activeDiscount =
      activeSpecialPrice && activePrice !== activeSpecialPrice
        ? activePrice - activeSpecialPrice
        : 0;

    const childDiscount =
      childSpecialPrice && childPrice !== childSpecialPrice
        ? childPrice - childSpecialPrice
        : 0;

    const childHasMoreDiscount =
      activeDiscount && childDiscount ? childDiscount > activeDiscount : false;
    const childHasLowerPrice = childSpecialPrice < activeSpecialPrice;
    if ((childHasMoreDiscount && childHasLowerPrice) || childHasLowerPrice) {
      tempProduct = product;
    }
  } else {
    tempProduct = product;
  }

  return tempProduct;
};

export const transformFlashDealProducts = product => {
  const dateTimeNow = moment();
  const { flash_deal_from, flash_deal_to } = product;
  const flashDeal = prop(product, 'flash_deal_enable');
  const flashDealValue = flashDeal
    ? flashDeal
    : prop(product, 'flash_deal', '0');
  const isFlashDealEnable = parseInt(flashDealValue) === 1;
  if (isFlashDealEnable && flash_deal_from && flash_deal_to) {
    const result =
      isFlashDealEnable &&
      moment(flash_deal_from)
        .add(25200000, 'ms')
        .valueOf() <= dateTimeNow &&
      moment(flash_deal_to)
        .add(25200000, 'ms')
        .valueOf() >= dateTimeNow;

    return result;
  }
  return false;
};

export const generateProductUrl = (
  product,
  activeOption,
  { isConfigurable, stockQTY },
) => {
  const urlKey = product.url_key;
  const searchParams = {};
  map(activeOption, (opt, indexOtp) => {
    const key = encodeBase64(`${indexOtp},cds`);
    const value = opt;
    searchParams[key] = value;
  });
  const queryParameter = queryString.stringify(searchParams, {
    sort: false,
  });
  const productLinkDetail =
    isConfigurable && activeOption && urlKey && stockQTY > 0
      ? `${urlKey}?${queryParameter}`
      : `${urlKey || '#'}`;
  return productLinkDetail;
};
