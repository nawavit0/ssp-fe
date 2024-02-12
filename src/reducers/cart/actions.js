import { find, filter, merge, map, get as prop, omit } from 'lodash';
import types from './types';
import service from '../../ApiService';
import { fetchPayment } from '../payment/actions';
import { showMiniCart, hideMiniCart } from '../layout/actions';
// import { googleTagDataLayer } from '../../reducers/googleTag/actions';

export const fetchCart = () => async (dispatch, getState) => {
  dispatch(startCartLoading());

  try {
    const timeStamp = new Date().getTime();
    const result = await service.get(`/cart?date=${timeStamp}`);
    await dispatch(fetchPayment());
    const { cart } = result;

    const { payment } = getState().payment;
    const omitPaymentProductName = {
      ...payment,
      totals: {
        ...payment.totals,
        items: map(payment.totals.items, item => omit(item, ['name'])),
      },
    };

    merge(cart, omitPaymentProductName.totals);

    await dispatch(fetchCartCompleted(cart));
  } catch (error) {
    await dispatch(finishCartLoading());
  }
};

export const fetchCartPayment = () => async (dispatch, getState) => {
  dispatch(startCartLoading());
  await dispatch(fetchPayment());

  const { cart } = getState().cart;
  const { payment } = getState().payment;
  const omitPaymentProductName = {
    ...payment,
    totals: {
      ...payment.totals,
      items: map(payment.totals.items, item => omit(item, ['name'])),
    },
  };

  merge(cart, omitPaymentProductName.totals);

  await dispatch(fetchCartCompleted(cart));
};

export const addToCart = (
  product,
  options,
  productOptions,
  // isEnableGraphql,
) => async (dispatch, getState) => {
  const {
    cart: { itemLoading },
  } = getState();

  if (itemLoading) {
    return;
  }

  dispatch(startCartItemLoading(product.sku));

  try {
    const cartId = prop(getState(), 'cart.cart.id');
    const { cartItem } = await service.post('/cart/addToCart', {
      sku: product.sku,
      qty: product.qty,
      cartId,
      options,
      productOptions,
    });

    dispatch(finishCartItemLoading());

    dispatch(showMiniCart());
    await dispatch(fetchCart());
    setTimeout(() => dispatch(hideMiniCart()), 4000);

    // dispatch(
    //   googleTagDataLayer(
    //     gtmType.EVENT_TRACK_ADD_TO_CART,
    //     product,
    //     null,
    //     null,
    //     isEnableGraphql,
    //   ),
    // );
    return cartItem;
  } catch (error) {
    console.warn('addToCart', error);
    dispatch(finishCartLoading(error));
    return null;
  }
};

export const addToCartFromReorder = order => async dispatch => {
  for (const item of order.items) {
    await dispatch(addToCart(itemToProduct(item), null, item.product_option));
  }

  dispatch(finishReorder());
};

export const changeItemQty = (sku, qty) => async (dispatch, getState) => {
  const cartStore = getState().cart;
  const item = find(cartStore.cart.items, i => i.sku === sku);
  const stockQty = prop(item, 'extension_attributes.stock_item.qty');
  const maxSaleQty = prop(item, 'extension_attributes.stock_item.max_sale_qty');
  const newItemQty = qty;

  const { item_id: itemId } = item;
  const { id: cartId } = cartStore.cart;

  if (cartStore.itemLoading) {
    return;
  }

  dispatch(startCartItemLoading());

  try {
    if (newItemQty <= stockQty) {
      if (newItemQty <= maxSaleQty) {
        await service.put('/cart/changeItemQty', {
          itemId,
          qty,
          cartId,
        });
      }
    }

    dispatch(finishCartItemLoading());
    await dispatch(fetchCart());
  } catch (error) {
    await dispatch(fetchCartPayment());
    dispatch(finishCartLoading());
    dispatch(finishCartItemLoading());
    throw error;
  }
};

export const deleteItem = itemId => async (dispatch, getState) => {
  try {
    if (getState().cart.itemLoading) {
      return;
    }

    dispatch(startCartItemLoading());
    await service.delete('/cart/deleteItem', { itemId });
    // dispatch(googleTagDataLayer(gtmType.EVENT_TRACK_REMOVE_FROM_CART, itemId));
    dispatch(finishCartItemLoading());
    dispatch(fetchCart());
  } catch (error) {
    dispatch(finishCartItemLoading());
    dispatch(finishCartLoading());
  }
};

export const mergeGuestCartToCustomer = merge => async () => {
  try {
    const response = await service.post('/cart/guest-transfer', {
      merge: merge,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putCoupon = coupon => async (dispatch, getState) => {
  dispatch(startPutLoading());

  try {
    await dispatch(fetchCartPayment());
    const { totals } = getState().payment.payment;
    coupon = coupon.toLowerCase();

    const couponObj = find(prop(totals, 'total_segments'), segment => {
      return segment.code === 'amasty_coupon_amount';
    });

    const couponsCode = [];
    map(couponObj.value, list => {
      const couponJson = JSON.parse(list);
      couponsCode.push(couponJson);
    });

    const checkUseCoupon = false;
    if (couponsCode.length > 0) {
      return dispatch(applyCouponError('check_coupon'));
      // checkUseCoupon = find(couponsCode, value => {
      //   return value.coupon_code.toLowerCase() === coupon;
      // });
    }

    let coupons = '';
    if (!checkUseCoupon) {
      if (couponsCode.length > 0) {
        couponsCode.map(val => {
          coupons += `${val.coupon_code.toLowerCase()}%2C`;
        });
        coupons = coupons + coupon;
      } else {
        coupons = coupon;
      }
    } else {
      return dispatch(applyCouponError('is_used'));
    }

    const { status } = await service.put('/cart/putCoupon', {
      coupons,
    });

    if (status === 'error') {
      return dispatch(applyCouponError('not_apply_it'));
    }

    dispatch(finishPutLoading());

    await dispatch(fetchCart());
    await dispatch(fetchCartPayment());

    const { payment } = getState().payment;
    const isLockCredit = prop(
      payment,
      'extension_attributes.is_payment_promotion_locked',
    );

    if (isLockCredit) {
      dispatch(handleAlertInfoCouponCode(true));
    }
  } catch (error) {
    dispatch(finishPutLoading());
    await dispatch(fetchCartPayment());
    return dispatch(applyCouponError('not_apply_it'));
  }
};

export const deleteCoupon = coupon => {
  return async (dispatch, getState) => {
    dispatch(startCartItemLoading());

    try {
      const { totals } = getState().payment.payment;
      coupon = coupon.toLowerCase();

      const couponObj = find(prop(totals, 'total_segments'), segment => {
        return segment.code === 'amasty_coupon_amount';
      });

      const couponsCode = [];
      map(couponObj.value, list => {
        const couponJson = JSON.parse(list);
        couponsCode.push(couponJson);
      });

      let listCoupon = [];
      let coupons = '';

      if (couponsCode.length > 0) {
        listCoupon = filter(couponsCode, value => {
          return (
            value.coupon_code.toString().toLowerCase() !== coupon.toString()
          );
        });

        if (listCoupon.length > 0) {
          listCoupon.map((val, key) => {
            coupons += (key !== 0 ? '%2C' : '') + val.coupon_code.toLowerCase();
          });
        }
      }

      let checkStatus;
      if (coupons !== '') {
        const { status } = await service.put('/cart/putCoupon', {
          coupons,
        });

        checkStatus = status;
      } else {
        const { status } = await service.delete('/cart/deleteCoupon', {});

        checkStatus = status;
      }

      if (checkStatus === 'error') {
        // dispatch(finishCartLoading());
        return;
      }
      dispatch(finishCartLoading());

      await dispatch(fetchCart());
      await dispatch(fetchCartPayment());
    } catch (error) {
      await dispatch(fetchCartPayment());
      dispatch(finishCartLoading());
    }
  };
};

export const putGiftWrapping = optionId => async dispatch => {
  dispatch(startCartLoading());

  try {
    const { status } = await service.put(`/cart/putGiftWrapping/${optionId}`);
    if (status === 'error') {
      dispatch(finishCartLoading());
      return;
    }

    await dispatch(fetchCartPayment());
  } catch (error) {
    await dispatch(fetchCartPayment());
    dispatch(finishCartLoading());
  }
};

export const fetchGiftWrapping = () => async dispatch => {
  dispatch(startCartLoading());
  try {
    const { options } = await service.get(`/cart/fetchGiftWrapping/`);

    dispatch(fetchGiftWrappingCompleted(options));
  } catch (error) {
    dispatch(finishCartLoading());
  }
};

export const deleteGiftWrapping = () => async dispatch => {
  dispatch(startCartLoading());
  try {
    const { status } = await service.post(`/cart/deleteGiftWrapping`);

    if (status === 'error') {
      dispatch(finishCartLoading());
      return;
    }

    await dispatch(fetchCartPayment());
  } catch (error) {
    await dispatch(fetchCartPayment());
    dispatch(finishCartLoading());
  }
};

export const changeGiftMessage = giftMessage => async (dispatch, getState) => {
  dispatch(startCartLoading());

  try {
    const { status } = await service.post(`/cart/changeGiftMessage/`, {
      giftMessage,
      extension_attributes: {
        wrapping_id: find(getState().cart.cart.total_segments, {
          code: 'giftwrapping',
        }).extension_attributes.gw_order_id,
      },
    });

    if (status === 'error') {
      return;
    }
    dispatch(finishCartLoading());
  } catch (error) {
    dispatch(finishCartLoading());
  }
};

export const initialFreebie = () => async (dispatch, getState) => {
  const { cart } = getState().cart;
  const cartItems = cart.items;

  map(cartItems, item => {
    const isHasFreebie = prop(item, 'extension_attributes.free_items');
    const freebieAdded = prop(item, 'extension_attributes.free_items_added');

    if (isHasFreebie) {
      map(isHasFreebie, freebie => {
        const isFreebieAdded = find(
          freebieAdded,
          added => added.sku === freebie.sku,
        );

        if (isFreebieAdded && isFreebieAdded.qty === freebie.qty) {
        } else {
          dispatch(addFreeItem(isHasFreebie));
        }
      });
    }
  });
};

export const addFreeItem = freeItem => async (dispatch, getState) => {
  try {
    const items = {};

    map(freeItem, (item, idx) => {
      items[idx] = {
        cart_id: getState().cart.cart.id,
        sku: item.sku,
        qty: item.qty,
      };
    });

    const response = await service.post('/cart/promo/add', { items: items });
    dispatch(fetchCart());
    return response;
  } catch (e) {
    return null;
  }
};

export function startCartLoading() {
  return {
    type: types.START_CART_LOADING,
  };
}

export function finishCartLoading(error) {
  return {
    type: types.FINISH_CART_LOADING,
    error,
  };
}

export function startPutLoading() {
  return {
    type: types.START_PUT_LOADING,
  };
}

export function finishPutLoading() {
  return {
    type: types.FINISH_PUT_LOADING,
  };
}

export function applyCouponError(error) {
  return {
    type: types.APPLY_COUPON_ERROR,
    payload: {
      error,
    },
  };
}

export function startCartItemLoading(sku) {
  return {
    type: types.START_CART_ITEM_LOADING,
    payload: {
      sku,
    },
  };
}

export function finishCartItemLoading() {
  return {
    type: types.FINISH_CART_ITEM_LOADING,
  };
}

export function fetchCartCompleted(cart) {
  return {
    type: types.FETCH_CART,
    payload: {
      cart,
    },
  };
}

export function finishReorder() {
  return {
    type: types.FINISH_REORDER,
  };
}

export function fetchGiftWrappingCompleted(options) {
  return {
    type: types.FETCH_GIFT_WRAPPING,
    payload: options,
  };
}

const itemToProduct = item => ({
  sku: item.sku,
  qty: item.qty_ordered,
});

export function handleAlertInfoCouponCode(isShow) {
  return {
    type: types.HANDLE_ALERT_INFO_COUPON_CODE,
    payload: isShow,
  };
}
