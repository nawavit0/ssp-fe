import { useCart } from '@central-tech/core-ui';
import { get } from 'lodash';
import { sendGTMProductAddToCartConfigurable } from '../../../../utils/gtm';

const useAddToCart = () => {
  const { addCartItem } = useCart();
  return ({
    addToCartActiveFlag,
    isGuest,
    qty,
    setQty,
    setSelectedSize,
    sku,
    isConfigurable,
    activeProduct,
    selectedSize,
    setAddToCartStatus,
    setShowInsufficientStockFlag,
    setShowSizeSelectionModalFlag,
    translate,
  }) => {
    const addToCartAction = async () => {
      if (!addToCartActiveFlag) {
        return false;
      }
      if (isConfigurable) {
        const activeAttrId = get(activeProduct, 'current_option.attr_id', '');
        const activeAttrValue = get(
          activeProduct,
          'current_option.attr_value',
          0,
        );
        if (isGuest) {
          const guestCartId = localStorage.getItem('guest_cart_id');
          try {
            await addCartItem.mutation({
              variables: {
                input: {
                  quote_id: guestCartId,
                  qty: qty,
                  sku: sku,
                  product_option: {
                    extension_attributes: {
                      configurable_item_options: {
                        option_id: activeAttrId,
                        option_value: activeAttrValue,
                      },
                    },
                  },
                },
                isGuest: true,
                cartId: guestCartId,
              },
            });
          } catch {
            setShowInsufficientStockFlag(true);
            return false;
          }
          setQty(1);
          setSelectedSize('');
          return true;
        }
        const userCartId = localStorage.getItem('user_cart_id');
        try {
          await addCartItem.mutation({
            variables: {
              cartId: userCartId,
              input: {
                quote_id: userCartId,
                qty: qty,
                sku: sku,
                product_option: {
                  extension_attributes: {
                    configurable_item_options: {
                      option_id: activeAttrId,
                      option_value: activeAttrValue,
                    },
                  },
                },
              },
            },
          });
        } catch {
          setShowInsufficientStockFlag(true);
          return false;
        }
        setQty(1);
        setSelectedSize('');
        return true;
      }
      if (isGuest) {
        const guestCartId = localStorage.getItem('guest_cart_id');
        try {
          await addCartItem.mutation({
            variables: {
              input: {
                quote_id: guestCartId,
                qty: qty,
                sku: sku,
              },
              isGuest: true,
              cartId: guestCartId,
            },
          });
        } catch {
          setShowInsufficientStockFlag(true);
          return false;
        }
        setQty(1);
        return true;
      }
      const userCartId = localStorage.getItem('user_cart_id');
      try {
        await addCartItem.mutation({
          variables: {
            cartId: userCartId,
            input: {
              quote_id: userCartId,
              qty: qty,
              sku: sku,
            },
          },
        });
      } catch {
        setShowInsufficientStockFlag(true);
        return false;
      }
      setQty(1);
      return true;
    };

    return async () => {
      try {
        if (selectedSize || !isConfigurable) {
          setAddToCartStatus(translate('product_detail.adding_to_cart'));
          const isAddToCardSuccess = await addToCartAction();
          if (isAddToCardSuccess) {
            setAddToCartStatus(translate('product_detail.added_to_cart'));
            sendGTMProductAddToCartConfigurable({
              childProduct: activeProduct,
              parentSku: sku,
              qty,
            });
            setShowSizeSelectionModalFlag(false);
            setTimeout(() => {
              setAddToCartStatus('');
            }, 3000);
          } else {
            setAddToCartStatus('');
          }
        } else {
          setShowSizeSelectionModalFlag(true);
        }
      } catch {
        setAddToCartStatus('');
      }
    };
  };
};

export default useAddToCart;
