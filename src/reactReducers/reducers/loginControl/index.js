export const closeLoginDesktopBox = state => {
  return {
    ...state,
    isPopupLoginDesktopOpen: false,
  };
};

export const openLoginDesktopBox = state => {
  return {
    ...state,
    isPopupLoginDesktopOpen: true,
  };
};
