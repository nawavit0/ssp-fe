//@flow
export class The1CardModel {
  email: string;
  password: string;
  point: number;
  baht: string;

  constructor(email: string, password: string, point: number, baht: string) {
    this.email = email;
    this.password = password;
    this.point = point || 0;
    this.baht = baht;
  }
}
