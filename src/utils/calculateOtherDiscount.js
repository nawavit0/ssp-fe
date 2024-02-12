import { sumBy, replace } from 'lodash';

const calculateOtherDiscount = (discount, coupons, the1Redeem, creditOnTop) => {
  if (discount && discount !== 0) {
    let sumCouponsDiscount = null;
    if (coupons && coupons.length > 0) {
      sumCouponsDiscount = sumBy(coupons, val => {
        const couponDiscount = val.coupon_amount_base
          ? val.coupon_amount_base
          : val.discount_amount;
        return parseFloat(couponDiscount);
      });
    }

    let redeemAmount = 0;
    if (the1Redeem) {
      redeemAmount = parseFloat(the1Redeem);
    }

    if (creditOnTop) {
      let tempCreditOnTop = creditOnTop;
      if (typeof creditOnTop === 'string') {
        tempCreditOnTop = parseFloat(
          replace(creditOnTop, new RegExp('-\u0e3f|,|-฿', 'mg'), ''),
        );
      }
      redeemAmount += tempCreditOnTop;
    }

    let otherDiscount = discount;
    if (sumCouponsDiscount > 0) {
      otherDiscount = sumCouponsDiscount + otherDiscount;
    }

    if (redeemAmount > 0) {
      otherDiscount = redeemAmount + otherDiscount;
    }

    return parseFloat(otherDiscount.toFixed(2));
  }

  return 0;
};

export default calculateOtherDiscount;
