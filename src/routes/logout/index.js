import React, { Fragment } from 'react';
import Logout from './Logout';
import { DesktopView, MobileView } from '../../components/DeviceDetect';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
const title = 'Log Out';

async function action(context) {
  const { customer } = context;

  return {
    chunks: ['auth'],
    title,
    component: (
      <Fragment>
        <DesktopView>
          <DesktopLayout>
            <Logout title={title} customer={customer} />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout>
            <Logout title={title} customer={customer} />
          </MobileLayout>
        </MobileView>
      </Fragment>
    ),
    guard: {
      condition: !customer || !customer.id,
      redirect: '/',
    },
  };
}

export default action;
