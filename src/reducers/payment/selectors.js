import { get, find, map, isEmpty, head } from 'lodash';

export const getTotalSegment = (state, code) => {
  const segments = get(state, 'payment.payment.totals.total_segments', []);
  return find(segments, s => s.code === code) || {};
};

export const getShippingSegment = state => getTotalSegment(state, 'shipping');

export const getSubTotal = state => {
  const subTotal = getTotalSegment(state, 'subtotal');
  return get(subTotal, 'value', 0);
};

export const getGrandTotal = state => {
  const grandTotal = getTotalSegment(state, 'grand_total');
  return get(grandTotal, 'value', 0);
};

export const getDiscount = state => {
  const discount = getTotalSegment(state, 'discount');
  return get(discount, 'value', 0);
};

export const getCoupon = state => {
  const couponObj = getTotalSegment(state, 'amasty_coupon_amount');
  const coupons = [];
  map(couponObj.value, list => {
    const couponJson = JSON.parse(list);
    coupons.push(couponJson);
  });
  return coupons;
};

export const getT1Redeem = state => {
  const redeemObj = getTotalSegment(state, 't1c');
  const redeemT1 = [];
  if (!isEmpty(redeemObj)) {
    map(redeemObj.value, list => {
      const redeemJson = JSON.parse(list);
      redeemT1.push(redeemJson);
    });
  }

  return head(redeemT1);
};

export const getCreditCartOnTop = state => {
  const onTopObj = getTotalSegment(state, 'credit_card_on_top');
  const onTop = [];
  if (!isEmpty(onTopObj)) {
    map(onTopObj.value, list => {
      const onTopJson = JSON.parse(list);
      onTop.push(onTopJson);
    });
  }

  return head(onTop);
};

export const getGiftwrapping = state => {
  const giftWrapping = getTotalSegment(state, 'giftwrapping');

  return giftWrapping.extension_attributes;
};

export const getSelectPaymentSelector = state => {
  return !isEmpty(get(state, 'payment.paymentMethod', null));
};
