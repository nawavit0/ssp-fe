import React from 'react';
import LayoutCheckout from '../../components/LayoutCheckout';
import Checkout from './Checkout';
import { get } from 'lodash';
import { fetchCustomer } from '../../reducers/customer/actions';
// import { listAddresses } from '@central-tech/operation/dist/query/listAddresses';

const title = 'checkout';

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
    chunks: ['checkout'],
    title,
    component: (
      <LayoutCheckout>
        <Checkout
          checkoutDevice={deviceDetect?.checkoutDevice || ''}
          userToken={userToken}
          isMember={!!customer?.id}
        />
      </LayoutCheckout>
    ),
    guard: {
      condition: canNotCheckOut,
      redirect: '/',
    },
  };
}

export default action;
