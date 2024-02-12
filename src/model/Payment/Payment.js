//@flow
export default class PaymentModel {
  constructor() {
    this.payment_methods = [];
    this.totals = {};
    this.extension_attributes = {};
  }

  initialData({ payment_methods, totals, extension_attributes }) {
    this.payment_methods = payment_methods;
    this.totals = totals;
    this.extension_attributes = extension_attributes;
  }
}
