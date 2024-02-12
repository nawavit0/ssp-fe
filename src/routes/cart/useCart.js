import { useCart } from '@central-tech/core-ui';
import {
  useAddCartItemMutation,
  useDeleteCartItemMutation,
} from '@central-tech/react-hooks';

export function useAddCoupon() {
  const { addCoupon } = useCart();
  return {
    mutation: async ({
      cartId = '',
      isGuest = true,
      promotionCode = '',
    } = {}) => {
      await addCoupon.mutation({
        variables: {
          cartId: cartId,
          isGuest: isGuest,
          coupon: promotionCode,
        },
      });
    },
    result: addCoupon.result,
  };
}

export function useDeleteCartItem() {
  const { deleteCartItem } = useCart();
  return async ({ itemId = '', guest = '' } = {}) => {
    await deleteCartItem.mutation({
      variables: {
        item_id: itemId,
        guest: guest,
      },
    });
  };
}

export function useDeleteCoupon() {
  const { deleteCoupon } = useCart();
  return async ({ cartId = '', isGuest = true } = {}) => {
    await deleteCoupon.mutation({
      variables: {
        cartId: cartId,
        isGuest: isGuest,
      },
    });
  };
}

export function useEditCartItem() {
  const { editCartItem } = useCart();
  return async ({
    input = { qty: 0, quote_id: '' },
    itemId = '',
    cartId = '',
    isGuest = true,
  } = {}) => {
    await editCartItem.mutation({
      variables: {
        id: cartId,
        isGuest: isGuest,
        item_id: itemId,
        input: input,
      },
    });
  };
}

export function useChangeSizeItem() {
  const [addCartItem] = useAddCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation({
    refetchQueries: [`cart`, 'cartMini'],
  });

  return async (
    isGuest,
    cartId,
    qty = 0,
    parentSku = '',
    optionId = '',
    optionValue = 0,
    currentProductId = '',
  ) => {
    const addCartItemCartId = isGuest
      ? cartId
      : localStorage.getItem('user_cart_id');
    const deleteCartItemCartId = isGuest ? addCartItemCartId : null;
    await addCartItem({
      variables: {
        input: {
          quote_id: addCartItemCartId,
          qty: qty,
          sku: parentSku,
          product_option: {
            extension_attributes: {
              configurable_item_options: {
                option_id: optionId,
                option_value: optionValue,
              },
            },
          },
        },
        isGuest: isGuest,
        cartId: addCartItemCartId,
      },
    });
    await deleteCartItem({
      variables: {
        item_id: currentProductId,
        guest: deleteCartItemCartId,
      },
    });
  };
}

export default useChangeSizeItem;
