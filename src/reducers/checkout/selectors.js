import { get, filter, find, isEmpty, isUndefined, size } from 'lodash';
import { getFormValues, hasSubmitSucceeded } from 'redux-form';
import DeliveryType from '../../model/Checkout/DeliveryType';
import {
  getCartShippingAddress,
  getCartBillingAddress,
} from '../cart/selectors';

import {
  getCustomer,
  selectDefaultShippingAddress,
} from '../customer/selectors';

import { pick, merge } from 'lodash';
import {
  validateIdCard,
  validateTaxId,
  validateBranchId,
} from '../../utils/validations';

export const CDS_STORE_TYPE = 1;

export const isUserLoggedIn = state => {
  const customer = getCustomer(state);
  return !isEmpty(customer) && !!customer.id;
};

export const getAvailableShippingMethods = state => {
  const shippingMethods = get(state, 'checkout.shippingMethods', []);
  return filter(shippingMethods, m => m.available && !getLocations(m));
};

export const getPickupMethod = state => {
  const shippingMethods = get(state, 'checkout.shippingMethods', []);
  return find(shippingMethods, m => m.available && getLocations(m));
};

/**
 * check pickup_locations of shipping methods
 * @private
 */
const getLocations = method => {
  const locations = get(method, 'extension_attributes.pickup_locations');
  return locations;
};

/**
 * check if pickup_locations.pickup_fee is set
 * @private
 */
const isFreePickup = location => {
  if (!location) return false;

  const storeId = get(location, 'store_type.id');
  const fee = get(location, 'pickup_fee', 0);
  return storeId === CDS_STORE_TYPE || Number(fee) === 0;
};

export const getStoreLocations = state => {
  const method = getPickupMethod(state);
  const locations = getLocations(method);
  return filter(locations, isFreePickup);
};

export const getSkyboxLocations = state => {
  const method = getPickupMethod(state);
  const locations = getLocations(method);
  return filter(locations, m => !isFreePickup(m));
};

export const getGmapApiKey = state => {
  const method = getPickupMethod(state);
  const apiKey = get(method, 'extension_attributes.gmap_api_key');
  return apiKey;
};

export const getPickupLocation = state => {
  return get(state, 'checkout.pickupLocation');
};

export const getPickupAddress = state => {
  const location = getPickupLocation(state);
  if (!location) return null;

  const contact = getCustomerInfo(state);
  const { name, address_line1, postal_code } = location;
  const more = get(location, 'extension_attributes.additional_address_info');

  const address = {
    address_name: name,
    address_line: address_line1,
    postcode: postal_code,
    ...contact,
    ...more,
  };
  return address;
};

export const getFormShippingAddress = state => {
  // current cart shipping_assignments or default
  const {
    checkout: { shippingAddress },
  } = state;
  const defaultShipping = selectDefaultShippingAddress(state);
  const guestAddressForm = getFormValues('guestAddressForm')(state);
  const guestInfoForm = getFormValues('guestInfoForm')(state);
  return isUserLoggedIn(state)
    ? shippingAddress || defaultShipping
    : merge(guestAddressForm, guestInfoForm);
};

export const getShippingAddress = state => {
  // current cart shipping_assignments or default
  return getCartShippingAddress(state) || selectDefaultShippingAddress(state);
};

export const getCustomerInfo = state => {
  const customer = getCustomer(state);
  if (isEmpty(customer)) {
    return getGuestInfo(state);
  }
  const address = getShippingAddress(state);
  const phone = find(get(customer, 'custom_attributes'), {
    attribute_code: 'phone',
  });
  const contact = {
    telephone: !isEmpty(get(phone, 'value')) ? get(phone, 'value') : 'n/a', // hotfixes - billing phone is required
    ...address,
    ...customer, // customer has no telephone
  };
  return pick(contact, ['firstname', 'lastname', 'email', 'telephone']);
};

export const getGuestInfo = state => getFormValues('guestInfoForm')(state);

export const getPickerInfo = state => getFormValues('collectorInfoForm')(state);

export const isFulltagBillingSuccess = state =>
  hasSubmitSucceeded('guestBillingAddressForm')(state);

export const getGuestFullTagBillingAddress = state =>
  getFormValues('guestBillingAddressForm')(state);

export const getIsFullTagEnable = state => {
  return get(state, 'checkout.isFullTaxInvoice');
};

export const canContinueToPay = state => {
  const {
    checkout: {
      pickupLocation,
      currentShippingMethod,
      deliveryOption,
      loading,
      isSelfPickup,
      errorsValidateT1c,
      isFullTaxInvoice,
      billingAddress,
    },
    form,
  } = state;
  const { guestAddressForm, guestBillingAddressForm } = form;

  const isMember = isUserLoggedIn(state);
  if (!deliveryOption || loading) return false;
  if (isFullTaxInvoice) {
    let fullTaxType = null;
    let vatId = null;
    let branchID = null;
    if (isMember) {
      if (size(billingAddress) === 0) return false;
      const { custom_attributes } = billingAddress;
      const addressLine = custom_attributes.find(
        attr => attr.attribute_code === 'address_line',
      );
      const addressLineValue = get(addressLine, 'value');
      if (
        isUndefined(addressLineValue) ||
        addressLineValue === '' ||
        addressLineValue === ' ' ||
        (size(addressLineValue) > 0 && addressLineValue[0] === ' ')
      ) {
        return false;
      }

      // get full tax type
      const fieldTaxType = custom_attributes.find(
        attr => attr.attribute_code === 'full_tax_type',
      );
      fullTaxType = get(fieldTaxType, 'value');
      vatId = get(billingAddress, 'vat_id');

      // checking brand ID
      const branch = custom_attributes.find(
        val => val.attribute_code === 'branch_id',
      );
      branchID = get(branch, 'value');
    } else {
      fullTaxType = get(guestBillingAddressForm, 'values.full_tax_type');
      vatId = get(guestBillingAddressForm, 'values.vat_id');
      branchID = get(guestBillingAddressForm, 'values.branch_id');
    }

    let addressValid;
    if (isFullTaxInvoice && fullTaxType && vatId) {
      if (fullTaxType === 'company') {
        addressValid = validateTaxId(vatId);
        if (addressValid) {
          addressValid = validateBranchId(branchID);
        }
      } else {
        addressValid = validateIdCard(vatId);
      }

      if (!addressValid) {
        return false;
      }
    }
  }

  if (
    (guestAddressForm && get(guestAddressForm, 'syncErrors')) ||
    (guestBillingAddressForm && get(guestBillingAddressForm, 'syncErrors'))
  ) {
    if (!pickupLocation) {
      return false;
    }
  }

  switch (deliveryOption) {
    case DeliveryType.ShipToAddress:
      return !!(
        !errorsValidateT1c &&
        !get(form, 'guestInfoForm.syncErrors') &&
        currentShippingMethod
      );
    case DeliveryType.PickupAtStore:
      if (isSelfPickup) {
        return !!(
          !errorsValidateT1c &&
          !get(form, 'guestInfoForm.syncErrors') &&
          pickupLocation
        );
      }
      return !!(
        !get(form, 'collectorInfoForm.syncErrors') &&
        !errorsValidateT1c &&
        !get(form, 'guestInfoForm.syncErrors') &&
        pickupLocation
      );
    case DeliveryType.PickupAtSkyBox:
      if (isSelfPickup) {
        return !!(
          !errorsValidateT1c &&
          !get(form, 'guestInfoForm.syncErrors') &&
          pickupLocation
        );
      }
      return !!(
        !get(form, 'collectorInfoForm.syncErrors') &&
        !errorsValidateT1c &&
        !get(form, 'guestInfoForm.syncErrors') &&
        pickupLocation
      );
    default:
      return !!(
        !errorsValidateT1c &&
        !get(form, 'guestInfoForm.syncErrors') &&
        pickupLocation
      );
  }
};

export const hasCompletedShipping = state => {
  const {
    checkout: {
      currentShippingMethod,
      deliveryOption,
      loading,
      pickupLocation,
    },
  } = state;

  if (!deliveryOption || loading) return false;

  const billing = getCartBillingAddress(state);
  const shipping = getCartShippingAddress(state);

  if (deliveryOption === DeliveryType.ShipToAddress) {
    return !isEmpty(billing) && !isEmpty(shipping) && !!currentShippingMethod;
  }
  // pickupAtStore || FamilyMart
  return !isEmpty(billing) && !isEmpty(pickupLocation);
};

export const getIsDeliveryAvailable = state => {
  const availableMethods = get(state, 'checkout.availableMethods', []);
  return find(availableMethods, m => m.available && !getLocations(m));
};

export const getIsPickAtStoreAvailable = state => {
  const availableMethods = get(state, 'checkout.availableMethods', []);
  return find(availableMethods, m => m.available && getLocations(m));
};

export const getCheckoutInitial = state => {
  return get(state, 'checkout.initialed');
};
