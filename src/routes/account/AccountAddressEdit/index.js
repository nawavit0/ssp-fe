import React from 'react';
import AccountAddressEdit from './AccountAddressEdit';

const title = 'Edit Address';

function action(context, params) {
  const addressId = params.id;

  return {
    chunks: ['account'],
    title,
    component: <AccountAddressEdit addressID={addressId} />,
  };
}

export default action;
