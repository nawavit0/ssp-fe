import service from '../../ApiService';
import types from './types';
// import { googleTagDataLayer } from '../../reducers/googleTag/actions';
// import gtmType from '../../constants/gtmType';

export const fetchWishlist = (params = {}) => async dispatch => {
  dispatch(startLoading());
  const response = await service.get(`/wishlist-item`, params);
  if (!params.product_id) {
    dispatch(fetchWishlistCompleted(response));
  }
  return response;
};

export const addWishlist = (
  groupId,
  itemId,
  groupIdDefault,
  product,
  activeAttribute,
  chkTarget,
) => async dispatch => {
  try {
    const response = await service.put(`/wishlist-item`, {
      groupId,
      itemId: product.id,
      activeAttribute: activeAttribute,
    });
    // const wishlistProduct = product;
    if (chkTarget === 'reLoad' && groupId === groupIdDefault) {
      await dispatch(fetchWishlist({ wishlist_id: groupId, limit: 0 }));
      // dispatch(
      //   googleTagDataLayer(gtmType.EVENT_ADD_TO_WISHLIST, wishlistProduct),
      // );
    }
    return response;
  } catch (e) {
    dispatch(addWishlistFailed());
    return null;
  }
};

export const deleteWishlist = (
  groupId,
  itemId,
  page,
  limit,
) => async dispatch => {
  try {
    await service.delete(`/wishlist-item/deleteList`, {
      itemId: itemId,
    });
    dispatch(fetchWishlist({ limit: limit, page: page, wishlist_id: groupId }));
  } catch (e) {
    return null;
  }
};

export function startLoading() {
  return { type: types.START_WISHLIST };
}

export function fetchWishlistCompleted(response) {
  return {
    type: types.FETCH_WISHLIST,
    payload: {
      response,
    },
  };
}
export const checkWishlist = () => ({
  type: types.CHECK_WISHLIST,
});
export const addWishlistFailed = () => ({
  type: types.FAILED_WISHLIST,
});
export const deleteWishlistFailed = () => ({
  type: types.FAILED_WISHLIST,
});
