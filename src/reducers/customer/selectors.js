import { get as prop, find, filter } from 'lodash';
import addressType from '../../constants/addressType';
import { explode } from '../../utils/customAttributes';

export const getCustomer = state => prop(state, 'customer.customer');

export const getCustomerAddresses = state => {
  return prop(state, 'customer.customer.addresses', []);
};

export const selectDefaultShippingAddress = state => {
  const customer = getCustomer(state);

  if (!customer) return null;
  return find(customer.addresses, { default_shipping: true });
};

export const selectDefaultBillingAddress = state => {
  const customer = getCustomer(state);

  if (!customer) return null;
  return find(customer.addresses, { default_billing: true });
};

export const selectAddressByID = (state, id) => {
  const customer = getCustomer(state);

  if (!customer) return null;

  return find(customer.addresses, { id: Number(id) });
};

export const getCustomerBillingAddresses = state => {
  const addresses = prop(state, 'customer.customer.addresses', []);

  const addressBilling = filter(addresses, address => {
    const thisAddress = explode(address);
    return thisAddress.customer_address_type === addressType.BILLING;
  });

  return addressBilling;
};

export const getCustomerShippingAddresses = state => {
  const addresses = prop(state, 'customer.customer.addresses', []);

  const addressBilling = filter(addresses, address => {
    const thisAddress = explode(address);
    return thisAddress.customer_address_type === addressType.SHIPPING;
  });

  return addressBilling;
};
