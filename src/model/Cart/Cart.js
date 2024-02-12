//@flow
export default class CartModel {
  constructor() {
    this.id = null;
    this.items = [];
    this.items_qty = null;
    this.billing_address = {};
    this.extension_attributes = {};
  }

  initialData({ id, items, items_qty, billing_address, extension_attributes }) {
    this.id = id;
    this.items = items;
    this.items_qty = items_qty;
    this.billing_address = billing_address;
    this.extension_attributes = extension_attributes;
  }
}
