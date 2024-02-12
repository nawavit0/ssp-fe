const useChangeSizeItem = (addCartItem, deleteCartItem, isGuest, cartId) => {
  return async (
    qty = 0,
    parentSku = '',
    optionId = '',
    optionValue = 0,
    currentProductId = '',
  ) => {
    if (isGuest) {
      await addCartItem.mutation({
        variables: {
          input: {
            quote_id: cartId,
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
          isGuest: true,
          cartId: cartId,
        },
      });
      await deleteCartItem.mutation({
        variables: {
          item_id: currentProductId,
          guest: cartId,
        },
      });
    } else {
      const userCartId = localStorage.getItem('user_cart_id');
      await addCartItem.mutation({
        variables: {
          cartId: userCartId,
          input: {
            quote_id: userCartId,
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
        },
      });
    }
  };
};

export default useChangeSizeItem;
