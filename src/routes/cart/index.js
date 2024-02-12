import React from 'react';
import CartFetch from './CartFetch';
import MobileLayout from '../../components/Layout/MobileLayout';
import DesktopLayout from '../../components/Layout/DesktopLayout';

const title = 'Cart';

function action(context) {
  const { deviceDetect, customer } = context;
  return {
    chunks: ['cart'],
    title,
    component: (
      <>
        {deviceDetect.isMobile ? (
          <MobileLayout>
            <CartFetch isMobile customer={customer} />
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <CartFetch customer={customer} />
          </DesktopLayout>
        )}
      </>
    ),
  };
}

export default action;
