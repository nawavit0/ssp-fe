import React from 'react';
import AccountDetail from './AccountDetail';

const title = 'Account Detail';

function action() {
  return {
    chunks: ['account'],
    title,
    component: <AccountDetail />,
  };
}

export default action;
