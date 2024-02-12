import React from 'react';
import ChangePassword from './ChangePassword';

const title = 'Change Password';

function action(context) {
  const { deviceDetect } = context;
  const { isMobile } = deviceDetect;
  return {
    chunks: ['account'],
    title,
    component: <ChangePassword isMobile={isMobile} />,
  };
}

export default action;
