export const setProductDetail = (state, action) => {
  return {
    ...state,
    productDetail: action?.productDetail || {},
  };
};
