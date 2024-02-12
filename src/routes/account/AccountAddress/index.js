import React from 'react';
import AccountAddress from './AccountAddress';

const title = 'Account Address';

function action({ deviceDetect }) {
  return {
    chunks: ['account'],
    title,
    component: <AccountAddress isMobile={deviceDetect?.isMobile} />,
  };
}

export default action;
