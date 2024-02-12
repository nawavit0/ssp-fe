import React from 'react';
import OrderHistory from './OrderHistory';

const title = 'Order History';

function action() {
  return {
    chunks: ['account'],
    title,
    component: <OrderHistory />,
  };
}

export default action;
