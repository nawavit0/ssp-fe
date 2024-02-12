import React from 'react';
import Payment from './Payment';
import LayoutCheckout from '../../components/LayoutCheckout';
import { get } from 'lodash';
import { fetchCustomer } from '../../reducers/customer/actions';

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
  const canNotCheckOut = get(customer, 'id')
    ? false
    : !get(customer, 'guest.cartId');

  return {
    title: 'Payment',
    chunks: ['payment'],
    component: (
      <LayoutCheckout>
        <Payment />
      </LayoutCheckout>
    ),
    guard: {
      condition: canNotCheckOut,
      redirect: '/',
    },
  };
}

export default action;
