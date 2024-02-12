import React from 'react';
import { withStoreConfig, withLocales } from '@central-tech/core-ui';
import { sendGTMProductRemoveFromCartConfigurable } from '../../utils/gtm';
import propTypes from 'prop-types';
import { useCartDetail } from '../../routes/cart/useCartDetail';
import {
  useEditCartItem,
  useDeleteCartItem,
  useChangeSizeItem,
} from '../../routes/cart/useCart';
import MiniCart from './MiniCart';
import MiniCartSkeleton from './components/MiniCartSkeleton';

const MiniCartContainer = (props, { customer }) => {
  const { translate, activeConfig } = props;
  const isGuest = !(customer?.id || false);
  const data = useCartDetail(customer);
  const editCartItem = useEditCartItem();
  const changeSizeItem = useChangeSizeItem();
  const deleteCartItem = useDeleteCartItem();
  const { cart = {}, loading } = data;
  if (loading) return <MiniCartSkeleton />;
  const isEmptyCart = !cart?.items_qty || parseInt(cart?.items_qty) <= 0;
  const cartId = isGuest ? cart?.guest_id || '' : cart?.id || 0;
  const baseGrandTotal = cart?.totals?.base_grand_total || 0;
  const subTotalInclTax = cart?.totals?.subtotal_incl_tax || 0;
  const shippingAmount =
    (cart?.totals?.shipping_incl_tax || 0) === 0
      ? translate(`free`)
      : `฿${cart?.totals?.shipping_incl_tax || 0}`;
  const discountAmount = Math.abs(cart?.totals?.discount_amount || 0);
  const cartItems = cart?.items || [];
  const rootImageUrl = `${activeConfig?.base_media_url || ''}catalog/product`;
  const updateProductQtyHandler = async (productId, qty) => {
    await editCartItem({
      input: { qty: qty, quote_id: cartId },
      itemId: productId,
      cartId: cartId,
      isGuest,
    });
  };
  const deleteCartItemHandler = async (productId, product, qty, parentSku) => {
    await deleteCartItem({ guest: isGuest ? cartId : null, itemId: productId });
    sendGTMProductRemoveFromCartConfigurable({
      childProduct: product,
      parentSku,
      qty,
    });
  };
  const changeSizeItemHandler = async (
    qty,
    parentSku,
    optionId,
    optionValue,
    currentProductId,
  ) => {
    await changeSizeItem(
      isGuest,
      cartId,
      qty,
      parentSku,
      optionId,
      optionValue,
      currentProductId,
    );
  };

  return (
    <MiniCart
      translate={translate}
      isGuest={isGuest}
      cartItems={cartItems}
      isEmptyCart={isEmptyCart}
      rootImageUrl={rootImageUrl}
      baseGrandTotal={baseGrandTotal}
      subTotalInclTax={subTotalInclTax}
      shippingAmount={shippingAmount}
      discountAmount={discountAmount}
      deleteCartItemHandler={deleteCartItemHandler}
      updateProductQtyHandler={updateProductQtyHandler}
      changeSizeItemHandler={changeSizeItemHandler}
    />
  );
};

MiniCartContainer.contextTypes = {
  customer: propTypes.object,
};

export default withLocales(withStoreConfig(MiniCartContainer));
