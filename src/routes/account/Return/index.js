import React from 'react';
import Return from './Return';

const title = 'Return';

function action(context) {
  const { deviceDetect } = context;
  let identifier = 'ACCOUNT_RETURN';
  if (deviceDetect.isMobile) {
    identifier = 'mobileWeb|ACCOUNT_RETURN';
  }

  return {
    chunks: ['account'],
    title,
    component: <Return identifier={identifier} />,
  };
}

export default action;
