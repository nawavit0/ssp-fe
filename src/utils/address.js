import { get as prop } from 'lodash';
import { explode } from './customAttributes';
import AddressModel from '../model/Address/AddressModel';

export const addressStringBuilder = address => {
  const explodeAddress = explode(address);
  const line = prop(explodeAddress, 'address_line', '');
  const building = prop(explodeAddress, 'building', '');
  const district = prop(explodeAddress, 'district', '');
  const subDistrict = prop(explodeAddress, 'subdistrict', '');
  const city = prop(address, 'region', '');
  const postcode = prop(explodeAddress, 'postcode', '');

  return `${building ? `${building},` : ''} ${line ? `${line},` : ''} ${
    subDistrict ? `${subDistrict},` : ''
  } ${district ? `${district},` : ''} ${city || ''} ${postcode || ''}`;
};

export const addressTransformer = address => {
  return Array.isArray(address)
    ? address.map(a => toAddressModel(a))
    : toAddressModel(address);
};

const toAddressModel = magentoAddress =>
  new AddressModel(
    magentoAddress.id,
    customAttribute(magentoAddress, 'address_name'),
    magentoAddress.telephone,
    customAttribute(magentoAddress, 'address_line'),
    customAttribute(magentoAddress, 'building'),
    magentoAddress.postcode,
    magentoAddress.region,
    {
      subdistrict_id: customAttribute(magentoAddress, 'subdistrict_id'),
      subDistrict: customAttribute(magentoAddress, 'subdistrict'),
    },
    {
      district_id: customAttribute(magentoAddress, 'district_id'),
      district: customAttribute(magentoAddress, 'district'),
    },
    magentoAddress.city,
    customAttribute(magentoAddress, 'remark'),
    magentoAddress.default_billing || magentoAddress.default_shipping,
    customAttribute(magentoAddress, 'customer_address_type'),
    magentoAddress.firstname,
    magentoAddress.lastname,
  );

const customAttribute = (address, name) =>
  address.custom_attributes
    ? address.custom_attributes
        .filter(({ attribute_code }) => attribute_code === name)
        .map(item => item.value)[0]
    : null;
