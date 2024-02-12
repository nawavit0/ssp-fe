import * as selector from '../../../src/reducers/checkout/selectors';

describe('getPickupLocation', () => {
  // sample data
  const state = sampleState();

  test('getAvailableShippingMethods', () => {
    const result = selector.getAvailableShippingMethods(state);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(
      expect.objectContaining({
        carrier_code: 'central',
        method_code: 'same_day',
      }),
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        carrier_code: 'central',
        method_code: 'standard',
      }),
    );
  });

  test('getPickupMethod', () => {
    const result = selector.getPickupMethod(state);
    expect(result).toEqual(
      expect.objectContaining({
        method_code: 'pickupatstore',
        carrier_code: 'pickupatstore',
      }),
    );
  });

  test('getStoreLocations', () => {
    const result = selector.getStoreLocations(state);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: '810',
        code: 'central_world',
      }),
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        id: '812',
        code: 'central-chidlom-TH',
      }),
    );
  });

  test('getSkyboxLocations', () => {
    const result = selector.getSkyboxLocations(state);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: '811',
        code: 'familymart_silom',
      }),
    );
  });

  test('getPickupAddress with member logged-in', () => {
    // sample state
    const location =
      state.checkout.shippingMethods[2].extension_attributes
        .pickup_locations[0];

    const currentState = {
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
      },
    };
    const result = selector.getPickupAddress(currentState);
    expect(result).toEqual({
      address_name: 'Central World',
      address_line: 'address_line',
      postcode: '12345',
      firstname: 'foo',
      lastname: 'test',
      email: 'a@b.cc',
      telephone: '0987654321',
      subdistrict: 'Don Mueang',
      subdistrict_id: '77',
      district: 'Don Mueang',
      district_id: '15',
      region_id: '570',
      region_name: 'Bangkok',
    });
  });

  function sampleState() {
    return {
      checkout: {
        shippingMethods: [
          {
            carrier_code: 'central',
            method_code: 'same_day',
            carrier_title: 'CDS',
            method_title: 'มาตรฐาน (xxจัดส่งใน 2-3 วัน)',
            amount: 90,
            base_amount: 90,
            available: true,
            error_message: '',
            price_excl_tax: 90,
            price_incl_tax: 90,
          },
          {
            carrier_code: 'central',
            method_code: 'standard',
            carrier_title: 'CDS',
            method_title: 'จัดส่งฟรี',
            amount: 90,
            base_amount: 90,
            available: true,
            error_message: '',
            price_excl_tax: 90,
            price_incl_tax: 90,
          },
          {
            carrier_code: 'pickupatstore',
            method_code: 'pickupatstore',
            carrier_title: 'Store Pickup',
            method_title: 'Central World',
            amount: 0,
            base_amount: 0,
            available: true,
            extension_attributes: {
              pickup_locations: [
                {
                  id: '810',
                  code: 'central_world',
                  name: 'Central World',
                  address_line1: 'address_line',
                  district: 'Bangkok',
                  province: 'bkk',
                  region_id: '570',
                  postal_code: '12345',
                  lat: '13.7482299',
                  long: '100.5412388',
                  description: 'test desc',
                  opening_hours: [],
                  store_type: {
                    id: 1,
                    name: 'Store',
                    description: 'Pickup Fee ฿80 Free for Order ฿699 or more.',
                    store_ids: null,
                  },
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
                },
                {
                  id: '811',
                  code: 'familymart_silom',
                  name: 'FamiliyMart Silom',
                  address_line1: 'Residence inn Marriott',
                  address_line2: '1775 Andover st.',
                  district: 'Tewksbury',
                  province: 'bkk',
                  region_id: '570',
                  postal_code: '01876',
                  email: 'ctorobot3@gmail.com',
                  telephone: '9084023938',
                  lat: '13.7221214',
                  long: '100.5203935',
                  description: 'Pickup Fee ฿80 Free for Order ฿699 or more.',
                  pickup_fee: '80',
                  opening_hours: [],
                  store_type: {
                    id: 2,
                    name: 'Family Mart',
                    description: 'Pickup Fee ฿80 Free for Order ฿699 or more.',
                    store_ids: null,
                  },
                  extension_attributes: {
                    additional_address_info: {
                      subdistrict: 'Bang Bamru',
                      subdistrict_id: '127',
                      district: 'Bang Phlat',
                      district_id: '32',
                      region_id: '570',
                      region_name: 'Bangkok',
                    },
                  },
                },
                {
                  id: '812',
                  code: 'central-chidlom-TH',
                  name: 'เซ็นทรัล ชิดลม เพลินจิต',
                  address_line1: '1027 ถนน เพลินจิต',
                  district: 'กรุงเทพมหานคร',
                  province: 'bkk',
                  region_id: '570',
                  postal_code: '10330',
                  lat: '13.744599',
                  long: '100.544509',
                  opening_hours: [],
                  store_type: {
                    id: 1,
                    name: 'Store',
                    description: 'Pickup Fee ฿80 Free for Order ฿699 or more.',
                    store_ids: null,
                  },
                  extension_attributes: {
                    additional_address_info: {
                      subdistrict: 'Makkasan',
                      subdistrict_id: '180',
                      district: 'Ratchathewi',
                      district_id: '44',
                      region_id: '570',
                      region_name: 'Bangkok',
                    },
                  },
                },
              ],
            },
            error_message: '',
            price_excl_tax: 0,
            price_incl_tax: 0,
          },
        ],
      },
    };
  }
});
