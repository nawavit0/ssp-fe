import React from 'react';
import LayoutCheckout from '../../../components/LayoutCheckout';
import OrderComplete from './OrderComplete';
import { setActiveStoreConfig } from '../../../reducers/storeConfig/actions';

const title = 'Order Complete';

async function action(context, params) {
  const { store, customer } = context;
  const { dispatch } = store;
  await dispatch(setActiveStoreConfig({ code: customer.mdcStoreCode || '' }));

  return {
    chunks: ['order-complete'],
    title,
    component: (
      <LayoutCheckout>
        <OrderComplete {...params} />
      </LayoutCheckout>
    ),
  };
}

export default action;
