import types from './types';

const initialState = {
  showMobileMenu: false,
  showMobileModal: false,
  showMobileSearch: false,
  alert: null,
  hideMegamenu: false,
  showMiniCart: false,
};

export default function layout(state = initialState, action) {
  switch (action.type) {
    case types.OPEN_MOBILE_MENU:
      return { ...state, showMobileMenu: true };
    case types.CLOSE_MOBILE_MENU:
      return { ...state, showMobileMenu: false };
    case types.OPEN_MOBILE_MODAL:
      return { ...state, showMobileModal: true };
    case types.CLOSE_MOBILE_MODAL:
      return { ...state, showMobileModal: false };
    case types.SHOW_MOBILE_SEARCH:
      return { ...state, showMobileSearch: true };
    case types.HIDE_MOBILE_SEARCH:
      return { ...state, showMobileSearch: false };
    case types.HIDE_MEGAMENU_START:
      return { ...state, hideMegamenu: true };
    case types.SHOW_MINI_CART:
      return { ...state, showMiniCart: true };
    case types.HIDE_MINI_CART:
      return { ...state, showMiniCart: false };
    case types.HIDE_MEGAMENU_END:
      return { ...state, hideMegamenu: false };
    case types.OPEN_ALERT:
      return {
        ...state,
        alert: {
          title: action.payload.title,
          message: action.payload.message,
        },
      };
    case types.CLOSE_ALERT:
      return { ...state, alert: null };
    default:
      return state;
  }
}
