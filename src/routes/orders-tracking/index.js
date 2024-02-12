import React, { Fragment } from 'react';
import GuestOrderDetail from './GuestOrderDetail';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';

const title = 'Order Detail';

function action(context, params) {
  return {
    chunks: ['orders-tracking'],
    title,
    component: (
      <Fragment>
        {context.deviceDetect.isMobile === true ? (
          <MobileLayout>
            <GuestOrderDetail {...params} />
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <GuestOrderDetail {...params} />
          </DesktopLayout>
        )}
      </Fragment>
    ),
  };
}

export default action;
