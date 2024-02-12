import React from 'react';
import GuestLogin from './GuestLogin';
import MobileLayout from '../../components/Layout/MobileLayout';
import DesktopLayout from '../../components/Layout/DesktopLayout';

const title = 'Guest Login';

async function action(context) {
  const { customer, deviceDetect } = context;

  return {
    chunks: ['auth'],
    title,
    component: (
      <>
        {deviceDetect.isMobile === true ? (
          <MobileLayout>
            <GuestLogin isMobile />
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <GuestLogin />
          </DesktopLayout>
        )}
      </>
    ),
    guard: {
      condition: customer?.id,
      redirect: '/checkout',
    },
  };
}

export default action;
