import React from 'react';
import FacebookCallbackDialog from './FacebookCallbackDialog';

const title = 'Log In with Facebook';

function action() {
  return {
    chunks: ['auth'], // use existing chunk or update chunk-manifest.json
    title,
    component: <FacebookCallbackDialog />,
  };
}

export default action;
