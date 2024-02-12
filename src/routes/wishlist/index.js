import React, { Fragment } from 'react';
import Wishlist from './Wishlist';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
import { DesktopView, MobileView } from '../../components/DeviceDetect';

const title = 'Wishlist';

function action() {
  return {
    chunks: ['wishlist'],
    title,
    component: (
      <Fragment>
        <DesktopView>
          <DesktopLayout>
            <Wishlist title={title} />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout>
            <Wishlist title={title} />
          </MobileLayout>
        </MobileView>
      </Fragment>
    ),
  };
}

export default action;
