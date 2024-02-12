import types from './types';

const initialState = {
  cart: null,
  loading: true,
  itemLoading: false,
  skuLoading: null,
  initial: true,
  msgError: '',
  couponLoading: false,
  alertInfoCouponCode: false,
};

export default function cart(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_CART:
      return {
        ...state,
        cart: { ...action.payload.cart },
        loading: false,
        initial: false,
        msgError: '',
      };
    case types.START_CART_LOADING:
      return {
        ...state,
        loading: true,
        initial: false,
      };
    case types.FINISH_CART_LOADING:
      return {
        ...state,
        loading: false,
        itemLoading: false,
        msgError: '',
      };
    case types.APPLY_COUPON_ERROR:
      return {
        ...state,
        loading: false,
        couponLoading: false,
        msgError: action.payload.error,
      };
    case types.START_CART_ITEM_LOADING:
      return {
        ...state,
        loading: true,
        itemLoading: true,
        skuLoading: action.payload.sku,
      };
    case types.FINISH_CART_ITEM_LOADING:
      return {
        ...state,
        itemLoading: false,
        skuLoading: null,
      };

    case types.FINISH_REORDER:
      return state;

    case types.FETCH_GIFT_WRAPPING:
      return {
        ...state,
        giftWrappingOptions: action.payload,
      };

    case types.START_PUT_LOADING:
      return {
        ...state,
        couponLoading: true,
      };

    case types.FINISH_PUT_LOADING:
      return {
        ...state,
        couponLoading: false,
      };
    case types.HANDLE_ALERT_INFO_COUPON_CODE:
      return {
        ...state,
        alertInfoCouponCode: action.payload,
      };
    default:
      return state;
  }
}
