//@flow

import { RegisterModel } from './RegisterModel';

export default class PersonalRegisterModel extends RegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  gender: String;
  password: string;

  constructor(
    firstName: ?string,
    lastName: ?string,
    email: ?string,
    gender: ?String,
    password: ?string,
  ) {
    super();

    if (typeof firstName === 'object') {
      this.firstName = firstName.firstName;
      this.lastName = firstName.lastName;
      this.email = firstName.email;
      this.gender = firstName.gender || 'male';
      this.password = firstName.password;
    } else {
      this.firstName = firstName || '';
      this.lastName = lastName || '';
      this.email = email || '';
      this.gender = gender || 'male';
      this.password = password || '';
    }
  }
}
