//@flow

import OrderProductModel from './OrderProductModel';

export default class OrderModel {
  increment_id: string;
  created_at: string;
  grand_total: number;
  status: string;
  items: Array<OrderProductModel>;
  order_currency_code: string;

  constructor(
    increment_id: string,
    created_at: string,
    grand_total: number,
    status: string,
    items: Array<OrderProductModel>,
    order_currency_code: string,
  ) {
    this.increment_id = increment_id;
    this.created_at = created_at;
    this.grand_total = grand_total;
    this.status = status;
    this.items = items;
    this.order_currency_code = order_currency_code;
  }
}
