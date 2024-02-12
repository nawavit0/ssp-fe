export const popupAddtoCartBox = (state, action) => {
  return {
    ...state,
    popupInfo: action?.popupInfo || {},
  };
};
