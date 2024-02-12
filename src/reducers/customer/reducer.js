import types from './types';
import { isUndefined } from 'lodash';

const initialState = {
  customer: {},
  type: null,
  isAdmin: false,
  company: null,
  shouldShowPopup: false,
  passwordChangeMessage: '',
  loading: false,
};

export default function customer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_CUSTOMER: {
      const {
        customer,
        type,
        shouldShowPopup,
        company,
        isAdmin,
        device,
      } = action.payload;

      return {
        ...state,
        customer: !isUndefined(customer.id)
          ? { ...customer, isMobile: device === 'mobile' }
          : null,
        type,
        shouldShowPopup,
        company,
        isAdmin,
      };
    }

    case types.CHANGE_CUSTOMER_TYPE:
      const { type } = action.payload;
      return {
        ...state,
        type,
        shouldShowPopup: false,
      };

    case types.SET_PASSWORD_CHANGE_MESSAGE:
      return {
        ...state,
        passwordChangeMessage: action.payload.message,
      };
    case types.TOGGLE_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    case types.UPDATE_CUSTOMER_COMPLETED:
      const { customer, company, isAdmin } = action.payload;
      return {
        ...state,
        customer: !isUndefined(customer.id) ? customer : null,
        company,
        isAdmin,
      };
    default:
      return state;
  }
}
