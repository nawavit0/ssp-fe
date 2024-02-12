//@flow
export class LoginModel {
  email: string;
  password: string;
  remember: boolean;

  constructor(email: string, password: string, remember: boolean) {
    this.email = email;
    this.password = password;
    this.remember = remember;
  }
}
