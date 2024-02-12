import service from '../../ApiService';
import types from './types';

export const fetchWishlistGroup = () => async (dispatch, getState) => {
  dispatch(startLoading());
  const { groups } = await service.get(`/wishlists`, {
    customer_id: getState().customer.customer.id,
    limit: 0,
  });
  dispatch(fetchWishlistGroupCompleted(groups));
  return groups;
};

export const addWishlistGroup = name => async (dispatch, getState) => {
  try {
    const response = await service.put(`/wishlist`, {
      name,
      cusID: getState().customer.customer.id,
    });
    dispatch(addWishlistGroupCompleted(response));
    dispatch(fetchWishlistGroup());
    return response;
  } catch (e) {
    dispatch(addWishlistGroupFailed());
    return null;
  }
};

export const editWishlistGroup = (name, id) => async dispatch => {
  try {
    const response = await service.post(`/wishlist/${id}`, { name });
    dispatch(editWishlistGroupCompleted(response));
    dispatch(fetchWishlistGroup());
    return response;
  } catch (e) {
    dispatch(editWishlistGroupFailed());
    return null;
  }
};

export const deleteWishlistGroup = groupID => async dispatch => {
  try {
    const response = await service.delete(`/wishlist/deleteGroup`, {
      groupID: groupID,
    });
    dispatch(deleteWishlistGroupCompleted(response));
    dispatch(fetchWishlistGroup());
    return response;
  } catch (e) {
    dispatch(deleteWishlistGroupFailed());
    return null;
  }
};

export function startLoading() {
  return { type: types.START_WISHLISTGROUP };
}

export function fetchWishlistGroupCompleted(groups) {
  return {
    type: types.FETCH_WISHLISTGROUP,
    payload: {
      groups,
    },
  };
}

export function addWishlistGroupCompleted(response) {
  return {
    type: types.COMPLETE_WISHLISTGROUP,
    payload: {
      response,
    },
  };
}
export const addWishlistGroupFailed = () => ({
  type: types.FAILED_WISHLISTGROUP,
});
export function deleteWishlistGroupCompleted(response) {
  return {
    type: types.COMPLETE_WISHLISTGROUP,
    payload: {
      response,
    },
  };
}
export const deleteWishlistGroupFailed = () => ({
  type: types.FAILED_WISHLISTGROUP,
});

export function editWishlistGroupCompleted(response) {
  return {
    type: types.COMPLETE_WISHLISTGROUP,
    payload: {
      response,
    },
  };
}
export const editWishlistGroupFailed = () => ({
  type: types.FAILED_WISHLISTGROUP,
});
