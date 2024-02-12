import React from 'react';
//import Wishlist from './Wishlist';
import WishlistFetch from './WishlistFetch';
//import MobileLayout from '../../../components/Layout/MobileLayout';
//import DesktopLayout from '../../../components/Layout/DesktopLayout';
const title = 'Wishlist';

function action(context) {
  const { deviceDetect, customer } = context;
  const { isMobile } = deviceDetect;
  return {
    chunks: ['account'],
    title,
    component: (
      // <>
      //   {deviceDetect.isMobile ? (
      //     <MobileLayout>
      //       <WishlistFetch customer={customer} />
      //     </MobileLayout>
      //   ) : (
      //     <DesktopLayout>
      //       <WishlistFetch customer={customer} />
      //     </DesktopLayout>
      //   )}
      // </>
      <WishlistFetch isMobile={isMobile} customer={customer} />
    ),
  };
}

export default action;
