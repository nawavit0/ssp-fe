import types from './types';

const initialState = {
  pageName: 'home',
  productSku: '',
};

export default function tracking(state = initialState, action) {
  switch (action.type) {
    case types.SET_PAGE_NAME:
      return {
        ...state,
        pageName: action.payload.name,
        productSku: '',
      };
    case types.SET_PRODUCT_SKU:
      return {
        ...state,
        productSku: action.payload.sku,
      };
    default:
      return state;
  }
}
