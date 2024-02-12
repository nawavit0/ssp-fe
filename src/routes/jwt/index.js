import React from 'react';
import Jwt from './Jwt';

async function action() {
  return {
    title: '',
    chunks: ['setJwt'],
    component: <Jwt />,
  };
}

export default action;
