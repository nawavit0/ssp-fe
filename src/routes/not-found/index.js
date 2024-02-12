import React from 'react';
import NotFound from '../../components/NotFound/NotFound';

function action() {
  return {
    chunks: ['not-found'],
    status: 404,
    component: <NotFound />,
  };
}

export default action;
