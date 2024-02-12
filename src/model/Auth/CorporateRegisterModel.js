//@flow
import { RegisterModel } from './RegisterModel';

export default class CorporateRegisterModel extends RegisterModel {
  companyName: string;
  telephone: string;
  email: string;
  password: string;
  taxNo: string;

  constructor(
    companyName: ?string | object,
    telephone: ?string,
    email: ?string,
    password: ?string,
    taxNo: ?string,
  ) {
    super();
    if (typeof companyName === 'object') {
      this.companyName = companyName.companyName;
      this.telephone = companyName.telephone;
      this.email = companyName.email;
      this.password = companyName.password;
      this.taxNo = companyName.taxNo;
    } else {
      this.companyName = companyName || '';
      this.telephone = telephone || '';
      this.email = email || '';
      this.password = password || '';
      this.taxNo = taxNo || '';
    }
  }
}
