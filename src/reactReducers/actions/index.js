import * as types from './types';

export const setPopupLoginDesktopOpen = isPopupLoginDesktopOpen => ({
  type: types.OPEN_LOGIN_DESKTOP,
  payload: { isPopupLoginDesktopOpen },
});

export const setPopupLoginDesktopClose = isPopupLoginDesktopOpen => ({
  type: types.CLOSE_LOGIN_DESKTOP,
  payload: { isPopupLoginDesktopOpen },
});
export const setPopupAddtoCart = popupInfo => {
  return {
    type: types.SET_POPUP_ADD_TO_CART,
    popupInfo,
  };
};
export const setProductDetail = productDetail => {
  return {
    type: types.SET_PRODUCT_DETAIL,
    productDetail,
  };
};
