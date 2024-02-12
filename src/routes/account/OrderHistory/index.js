import React from 'react';
import OrderHistory from './OrderHistory';
import { get } from 'lodash';
import { fetchCustomer } from '../../../reducers/customer/actions';

const title = 'Order History';

async function action(context) {
  const { customer, deviceDetect, store } = context;
  const { dispatch } = store;
  const userToken = customer?.userToken || '';
  if (get(customer, 'id') && userToken) {
    await dispatch(
      fetchCustomer(userToken, {
        currentDevice: deviceDetect.checkoutDevice,
      }),
    );
  }
  return {
    chunks: ['account'],
    title,
    component: <OrderHistory />,
  };
}

export default action;
