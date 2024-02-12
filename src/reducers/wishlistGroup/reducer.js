import types from './types';

const initialState = {
  wishlistGroups: [],
  response: [],
  loading: false,
};

export default function wishlistGroups(state = initialState, action) {
  switch (action.type) {
    case types.START_WISHLISTGROUP:
      return {
        ...state,
        loading: true,
      };
    case types.FETCH_WISHLISTGROUP:
      return {
        ...state,
        wishlistGroups: action.payload.groups.items,
        loading: false,
      };
    case types.COMPLETE_WISHLISTGROUP:
      return {
        ...state,
        response: action.payload.response.items,
        loading: false,
      };
    case types.FAILED_WISHLISTGROUP:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
