import types from './types';

const initialState = {
  payment: {},
  paymentMethod: '',
  extension: {},
  loading: false,
  loadingFetchPayment: true,
};

export default function payment(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_PAYMENT:
      return {
        ...state,
        payment: action.payload.payment,
      };
    case types.SET_PAY_123:
      return {
        ...state,
        extension: action.payload.extension,
      };
    case types.SET_PAY_IPP:
      return {
        ...state,
        extension: action.payload.extension,
      };
    case types.SET_PAYMENT_METHOD:
      return {
        ...state,
        ...{ paymentMethod: action.payload.paymentMethod },
      };
    case types.SET_PAYMENT_EWALLET_METHOD:
      return {
        ...state,
        ...{ paymentMethod: action.payload.paymentMethod },
        extension: { payment_option: action.payload.extension },
      };
    case types.SET_ONTOP_CREDITCARD:
      return {
        ...state,
        extension: {
          payment_ontop: action.payload.extension,
        },
      };
    case types.START_ONTOP_CREDITCARD:
      return {
        ...state,
        loading: true,
      };
    case types.STOP_ONTOP_CREDITCARD:
      return {
        ...state,
        loading: false,
      };

    case types.START_FETCH_PAYMENT_METHOD:
      return {
        ...state,
        loadingFetchPayment: true,
      };
    case types.END_FETCH_PAYMENT_METHOD:
      return {
        ...state,
        loadingFetchPayment: false,
        loading: false,
      };
    case types.CLEAR_EXTENSION:
      return {
        ...state,
        extension: {},
      };

    default:
      return state;
  }
}
