import { get as prop } from 'lodash';

export const getAddress = state => {
  return prop(state, 'address', []);
};

export const getDistrict = state => {
  const address = getAddress(state);
  if (address.length > 0) return null;

  return prop(address, 'districts', []);
};

export const getSubDistrict = state => {
  const address = getAddress(state);

  if (address.length > 0) return null;

  return prop(address, 'subDistricts', []);
};
