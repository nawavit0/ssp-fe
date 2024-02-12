import { replace } from 'lodash';
import { isDemical } from './isDemical';

export const formatPrice = (price = 0, digit = 0, isDiscount = false) => {
  let formatedPrice = price;
  const digitFormat = isDemical(price) ? digit : 0;
  if (!isDiscount) {
    formatedPrice = (+price).toLocaleString('en-US', {
      minimumFractionDigits: digitFormat,
      maximumFractionDigits: digitFormat,
    });
  } else {
    formatedPrice = (+Math.abs(
      replace(price, /[^0-9.-]+/g, ''),
    )).toLocaleString('en-US', {
      minimumFractionDigits: digitFormat,
      maximumFractionDigits: digitFormat,
    });
  }
  return formatedPrice;
};
