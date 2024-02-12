import { isEmpty, omit, get, merge, isUndefined } from 'lodash';

import { explode } from '../../utils/customAttributes';
import { fetchCart } from '../cart/actions';
import { fetchOrderById } from '../order/actions';
import { getCart } from '../cart/selectors';
import { getCookie, unsetCookie } from '../../utils/cookie';
// import { googleTagDataLayer } from '../googleTag/actions';
import AddressModel from '../../model/Address/AddressModel';
import DeliveryType from '../../model/Checkout/DeliveryType';
// import gtmType from '../../constants/gtmType';
import PaymentMethodModel from '../../model/Checkout/PaymentMethodModel';
import service from '../../ApiService';
import types from './types';

import {
  selectDefaultShippingAddress,
  selectDefaultBillingAddress,
} from '../customer/selectors';
import {
  getPickupAddress,
  getPickupLocation,
  getPickerInfo,
  getGuestInfo,
  hasCompletedShipping,
  isUserLoggedIn,
  getGuestFullTagBillingAddress,
  isFulltagBillingSuccess,
  getIsFullTagEnable,
} from './selectors';
import { getFormValues, submit } from 'redux-form';
import history from '../../history';

import {
  validateIdCard,
  validateTaxId,
  validateAddressLine,
  validateBranchId,
} from '../../utils/validations';

export const beginCheckout = () => async (dispatch, getState) => {
  if (!getCart(getState())) {
    await dispatch(fetchCart());
    // dispatch(googleTagDataLayer(gtmType.CHECKOUT));
  }

  await dispatch(fetchAvailableShippingMethod());
};

export const fetchAvailableShippingMethod = () => async dispatch => {
  const address = { country_id: 'TH' };
  const addressModelData = new AddressModel(createAddressModel(address));
  const { shippingMethods } = await service.post(
    `/cart/estimate-shipping-methods`,
    {
      address: addressModelData,
    },
  );

  await dispatch(setAvailableShippingMethod(shippingMethods));
};

export const selectDeliveryOption = option => async (dispatch, getState) => {
  switch (option) {
    case DeliveryType.ShipToAddress:
      dispatch(clearShippingMethod());
      await initShipToAddress(dispatch, getState);
      break;
    case DeliveryType.PickupAtStore:
    case DeliveryType.PickupAtSkyBox:
    default:
      await initPickupLocation(dispatch, getState);
      break;
  }
  dispatch(setDeliveryOption(option));
};

const checkAddressLineValid = address => {
  const custom_attributes = get(address, 'custom_attributes');
  if (isUndefined(custom_attributes)) return false;
  let result = true;
  if (!isUndefined(custom_attributes)) {
    const addressLine = custom_attributes.find(
      attr => attr.attribute_code === 'address_line',
    );
    const addressLineValue = get(addressLine, 'value');
    result = validateAddressLine(addressLineValue);
  }

  return result;
};

/**
 * shipping to address
 * @private
 */
async function initShipToAddress(dispatch, getState) {
  const state = getState();
  const {
    checkout: { billingAddress, shippingAddress },
  } = state;
  const defaultBilling = selectDefaultBillingAddress(state);

  if (!billingAddress && defaultBilling) {
    dispatch(setBillingAddress(defaultBilling)); // restore value
  }

  const defaultShipping = selectDefaultShippingAddress(state);

  const billingAddressValid = checkAddressLineValid(
    defaultShipping || shippingAddress,
  );
  if (billingAddressValid) {
    if (!shippingAddress && defaultShipping) {
      dispatch(setShippingAddress(defaultShipping));
      await getShippingMethods(defaultShipping)(dispatch);
      await saveShippingInfo()(dispatch, getState);
    } else if (shippingAddress) {
      await dispatch(getShippingMethods(shippingAddress));
      await saveShippingInfo()(dispatch, getState);
    }
  }
}

/**
 * pickup at store or family mart
 * @private
 */
async function initPickupLocation(dispatch, getState) {
  const {
    checkout: { billingAddress, shippingMethods },
  } = getState();

  // if not already get
  if (isEmpty(shippingMethods)) {
    const thailand = { country_id: 'TH' }; // only in day1
    await dispatch(getShippingMethods(thailand));
  }
  const defaultBilling = selectDefaultBillingAddress(getState());
  if (!billingAddress && defaultBilling) {
    dispatch(setBillingAddress(defaultBilling));
  }
}

/**
 * get shipping methods by address
 * @private
 */
const getShippingMethods = address => async dispatch => {
  dispatch(startEstimateShippingMethods(address));
  try {
    const { shippingMethods } = await service.post(
      `/cart/estimate-shipping-methods`,
      {
        address: address,
      },
    );

    await dispatch(setActiveShippingMethods(shippingMethods));
    await dispatch(
      setCurrentShippingMethodForinitShipToAddress(shippingMethods),
    );
  } catch (e) {
    dispatch(onError(e));
  }
};

const setCurrentShippingMethodForinitShipToAddress = shippingMethods => async dispatch => {
  try {
    if (shippingMethods && shippingMethods.length > 0) {
      const setCurrentMethod = shippingMethods.filter(
        method => method.method_code === 'standard',
      );
      if (setCurrentMethod && setCurrentMethod.length === 1) {
        await dispatch(setCurrentShippingMethod(setCurrentMethod[0]));
        // await dispatch(saveShippingInfo());
      }
    }
  } catch (e) {
    dispatch(onError(e));
  }
};

export const estimateGuestShipment = postcode => async (dispatch, getState) => {
  if (postcode && postcode.length === 5) {
    const state = getState();
    const values = getFormValues('guestAddressForm')(state);
    const guestInfoForm = getFormValues('guestInfoForm')(state);
    const address = createAddressModel(
      { ...merge(values, guestInfoForm), postcode },
      'guest',
    );
    await getShippingMethods(address)(dispatch);
    dispatch(clearShippingMethod());
  }
};

export const estimateMemberShipment = address => async (dispatch, getState) => {
  const addressModel = createAddressModel(address);

  const state = getState();
  const {
    checkout: { billingAddress },
  } = state;

  const defaultBilling = selectDefaultBillingAddress(state);
  if (!billingAddress && defaultBilling) {
    dispatch(setBillingAddress(defaultBilling)); // restore value
  }

  dispatch(setShippingAddress(addressModel));
  // chaing actionsDeliveryType.ShipToAddress
  await getShippingMethods(addressModel)(dispatch);
  await saveShippingInfo()(dispatch, getState);
};

export const continueToPay = () => (dispatch, getState) => {
  const state = getState();
  if (!isUserLoggedIn(state)) {
    dispatch(submit('guestInfoForm'));
  } else if (state.checkout.deliveryOption !== DeliveryType.ShipToAddress) {
    // if (!state.checkout.isSelfPickup) {
    //   dispatch(submit('collectorInfoForm')); // process picker form
    // } else {
    //   dispatch(savePickupInfo()); // save and continue
    // }
    // dispatch(googleTagDataLayer(gtmType.EVENT_CHECKOUT_STEP_TWO));
    dispatch(savePickupInfo()); // save and continue
  } else {
    // dispatch(googleTagDataLayer(gtmType.EVENT_CHECKOUT_STEP_TWO));
    goToPayment(state); // saved, just continue
  }
};

/**
 * handle Guest deliveryOption - just glue code
 */
export const submitGuestInfo = () => async (dispatch, getState) => {
  const {
    checkout: { deliveryOption },
  } = getState();

  const isFulltagEnable = getIsFullTagEnable(getState());

  if (isFulltagEnable) {
    await dispatch(submit('guestBillingAddressForm'));
    const isFullTagBillingSubmitSuccess = isFulltagBillingSuccess(getState());
    if (!isFullTagBillingSubmitSuccess) {
      return;
    }
    dispatch(onError(null));
  }

  if (deliveryOption === DeliveryType.ShipToAddress) {
    dispatch(submit('guestAddressForm'));
  } else {
    // dispatch(googleTagDataLayer(gtmType.EVENT_CHECKOUT_STEP_TWO));
    dispatch(savePickupInfo());
  }
};

/**
 * handle Guest - ShipToAddress option.
 */
export const submitGuestAddress = values => async (dispatch, getState) => {
  const state = getState();
  const guest = getGuestInfo(state);
  const formValues = {
    ...values,
    ...guest,
  };
  const shippingAddress = createAddressModel(formValues, 'guest');
  dispatch(setShippingAddress(shippingAddress));

  let billingAddress = shippingAddress;

  const isFulltagEnable = getIsFullTagEnable(state);
  const isFullTagBillingSubmitSuccess = isFulltagBillingSuccess(state);
  const guestFullTagBillingAddress = getGuestFullTagBillingAddress(state);

  if (isFulltagEnable) {
    if (isFullTagBillingSubmitSuccess) {
      const guestFormValues = {
        ...guestFullTagBillingAddress,
        ...guest,
      };
      billingAddress = createAddressModel(guestFormValues, 'guest');
    } else {
      return;
    }
  }

  dispatch(setBillingAddress(billingAddress));

  await saveShippingInfo()(dispatch, getState);
  // dispatch(googleTagDataLayer(gtmType.EVENT_CHECKOUT_STEP_TWO));
  goToPayment(getState());
};

/**
 * handle pickup with collector info
 */
export const submitPickerInfo = values => async dispatch => {
  if (!values) return;
  dispatch(savePickupInfo());
};

export const saveShippingInfo = () => async (dispatch, getState) => {
  const {
    checkout: {
      currentShippingMethod,
      billingAddress,
      shippingAddress,
      isFullTaxInvoice,
    },
    form,
  } = getState();
  const state = getState();

  const guestBillingAddressForm = getFormValues('guestBillingAddressForm')(
    state,
  );
  const guestAddressForm = getFormValues('guestAddressForm')(state);
  const guestInfoForm = getFormValues('guestInfoForm')(state);
  const addressForm = createAddressModel(
    merge(guestAddressForm, guestInfoForm),
    'guest',
  );
  const billingForm = createAddressModel(
    merge(guestBillingAddressForm, guestInfoForm),
    'guest',
  );
  const guest = get(form, 'guestAddressForm.values');

  if (
    (!shippingAddress && isUndefined(guest)) ||
    (!billingAddress && isUndefined(guest)) ||
    !currentShippingMethod
  ) {
    return;
  }

  dispatch(shippingInfoUpdating());
  try {
    const isLogin = isUserLoggedIn(state);
    const tempShippingAddress = createAddressModel(
      isLogin && shippingAddress ? shippingAddress : addressForm,
      !isLogin ? 'guest' : '',
    );

    let billingAddressModel;
    if (isLogin) {
      billingAddressModel = !isEmpty(billingAddress)
        ? billingAddress
        : tempShippingAddress;
    } else {
      billingAddressModel = isFullTaxInvoice ? billingForm : addressForm;
    }
    const tempBillingAddress = createAddressModel(
      billingAddressModel,
      !isLogin ? 'guest' : '',
    );

    const params = {
      addressInformation: {
        shipping_address: tempShippingAddress,
        billing_address: tempBillingAddress,
        isFullTax: isFullTaxInvoice,
        shipping_method_code: currentShippingMethod.method_code,
        shipping_carrier_code: currentShippingMethod.carrier_code,
      },
    };

    await service.post(`/checkout/shipping-information`, params);
    await dispatch(fetchCart());
    dispatch(shippingInfoUpdated());
  } catch (error) {
    dispatch(onError(error));
  }
};

export const saveSelectedMapLocation = () => async (dispatch, getState) => {
  const state = getState();
  const {
    checkout: {
      billingAddress,
      deliveryOption,
      isFullTaxInvoice,
      isSelfPickup,
      pickupLocation,
    },
  } = state;

  if (deliveryOption === DeliveryType.ShipToAddress) {
    throw new Error('invalid state: use `saveShippingInfo` instead');
  }
  if (!pickupLocation) return;

  const location = getPickupLocation(state);
  const address = getPickupAddress(state);
  if (!address || !location.id) return;
  const guestBillingAddressForm = getFormValues('guestBillingAddressForm')(
    state,
  );
  const guestInfoForm = getFormValues('guestInfoForm')(state);
  const billingForm = createAddressModel(
    merge(guestBillingAddressForm, guestInfoForm),
    'guest',
  );
  const shipTo = createAddressModel(address);

  const billTo =
    isFullTaxInvoice && billingAddress
      ? createAddressModel(billingAddress)
      : isFullTaxInvoice
      ? billingForm
      : shipTo;

  dispatch(shippingInfoUpdating());

  try {
    await service.post(`/checkout/shipping-information`, {
      addressInformation: {
        shipping_address: shipTo,
        billing_address: billTo,
        shipping_method_code: 'pickupatstore',
        shipping_carrier_code: 'pickupatstore',
        isFullTax: isFullTaxInvoice,
        extension_attributes: {
          pickup_location_id: location.id,
          picker_info: isSelfPickup ? undefined : getPickerInfo(state),
        },
      },
    });
    dispatch(shippingInfoUpdated());
    await dispatch(fetchCart());
  } catch (error) {
    dispatch(onError(error));
  }
};

export const savePickupInfo = () => async (dispatch, getState) => {
  const save = saveSelectedMapLocation();
  await save(dispatch, getState);
  goToPayment(getState());
};

export const saveBillingInfo = address => async (dispatch, getState) => {
  const {
    checkout: { isFullTaxInvoice },
  } = getState();
  try {
    const bilingAddress = {
      ...address,
    };

    if (address && isFullTaxInvoice) {
      bilingAddress.full_tax_request = 1;
    }
    dispatch(shippingInfoUpdating());
    dispatch(setBillingAddress(bilingAddress));
    const response = await service.post(`/checkout/billing-information`, {
      address: createAddressModel(bilingAddress),
    });
    await dispatch(fetchCart());
    dispatch(shippingInfoUpdated());
    return response;
  } catch (error) {
    dispatch(onError(error));
  }
};

/**
 * @private helper
 * @return {AddressModel} to save into carts/shipping-information
 */
function createAddressModel(address, guest) {
  const explodeAddress = explode(address);
  const addressModel = new AddressModel(guest ? address : explodeAddress);

  addressModel.createCustomAttr();

  return omit(addressModel, ['id', 'region']);
}

/**
 * @private navigate to checkout/payment
 */
function goToPayment(state) {
  if (hasCompletedShipping(state)) {
    history.push(`/${state.locale.langCode}/checkout/payment`);
  }
}

export const createOrder = () => async (dispatch, getState) => {
  dispatch(createOrderStart());
  try {
    const state = getState();
    const earnNo = getCookie('earn_no') || '';
    const paymentMethod = state.payment.paymentMethod || '';

    const { cart } = state.cart;
    let billingAddress = {};

    if (isEmpty(paymentMethod)) {
      return;
    }

    if (!isEmpty(cart.billing_address)) {
      billingAddress = cart.billing_address;
    }

    let transfromMethod;
    const transfromExtension = new PaymentMethodModel();

    if (paymentMethod === 'p2c2p_123') {
      const extensionAttr = state.payment.extension;
      transfromMethod = transfromExtension.setPay123(
        paymentMethod,
        extensionAttr,
        earnNo,
        cart,
      );
    } else if (paymentMethod === 'p2c2p_ipp') {
      const extensionAttr = state.payment.extension;
      transfromMethod = transfromExtension.setPayIPP(
        paymentMethod,
        extensionAttr,
        earnNo,
      );
    } else {
      const extensionAttr = state.payment.extension;
      if (!isEmpty(extensionAttr)) {
        if (get(extensionAttr, 'payment_ontop')) {
          transfromMethod = transfromExtension.setOntop(
            paymentMethod,
            extensionAttr,
            earnNo,
          );
        } else {
          transfromMethod = transfromExtension.setEwallet(
            paymentMethod,
            extensionAttr,
            earnNo,
          );
        }
      } else {
        transfromMethod = transfromExtension.setPayOther(paymentMethod, earnNo);
      }
    }

    const response = await service.post(`/checkout/createOrder`, {
      cartId: cart.id,
      email: billingAddress.email,
      paymentMethod: transfromMethod,
      billingAddress: billingAddress,
    });

    if (!isEmpty(earnNo)) {
      unsetCookie('earn_no');
    }

    if (
      paymentMethod === 'fullpaymentredirect' ||
      paymentMethod === 'p2c2p_ipp' ||
      paymentMethod === 'p2c2p_123'
    ) {
      return (window.location.href = response.order);
    }

    let order;
    if (!isEmpty(response)) {
      order = await dispatch(fetchOrderById(response.order));
    }

    dispatch(createOrderStop());

    return (window.location.href = `/checkout/completed/${order.increment_id}`);
  } catch (e) {
    dispatch(createOrderStop());

    if (get(e, 'response.data.message')) {
      // alert(get(e, 'response.data.message', 'System Error.'));
      dispatch(onError(get(e, 'response.data.message', 'System.Error.')));
    }
    return e;
  }
};

export function startEstimateShippingMethods() {
  return {
    type: types.ESTIMATE_SHIPPING_METHODS,
  };
}

export function shippingInfoUpdating() {
  return {
    type: types.SAVE_SHIPPING_INFO,
  };
}

export function shippingInfoUpdated() {
  return {
    type: types.SAVE_SHIPPING_INFO_SUCCESS,
  };
}

export function setDeliveryOption(value) {
  return {
    type: types.SET_DELIVERY_OPTION,
    payload: { deliveryOption: value },
  };
}

export function setShippingAddress(address) {
  return {
    type: types.SET_SHIPPING_ADDRESS,
    payload: { address },
  };
}

export function setBillingAddress(address) {
  return {
    type: types.SET_BILLING_ADDRESS,
    payload: { address },
  };
}

export function setActiveShippingMethods(shippingMethods) {
  return {
    type: types.SET_ACTIVE_SHIPPING_METHODS,
    payload: { shippingMethods },
  };
}

export function setCurrentShippingMethod(shippingMethod) {
  return {
    type: types.SET_CURRENT_SHIPPING_METHOD,
    payload: {
      shippingMethod,
    },
  };
}

export function setPickupLocation(location) {
  return {
    type: types.SET_PICKUP_LOCATION,
    payload: { location },
  };
}
export const toggleFullTaxInvoiceMember = () => async (dispatch, getState) => {
  await dispatch(toggleFullTaxInvoice());
  const state = getState();
  const {
    checkout: { isFullTaxInvoice, shippingAddress },
  } = state;
  const defaultBilling = selectDefaultBillingAddress(state);
  let address = defaultBilling ? defaultBilling : null;

  if (address && isFullTaxInvoice) {
    const { custom_attributes, vat_id } = address;
    const fullTaxType = custom_attributes.find(
      val => val.attribute_code === 'full_tax_type',
    );
    const billingType = get(fullTaxType, 'value');
    let validVatID = true;
    if (vat_id) {
      if (billingType === 'personal') {
        validVatID = validateIdCard(vat_id);
      } else if (billingType === 'company') {
        validVatID = validateTaxId(vat_id);

        // checking brand ID
        const branch = custom_attributes.find(
          val => val.attribute_code === 'branch_id',
        );
        const brandId = get(branch, 'value');
        if (validVatID) {
          validVatID = validateBranchId(brandId);
        }
      }

      if (!validVatID) {
        address = null;
      }
    } else {
      address = null;
    }
  } else if (address === null && !isFullTaxInvoice) {
    address = shippingAddress;
  }

  if (address) {
    const shippingAddressValid = checkAddressLineValid(address);
    if (!shippingAddressValid) address = null;
  }

  dispatch(saveBillingInfo(address));
};
export function toggleFullTaxInvoice() {
  return {
    type: types.TOGGLE_FULL_TAX_INVOICE,
  };
}

export function toggleSelfPickup() {
  return {
    type: types.TOGGLE_SELF_PICKUP,
  };
}

export function createOrderStart() {
  return {
    type: types.CREATE_ORDER_START,
  };
}

export function createOrderStop() {
  return {
    type: types.CREATE_ORDER_STOP,
  };
}

export function onError(error) {
  return {
    type: types.API_ERROR,
    error,
  };
}

export function requiredPhone() {
  return {
    type: types.REQUIRED_PHONE_NO,
  };
}

export function notRequiredPhone() {
  return {
    type: types.NOT_REQUIRED_PHONE_NO,
  };
}

export function setAvailableShippingMethod(method) {
  return {
    type: types.SET_AVAILABLE_SHIPPING_METHOD,
    payload: { method },
  };
}
export function clearShippingMethod() {
  return {
    type: types.CLEAR_SHIPPING_METHOD,
  };
}
export function clearErrorsT1cEarnApply() {
  return {
    type: types.ADD_EARN_T1C_APPLY,
  };
}
export function setErrorsT1cEarnApply() {
  return {
    type: types.CHANGE_EARN_T1C_APPLY,
  };
}
