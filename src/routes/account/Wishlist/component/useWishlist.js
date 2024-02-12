import { useAddCartItemMutation } from '@central-tech/react-hooks';

export default function UseAddToCart() {
  const [addCartItem] = useAddCartItemMutation();
  return {
    addCartItem: (
      qty,
      sku,
      isGuest,
      isConfigurable,
      configurableItemOptions,
    ) => {
      const cartId = isGuest
        ? localStorage.getItem('guest_cart_id')
        : localStorage.getItem('user_cart_id');
      const product_option = !isConfigurable
        ? null
        : {
            extension_attributes: {
              configurable_item_options: {
                ...configurableItemOptions,
              },
            },
          };
      return addCartItem({
        refetchQueries: ['cart', 'cartMini'],
        variables: {
          input: {
            quote_id: cartId,
            qty: 1,
            sku: sku,
            product_option,
          },
          isGuest,
          cartId: cartId,
        },
      });
    },
  };
}
