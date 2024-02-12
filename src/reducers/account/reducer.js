import types from './types';

const initialState = {
  accountInfo: {},
  accountInfoError: false,
};

export default function accountInfo(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_ACCOUNT_INFORMATION:
      return {
        accountInfo: action.payload,
        accountInfoError: false,
      };
    case types.FETCH_ACCOUNT_INFORMATION_ERROR:
      return {
        accountInfo: null,
        accountInfoError: true,
      };
    case types.UPDATE_PROFILE_START:
      return {
        ...state,
        saving: true,
        error: null,
      };
    case types.UPDATE_PROFILE_END:
      return {
        ...state,
        saving: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
