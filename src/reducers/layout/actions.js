import types from './types';

export function openMobileMenu() {
  return {
    type: types.OPEN_MOBILE_MENU,
  };
}

export function closeMobileMenu() {
  return {
    type: types.CLOSE_MOBILE_MENU,
  };
}

export function openMobileModal() {
  return {
    type: types.OPEN_MOBILE_MODAL,
  };
}

export function closeMobileModal() {
  return {
    type: types.CLOSE_MOBILE_MODAL,
  };
}

export function showMobileSearch() {
  return {
    type: types.SHOW_MOBILE_SEARCH,
  };
}

export function hideMobileSearch() {
  return {
    type: types.HIDE_MOBILE_SEARCH,
  };
}

export const openAlert = (message, title) => async dispatch => {
  dispatch(openAlertStart(message, title));
};

export function openAlertStart(message, title) {
  return {
    type: types.OPEN_ALERT,
    payload: {
      message,
      title,
    },
  };
}

export function closeAlert() {
  return {
    type: types.CLOSE_ALERT,
  };
}

export const hideMegaMenu = () => async dispatch => {
  await dispatch(hideMegaMenuStart());
  dispatch(hideMegaMenuEnd());
};

export function hideMegaMenuStart() {
  return {
    type: types.HIDE_MEGAMENU_START,
  };
}

export function hideMegaMenuEnd() {
  return {
    type: types.HIDE_MEGAMENU_END,
  };
}

export function showMiniCart() {
  return {
    type: types.SHOW_MINI_CART,
  };
}

export function hideMiniCart() {
  return {
    type: types.HIDE_MINI_CART,
  };
}
