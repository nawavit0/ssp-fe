import React from 'react';
import AccountProfile from './AccountProfile';

const title = 'Account Profile';

function action(context) {
  const { deviceDetect } = context;
  const { isMobile } = deviceDetect;
  return {
    chunks: ['account'],
    title,
    component: <AccountProfile isMobile={isMobile} />,
  };
}

export default action;
