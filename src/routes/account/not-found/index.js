import React from 'react';
import NotFound from '../../not-found/NotFound';

const title = 'Page Not Found';

function action() {
  return {
    chunks: ['not-found'],
    title,
    component: (
      <div style={{ padding: '20px' }}>
        <NotFound title={title} />
      </div>
    ),
    status: 404,
  };
}

export default action;
