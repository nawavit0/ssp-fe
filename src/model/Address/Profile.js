import { createCustomAttributes } from '../../utils/customAttributes';
export default class ProfileModel {
  constructor({
    firstname = '',
    lastname = '',
    phone = '',
    gender = '',
    email = '',
    dob = '',
    language = '',
    subscribe = '',
  } = {}) {
    this.gender = gender;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.email = email;
    this.dob = dob;
    this.language = language;
    this.subscribe = subscribe;
  }

  createCustomAttr() {
    const newData = createCustomAttributes(this, [
      'gender',
      'firstname',
      'lastname',
      'phone',
      'email',
      'dob',
      'language',
      'subscribe',
    ]);
    this.custom_attributes = newData.custom_attributes;
  }
}
