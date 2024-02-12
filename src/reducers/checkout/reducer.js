import types from './types';
import { includes, isEqual } from 'lodash';
import DeliveryType from '../../model/Checkout/DeliveryType';

const initialState = {
  deliveryOption: 0, // enum?
  currentShippingMethod: null,
  billingAddress: null,
  shippingAddress: null,
  shippingMethods: [],
  isFullTaxInvoice: false,
  isSelfPickup: true,
  loading: false,
  estimating: false,
  requiredPhone: false,
  initialed: false,
  availableMethods: null,
  errorsValidateT1c: false,
};

export default function checkout(state = initialState, action) {
  switch (action.type) {
    case types.SET_DELIVERY_OPTION:
      return {
        ...state,
        deliveryOption: action.payload.deliveryOption,
      };
    case types.SET_BILLING_ADDRESS:
      return {
        ...state,
        billingAddress: action.payload.address,
      };

    case types.SET_SHIPPING_ADDRESS:
      return updateShippingAddress(state, action.payload.address);

    case types.SET_ACTIVE_SHIPPING_METHODS:
      return updateShippingMethods(state, action.payload.shippingMethods);

    case types.SET_CURRENT_SHIPPING_METHOD:
      return {
        ...state,
        pickupLocation: undefined,
        currentShippingMethod: action.payload.shippingMethod,
      };
    case types.SET_PICKUP_LOCATION:
      return {
        ...state,
        currentShippingMethod: undefined,
        pickupLocation: action.payload.location,
      };
    case types.TOGGLE_FULL_TAX_INVOICE:
      return {
        ...state,
        isFullTaxInvoice: !state.isFullTaxInvoice,
      };
    case types.TOGGLE_SELF_PICKUP:
      return {
        ...state,
        isSelfPickup: !state.isSelfPickup,
      };
    case types.CREATE_ORDER_START:
    case types.SAVE_SHIPPING_INFO:
      return {
        ...state,
        loading: true,
      };
    case types.CREATE_ORDER_STOP:
    case types.SAVE_SHIPPING_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case types.ESTIMATE_SHIPPING_METHODS:
      return {
        ...state,
        estimating: true,
      };
    case types.API_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case types.REQUIRED_PHONE_NO:
      return {
        ...state,
        requiredPhone: true,
      };
    case types.NOT_REQUIRED_PHONE_NO:
      return {
        ...state,
        requiredPhone: false,
      };
    case types.SET_AVAILABLE_SHIPPING_METHOD:
      return {
        ...state,
        initialed: true,
        availableMethods: action.payload.method,
      };
    case types.CLEAR_SHIPPING_METHOD:
      return {
        ...state,
        currentShippingMethod: null,
      };
    case types.ADD_EARN_T1C_APPLY:
      return {
        ...state,
        errorsValidateT1c: false,
      };
    case types.CHANGE_EARN_T1C_APPLY:
      return {
        ...state,
        errorsValidateT1c: true,
      };
    default:
      return state;
  }
}

function updateShippingAddress(state, shippingAddress) {
  // has changed?
  if (isEqual(state.shippingAddress, shippingAddress)) return state;
  const billingAddress = state.billingAddress
    ? state.billingAddress
    : !state.isFullTaxInvoice
      ? shippingAddress
      : null;

  return {
    ...state,
    billingAddress,
    shippingAddress,
  };
}

function updateShippingMethods(state, activeMethods) {
  const current = // has selected
    state.deliveryOption === DeliveryType.ShipToAddress &&
    state.currentShippingMethod;

  const newValue = includes(activeMethods, current) ? current : undefined;
  return {
    ...state,
    currentShippingMethod: newValue,
    estimating: false,
    shippingMethods: activeMethods,
  };
}
