import React from 'react';
import OrderDetail from './OrderDetail';

const title = 'Order Detail';

function action(context, params) {
  return {
    chunks: ['account'],
    title,
    component: <OrderDetail {...params} />,
  };
}

export default action;
