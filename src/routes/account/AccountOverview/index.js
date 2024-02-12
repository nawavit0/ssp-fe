import React from 'react';
import AccountOverview from './AccountOverview';

const title = 'Account Overview';

function action() {
  return {
    chunks: ['account'],
    title,
    component: <AccountOverview />,
  };
}

export default action;
