import { get as prop, omit } from 'lodash';
export default class ShippingInfo {
  constructor() {
    this.addressInformation = {
      shipping_address: {},
      billing_address: {},
      shipping_method_code: '',
      shipping_carrier_code: '',
    };
  }

  setShipppingAddress(address) {
    const addressData = omit(address, 'id');
    this.addressInformation.shipping_address = {
      ...addressData,
      region: prop(address, 'region.region', ''),
      region_code: prop(address, 'region.region_code', ''),
      region_id: prop(address, 'region.region_id', ''),
    };
  }

  setBillingAddress(address) {
    const addressData = omit(address, 'id');
    this.addressInformation.billing_address = {
      ...addressData,
      region: prop(address, 'region.region', ''),
      region_code: prop(address, 'region.region_code', ''),
      region_id: prop(address, 'region.region_id', ''),
    };
  }

  setShippingMethod(carierCode, methodCode) {
    this.addressInformation.shipping_carrier_code = carierCode;
    this.addressInformation.shipping_method_code = methodCode;
  }
}
