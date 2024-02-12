import types from './types';

const initialState = {
  wishlist: [],
  loading: true,
};

export default function wishlist(state = initialState, action) {
  switch (action.type) {
    case types.START_WISHLIST:
      return {
        ...state,
        loading: true,
        initial: false,
      };
    case types.FETCH_WISHLIST:
      return {
        ...state,
        wishlist: action.payload.response.lists.items,
        total: action.payload.response.lists.total_count,
        loading: false,
      };
    case types.FAILED_WISHLIST:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
