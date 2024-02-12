import React from 'react';
import Category from './Category';
import Layout from '../../components/Layout';

function action(context, params) {
  return {
    chunks: ['category'],
    component: (
      <Layout>
        <Category {...params} />
      </Layout>
    ),
  };
}

export default action;
