import AddressType from './AddressType';
import { createCustomAttributes } from '../../utils/customAttributes';
export default class AddressModel {
  constructor({
    id = '',
    address_name = '',
    customer_id = '',
    country_id = 'TH',
    company = '',
    customer_address_type = AddressType.SHIPPING,
    city = 'n/a',
    street = ['n/a'],
    firstname = '',
    lastname = '',
    telephone = '',
    email = '',
    building = '',
    address_line = '',
    postcode = '',
    region_id = '',
    region = 'n/a',
    district = '',
    district_id = '',
    subdistrict = '',
    subdistrict_id = '',
    default_billing = false,
    default_shipping = false,
    remark = '',
    vat_id = '',
    billing_type = 'personal',
    branch_id = '',
    full_tax_request = 0,
    full_tax_type = 'personal',
  } = {}) {
    this.address_id = id;
    this.address_name = address_name;
    this.customer_id = customer_id;
    this.country_id = country_id;
    this.company = company;
    this.customer_address_type = customer_address_type;
    this.city = city;
    this.street = street;
    this.firstname = firstname;
    this.lastname = lastname;
    this.telephone = telephone;
    this.email = email;
    this.building = building;
    this.address_line = address_line;
    this.postcode = postcode;
    this.region_id = region_id;
    this.region_name = region.region;
    this.region = region;
    this.district = district;
    this.district_id = district_id;
    this.subdistrict = subdistrict;
    this.subdistrict_id = subdistrict_id;
    this.default_billing = default_billing;
    this.default_shipping = default_shipping;
    this.remark = remark;
    this.vat_id = vat_id;
    this.billing_type = billing_type;
    this.branch_id = branch_id;
    this.full_tax_request = full_tax_request;
    this.full_tax_type = full_tax_type;
  }

  createCustomAttr() {
    const newData = createCustomAttributes(this, [
      'address_name',
      'address_line',
      'district',
      'district_id',
      'subdistrict',
      'subdistrict_id',
      'customer_address_type',
      'branch_id',
      'building',
      'full_tax_request',
      'full_tax_type',
    ]);
    this.custom_attributes = newData.custom_attributes;
  }
}
