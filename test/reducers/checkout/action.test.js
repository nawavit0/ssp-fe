import * as actions from '../../../src/reducers/checkout/actions';
import * as cartActions from '../../../src/reducers/cart/actions';
// import * as tagActions from '../../../src/reducers/googleTag/actions';
import service from '../../../src/ApiService';
import DeliveryType from '../../../src/model/Checkout/DeliveryType';
// import TagType from '../../../src/constants/gtmType';
import { getFormValues } from 'redux-form';

// external dependencies
jest.mock('redux-form');
jest.mock('../../../src/ApiService');

const {
  beginCheckout,
  estimateGuestShipment,
  estimateMemberShipment,
  submitGuestAddress,
  savePickupInfo,
  saveShippingInfo,
  selectDeliveryOption,
  setDeliveryOption,
  setShippingAddress,
  setBillingAddress,
  setActiveShippingMethods,
  shippingInfoUpdating,
  shippingInfoUpdated,
} = actions;

describe('beginCheckout', () => {
  let dispatch, getState;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(cartActions, 'fetchCart');
    // jest.spyOn(tagActions, 'googleTagDataLayer');
    dispatch = jest.fn();
    getState = jest.fn();
  });

  test('calls fetchCart if not exists', async () => {
    getState.mockReturnValue({
      cart: {},
      checkout: {},
    });

    const action = beginCheckout();
    await action(dispatch, getState);

    expect(cartActions.fetchCart).toHaveBeenCalled();
    // expect(tagActions.googleTagDataLayer).toHaveBeenCalledWith(
    //   TagType.CHECKOUT,
    // );
  });

  test('skip fetchCart if already done', async () => {
    getState.mockReturnValue({
      cart: {
        cart: { id: 123 },
      },
      checkout: {},
    });

    const action = beginCheckout();
    await action(dispatch, getState);

    expect(cartActions.fetchCart).not.toHaveBeenCalled();
  });
});

describe('selectDeliveryOption', () => {
  const shippingMethods = [{ carrier_code: 'test', method_code: 'standard' }];
  let dispatch, getState;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    getState = jest.fn();
    dispatch = jest.fn(action => {
      if (typeof action === 'function') {
        action(dispatch, getState);
      }
    });
    service.post.mockResolvedValue({ shippingMethods });
  });

  test('ShipToAddress with default address', async () => {
    const address = { region_id: 777, postcode: 10110 };
    getState.mockReturnValue({
      checkout: {
        currentShippingMethod: shippingMethods[0],
        shippingAddress: address,
        billingAddress: address,
      },
    });

    const action = actions.selectDeliveryOption(DeliveryType.ShipToAddress);
    await action(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      setDeliveryOption(DeliveryType.ShipToAddress),
    );
    expect(service.post).toHaveBeenCalledWith(
      '/cart/estimate-shipping-methods',
      {
        address: expect.objectContaining(address),
      },
    );
    expect(dispatch).toHaveBeenCalledWith(
      setActiveShippingMethods(shippingMethods),
    );
  });

  test('with customer default addresses', async () => {
    const address1 = { id: 1, default_shipping: true };
    const address2 = { id: 2, default_billing: true };

    getState.mockReturnValue({
      customer: {
        customer: {
          addresses: [address1, address2],
        },
      },
      cart: {
        cart: { id: 123 },
      },
      checkout: {},
    });

    const action = actions.selectDeliveryOption(DeliveryType.ShipToAddress);
    await action(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      setShippingAddress(expect.objectContaining(address1)),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setBillingAddress(expect.objectContaining(address2)),
    );
  });

  test('when shippingMethods is not set', async () => {
    getState.mockReturnValue({
      checkout: {
        shippingMethods: undefined,
      },
    });

    const action = actions.selectDeliveryOption(DeliveryType.PickupAtStore);
    await action(dispatch, getState);

    expect(service.post).toHaveBeenCalledWith(
      '/cart/estimate-shipping-methods',
      {
        address: expect.objectContaining({ country_id: 'TH' }),
      },
    );
    expect(dispatch).toHaveBeenCalledWith(
      setDeliveryOption(DeliveryType.PickupAtStore),
    );
    // NO ShippingAddress when choosed Pickup
    expect(dispatch).not.toHaveBeenCalledWith(
      setShippingAddress(expect.any(Object)),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setActiveShippingMethods(shippingMethods),
    );
  });

  test('when shippingMethods is set and select Pickup option', async () => {
    getState.mockReturnValue({
      checkout: {
        shippingMethods: [{ carrier_code: 'test' }],
      },
    });
    const action = selectDeliveryOption(DeliveryType.PickupAtSkyBox);
    await action(dispatch, getState);

    expect(service.post).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      setDeliveryOption(DeliveryType.PickupAtSkyBox),
    );
  });
});

describe('estimateGuestShipment', () => {
  const shippingMethods = [{ carrier_code: 'test', method_code: 'standard' }];
  let dispatch, getState;

  afterEach(jest.clearAllMocks);
  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
  });

  test('when postcode is NOT completed', () => {
    const action = estimateGuestShipment('1234');
    action(dispatch, getState);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('when postcode is completed', async () => {
    // mock redux-form values
    const address = { postcode: '55555', region_id: 555 };
    getFormValues.mockReturnValue(() => address);
    // mock service response
    service.post.mockResolvedValue({ shippingMethods });
    // await action
    const action = estimateGuestShipment(address.postcode);
    await action(dispatch, getState);

    expect(getState).toHaveBeenCalled();
    expect(getFormValues).toHaveBeenCalledWith('guestAddressForm');
    expect(service.post).toHaveBeenCalledWith(
      `/cart/estimate-shipping-methods`,
      { address: expect.objectContaining(address) },
    );
    expect(dispatch).toHaveBeenCalledWith(
      setActiveShippingMethods(shippingMethods),
    );
  });
});

describe('estimateMemberShipment', () => {
  const dispatch = jest.fn();
  const getState = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('dispatch setShippingAddress', async () => {
    const address = { country_id: 'TH', postcode: '55555' };
    // mock service response
    const shippingMethods = [{ carrier_code: 'test', method_code: 'standard' }];
    service.post.mockResolvedValue({ shippingMethods });
    // mock current state
    getState.mockReturnValue({
      checkout: {
        currentShippingMethod: shippingMethods[0],
        shippingAddress: address,
        billingAddress: address,
      },
    });
    // await action
    const action = estimateMemberShipment(address);
    await action(dispatch, getState);

    expect(service.post).toHaveBeenCalledWith(
      '/cart/estimate-shipping-methods',
      {
        address: expect.objectContaining({
          custom_attributes: expect.any(Array),
        }),
      },
    );
    expect(dispatch).toHaveBeenCalledWith(
      setShippingAddress(expect.objectContaining(address)),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setActiveShippingMethods(shippingMethods),
    );
    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdating());
    expect(service.post).toHaveBeenCalledWith(
      `/checkout/shipping-information`,
      {
        addressInformation: {
          billing_address: expect.objectContaining(address),
          shipping_address: expect.objectContaining(address),
          shipping_carrier_code: 'test',
          shipping_method_code: 'standard',
        },
      },
    );
  });
});

describe('saveShippingInfo', () => {
  const address = { region_id: 777 };
  let dispatch, getState;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    service.post.mockResolvedValue({});
  });

  test('with no currentShippingMethod', async () => {
    getState.mockReturnValue({
      checkout: {
        currentShippingMethod: null, // no shipping method
        shippingAddress: address,
        billingAddress: address,
      },
    });

    const action = saveShippingInfo();
    await action(dispatch, getState);

    expect(service.post).not.toHaveBeenCalled();
  });

  test('with completed shipping information', async () => {
    getState.mockReturnValue({
      checkout: {
        shippingAddress: address,
        billingAddress: address,
        currentShippingMethod: {
          carrier_code: 'kerry',
          method_code: 'standard',
        },
      },
    });

    const action = saveShippingInfo();
    await action(dispatch, getState);

    const addressInformation = {
      shipping_address: expect.objectContaining(address),
      billing_address: expect.objectContaining(address),
      shipping_carrier_code: 'kerry', // mocked getState
      shipping_method_code: 'standard', // mocked getState
    };

    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdating());
    expect(service.post).toHaveBeenCalledWith(
      '/checkout/shipping-information',
      { addressInformation },
    );
    expect(cartActions.fetchCart).toHaveBeenCalledWith();
    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdated());
  });
});

describe('submitGuestAddress', () => {
  let dispatch, getState;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    service.post.mockResolvedValue({});
  });

  test('calls saveShippingInfo', async () => {
    const guest = { firstname: 'far', lastname: 'foo', email: 'far@bulu.us' };
    getFormValues.mockReturnValue(() => guest);

    const address = { postcode: '55555', region_id: 555 };
    const expected = { ...guest, ...address };
    getState.mockReturnValue({
      checkout: {
        shippingAddress: address,
        billingAddress: address,
        currentShippingMethod: {
          carrier_code: 'kerry',
          method_code: 'standard',
        },
      },
    });

    const action = submitGuestAddress(address);
    await action(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(
      setShippingAddress(expect.objectContaining(expected)),
    );
    expect(dispatch).toHaveBeenCalledWith(
      setBillingAddress(expect.objectContaining(expected)),
    );
    expect(service.post).toHaveBeenCalledWith(
      '/checkout/shipping-information',
      { addressInformation: expect.any(Object) },
    );
  });
});

describe('savePickupInfo', () => {
  let dispatch, getState;

  const location = {
    id: '810',
    code: 'central_world',
    name: 'Central World',
    address_line1: 'address_line',
    postal_code: '12345',
    lat: '1',
    long: '123',
    store_type: {},
    extension_attributes: {
      additional_address_info: {
        subdistrict: 'Don Mueang',
        subdistrict_id: '77',
        district: 'Don Mueang',
        district_id: '15',
        region_id: '570',
        region_name: 'Bangkok',
      },
    },
  };

  const pickupMethod = {
    carrier_code: 'pickupatstore',
    method_code: 'pickupatstore',
    method_title: 'Central World',
    amount: 0,
    base_amount: 0,
    available: true,
    extension_attributes: {
      pickup_locations: [location],
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    getState = jest.fn();
    dispatch = jest.fn(action => {
      if (typeof action === 'function') {
        action(dispatch, getState);
      }
    });

    jest.spyOn(cartActions, 'fetchCart');
    cartActions.fetchCart.mockReturnValue(() => {});
    service.post.mockResolvedValue({});
  });

  test('with no pickupLocation', async () => {
    getState.mockReturnValue({
      checkout: {
        pickupLocation: undefined, // no current pickupLocation
        deliveryOption: DeliveryType.PickupAtStore,
      },
    });

    const action = savePickupInfo();
    await action(dispatch, getState);

    expect(service.post).not.toHaveBeenCalled();
  });

  test('with pickupLocation and isSelfPickup', async () => {
    getState.mockReturnValue({
      customer: {
        customer: {
          id: 101,
          firstname: 'foo',
          lastname: 'test',
          email: 'a@b.cc',
          telephone: '0987654321',
        },
      },
      checkout: {
        pickupLocation: location,
        isSelfPickup: true,
      },
    });

    const action = savePickupInfo();
    await action(dispatch, getState);

    const expected = {
      address_name: 'Central World',
      address_line: 'address_line',
      postcode: '12345',
      firstname: 'foo',
      lastname: 'test',
      telephone: '0987654321',
      email: 'a@b.cc',
    };

    const addressInformation = {
      shipping_address: expect.objectContaining(expected),
      billing_address: expect.objectContaining(expected),
      shipping_carrier_code: 'pickupatstore', //pickupMethod.carrier_code,
      shipping_method_code: 'pickupatstore', //pickupMethod.method_code,
      extension_attributes: {
        pickup_location_id: '810', // from current
      },
    };

    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdating());
    expect(service.post).toHaveBeenCalledWith(
      '/checkout/shipping-information',
      { addressInformation },
    );
    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdated());
  });

  test('with collectorInfoForm and not isSelfPickup', async () => {
    const picker = {
      first_name: 'picker',
      last_name: 'test',
      email: 'picker@central.tech',
      telephone: '087777777',
    };
    getState.mockReturnValue({
      customer: {
        customer: {
          id: 101,
          firstname: 'foo',
          lastname: 'test',
          email: 'a@b.cc',
          telephone: '0987654321',
        },
      },
      checkout: {
        pickupLocation: location,
        isSelfPickup: false, // should get collector info
      },
    });
    // collectorInfoForm
    getFormValues.mockReturnValue(() => picker);

    const action = savePickupInfo();
    await action(dispatch, getState);

    const address = {
      address_name: 'Central World',
      address_line: 'address_line',
      postcode: '12345',
      firstname: 'foo',
      lastname: 'test',
      telephone: '0987654321',
      email: 'a@b.cc',
    };

    const addressInformation = {
      shipping_address: expect.objectContaining(address),
      billing_address: expect.objectContaining(address),
      shipping_carrier_code: 'pickupatstore', //pickupMethod.carrier_code,
      shipping_method_code: 'pickupatstore', //pickupMethod.method_code,
      extension_attributes: {
        pickup_location_id: '810',
        picker_info: picker, //from collectorInfoForm
      },
    };

    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdating());
    expect(service.post).toHaveBeenCalledWith(
      '/checkout/shipping-information',
      { addressInformation },
    );
    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdated());
  });

  test('with currentPickupMethod and is guest', async () => {
    const guest = {
      firstname: 'guest',
      lastname: 'test',
      telephone: '01234556789',
      email: 'a@b.cc',
    };
    // guestInfoForm
    getFormValues.mockReturnValue(() => guest);
    getState.mockReturnValue({
      customer: {
        customer: {}, // not logged in
      },
      checkout: {
        pickupLocation: location,
        isSelfPickup: true,
      },
    });

    const action = savePickupInfo();
    await action(dispatch, getState);

    const expected = {
      address_name: 'Central World',
      address_line: 'address_line',
      postcode: '12345',
      firstname: 'guest',
      lastname: 'test',
      telephone: '01234556789',
      email: 'a@b.cc',
    };

    const addressInformation = {
      shipping_address: expect.objectContaining(expected),
      billing_address: expect.objectContaining(expected),
      shipping_carrier_code: pickupMethod.carrier_code,
      shipping_method_code: pickupMethod.method_code,
      extension_attributes: {
        pickup_location_id: '810',
      },
    };

    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdating());
    expect(service.post).toHaveBeenCalledWith(
      '/checkout/shipping-information',
      { addressInformation },
    );
    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdated());
  });

  test('with pickupLocation and billingAddress', async () => {
    const billingAddress = {
      postcode: '55555',
    };
    getState.mockReturnValue({
      customer: {
        customer: {
          id: 101,
          firstname: 'foo',
          lastname: 'test',
          email: 'a@b.cc',
          telephone: '0987654321',
        },
      },
      checkout: {
        pickupLocation: location,
        isSelfPickup: true,
        isFullTaxInvoice: true,
        billingAddress,
      },
    });

    const action = savePickupInfo();
    await action(dispatch, getState);

    const expected = {
      address_name: 'Central World',
      address_line: 'address_line',
      postcode: '12345',
      firstname: 'foo',
      lastname: 'test',
      telephone: '0987654321',
      email: 'a@b.cc',
    };

    const addressInformation = {
      shipping_address: expect.objectContaining(expected),
      billing_address: expect.objectContaining(billingAddress),
      shipping_carrier_code: 'pickupatstore',
      shipping_method_code: 'pickupatstore',
      extension_attributes: {
        pickup_location_id: '810', // from current
      },
    };

    expect(service.post).toHaveBeenCalledWith(
      '/checkout/shipping-information',
      { addressInformation },
    );
    expect(dispatch).toHaveBeenCalledWith(shippingInfoUpdated());
  });
});
