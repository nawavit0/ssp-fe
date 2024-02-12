import { checkDate } from './date';

export const calPercentDiscount = product => {
  if (!product.special_price || product.price <= 0) {
    return null;
  }
  const percentDiscount =
    product.special_price &&
    checkDate(product.special_from_date, product.special_to_date) &&
    Math.floor(((product.price - product.special_price) / product.price) * 100);

  return percentDiscount <= 0 ? null : percentDiscount;
};
