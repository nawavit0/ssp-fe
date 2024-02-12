import React from 'react';
import { useCartDetail } from './useCartDetail';
import CartContainer from './CartContainer';
import { useGiftWrap } from './useGiftWrap';
import {
  useAddCoupon,
  useDeleteCoupon,
  useChangeSizeItem,
  useEditCartItem,
  useDeleteCartItem,
} from './useCart';

const CartFetch = ({ customer, isMobile }) => {
  const data = useCartDetail(customer);
  const cart = data?.cart || {};
  const userCartId = cart?.id || 0;
  const cartFreeItems = cart?.extension_attributes?.free_items || [];
  const totalItemQuantity = cart?.items_qty || 0;
  const cartItems = cart?.items || [];
  const shippingCost = cart?.totals?.shipping_incl_tax || 0;
  const discountAmount = Math.abs(cart?.totals?.discount_amount || 0);
  const baseGrandTotal = cart?.totals?.base_grand_total || 0;
  const subTotalInclTax = cart?.totals?.subtotal_incl_tax || 0;
  const earnTheOnePoint =
    cart?.totals?.extension_attributes?.t1c_earn_points_estimate || 0;
  const totalSegments = cart?.totals?.total_segments || [];
  const appliedCoupons = [];
  const giftWrapFlag = cart?.has_gift_wrap || false;
  let giftWrap = 0;
  totalSegments.map(item => {
    if (item?.code === 'amasty_coupon_amount') {
      const amnestyCoupons = item?.value || [];
      amnestyCoupons.map(coupon => {
        appliedCoupons.push(JSON.parse(coupon || {})?.coupon_code || '');
      });
    }
    if (item?.code === 'giftwrapping') {
      giftWrap = item?.value || 0;
    }
  });
  const addCoupon = useAddCoupon();
  const addCouponMutation = addCoupon.mutation;
  const addCouponResult = addCoupon?.result?.data?.addCoupon || {};
  const deleteCoupon = useDeleteCoupon();
  const changeSizeItem = useChangeSizeItem();
  const {
    add: addGiftWrapMessage,
    delete: deleteGiftWrapMessage,
  } = useGiftWrap(customer);

  const editCartItem = useEditCartItem();
  const deleteCartItem = useDeleteCartItem();
  return (
    <CartContainer
      isMobile={isMobile}
      userCartId={userCartId}
      totalItemQuantity={totalItemQuantity}
      cartItems={cartItems}
      cartFreeItems={cartFreeItems}
      shippingCost={shippingCost}
      discountAmount={discountAmount}
      baseGrandTotal={baseGrandTotal}
      subTotalInclTax={subTotalInclTax}
      earnTheOnePoint={earnTheOnePoint}
      appliedCoupons={appliedCoupons}
      addCoupon={addCoupon}
      addCouponMutation={addCouponMutation}
      addCouponResult={addCouponResult}
      deleteCoupon={deleteCoupon}
      addGiftWrapMessage={addGiftWrapMessage}
      deleteGiftWrapMessage={deleteGiftWrapMessage}
      editCartItem={editCartItem}
      deleteCartItem={deleteCartItem}
      changeSizeItem={changeSizeItem}
      giftWrap={giftWrap}
      giftWrapFlag={giftWrapFlag}
    />
  );
};

export default CartFetch;
