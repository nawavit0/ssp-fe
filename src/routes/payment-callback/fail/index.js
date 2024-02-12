import React from 'react';
import LayoutCheckout from '../../../components/LayoutCheckout';
import OrderFail from './OrderFail';

const title = 'Order Fail';

function action(context, params) {
  return {
    chunks: ['order-fail'],
    title,
    component: (
      <LayoutCheckout>
        <OrderFail {...params} />
      </LayoutCheckout>
    ),
  };
}

export default action;
