import types from './types';

const initialState = {
  the1card: {},
  loading: false,
  redeemLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_THE1CARD: {
      const { the1card } = action.payload;
      return {
        ...state,
        the1card,
        loading: false,
      };
    }

    case types.START_LOGIN_T1C_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }

    case types.STOP_LOGIN_T1C_LOADING: {
      return {
        ...state,
        loading: false,
      };
    }

    case types.START_LOADING_REDEEM_T1: {
      return {
        ...state,
        redeemLoading: true,
      };
    }

    case types.STOP_LOADING_REDEEM_T1: {
      return {
        ...state,
        redeemLoading: false,
      };
    }

    case types.STOP_LOADING_REMOVE_REDEEM_T1: {
      return {
        ...state,
        the1card: {},
        redeemLoading: false,
      };
    }

    default:
      return state;
  }
};
