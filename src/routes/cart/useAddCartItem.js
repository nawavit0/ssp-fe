const useAddCartItemHandler = (isGuest, addCartItem) => {
  return async (qty = 0, parentSku = '', optionId = '', optionValue = 0) => {
    if (isGuest) {
      const guestCartId = localStorage.getItem('guest_cart_id');
      await addCartItem.mutation({
        variables: {
          input: {
            quote_id: guestCartId,
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
          cartId: guestCartId,
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

export default useAddCartItemHandler;
