import reducer from '../../../src/reducers/checkout';
import {
  setActiveShippingMethods,
  setCurrentShippingMethod,
  setPickupLocation,
  setShippingAddress,
  setBillingAddress,
  toggleFullTaxInvoice,
  toggleSelfPickup,
} from '../../../src/reducers/checkout/actions';
import DeliveryType from '../../../src/model/Checkout/DeliveryType';

describe('checkout', () => {
  const methods = [
    { carrier_code: 'foo', method_code: 'free' },
    { carrier_code: 'foo', method_code: 'premium' },
  ];
  let initialState;

  beforeEach(() => {
    initialState = reducer(undefined, { type: 'ANY' });
  });

  test('initial values', () => {
    expect(initialState.billingAddress).toBeNull();
    expect(initialState.shippingAddress).toBeNull();
    expect(initialState.currentShippingMethod).toBeNull();
    expect(initialState.shippingMethods).toBeTruthy();
  });

  test('setActiveShippingMethods', () => {
    const action = setActiveShippingMethods(methods);
    const state = reducer(initialState, action);

    expect(state.shippingMethods).toEqual(methods);
    expect(state.loading).toBe(false);
  });

  test('setPickupLocation', () => {
    const location = { id: 777 };
    const action = setPickupLocation(location);
    const state = reducer(initialState, action);

    expect(state.pickupLocation).toEqual(location);
  });

  test('setCurrentShippingMethod', () => {
    const expected = methods[1];
    const action = setCurrentShippingMethod(expected);
    const state = reducer(initialState, action);

    expect(state.currentShippingMethod).toEqual(expected);
  });

  test('keep current when activeMethods remain unchanged', () => {
    const current = methods[1];
    const prevState = {
      ...initialState,
      deliveryOption: DeliveryType.ShipToAddress,
      currentShippingMethod: current,
    };
    //when update with new Array, same values
    const updatedMethods = [...methods];
    const state = reducer(prevState, setActiveShippingMethods(updatedMethods));
    //then current should remain unchanged
    expect(state.currentShippingMethod).toEqual(current);
  });

  test('reset when activeMethods changed', () => {
    const current = methods[0]; // free
    const prevState = {
      ...initialState,
      deliveryOption: DeliveryType.ShipToAddress,
      currentShippingMethod: current,
    };
    //when update with new values
    const updatedMethods = methods.slice(1);
    const state = reducer(prevState, setActiveShippingMethods(updatedMethods));
    //then current should be reset
    expect(state.currentShippingMethod).not.toBeDefined();
  });

  test('setShippingAddress when billingAddress is null', () => {
    const address = { country_id: 'TH', region_id: 123 };
    const state = reducer(initialState, setShippingAddress(address));

    expect(state.shippingAddress).toEqual(address);
    expect(state.billingAddress).toEqual(address);
  });

  test('setShippingAddress when billingAddress is set', () => {
    const billingAddress = { country_id: 'TH', region_id: 777 };
    const prevState = { ...initialState, billingAddress };

    const address = { country_id: 'TH', region_id: 123 };
    const state = reducer(prevState, setShippingAddress(address));

    expect(state.shippingAddress).toEqual(address);
    expect(state.billingAddress).toEqual(billingAddress);
  });

  test('setBillingAddress', () => {
    const address = { country_id: 'TH', region_id: 777 };
    const state = reducer(initialState, setBillingAddress(address));
    expect(state.billingAddress).toEqual(address);
  });

  test('toggleFullTaxInvoice', () => {
    const state = reducer(initialState, toggleFullTaxInvoice());
    expect(state.isFullTaxInvoice).toBeTruthy();

    const next = reducer(state, toggleFullTaxInvoice());
    expect(next.isFullTaxInvoice).toBeFalsy();
  });

  test('isSelfPickup', () => {
    expect(initialState.isSelfPickup).toBe(true);

    const state = reducer(initialState, toggleSelfPickup());
    expect(state.isSelfPickup).toBeFalsy();

    const next = reducer(state, toggleSelfPickup());
    expect(next.isSelfPickup).toBeTruthy();
  });
});
