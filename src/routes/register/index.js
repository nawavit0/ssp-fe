import React, { Fragment } from 'react';

import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
import { DesktopView, MobileView } from '../../components/DeviceDetect';

import MobileRegister from './registerMobile/MobileRegister';
import DesktopRegister from './registerDesktop/DesktopRegister';

async function action(context) {
  const title = 'Register';
  const { customer } = context;
  return {
    chunks: ['auth'],
    title: 'Register',
    component: (
      <Fragment>
        <DesktopView>
          <DesktopLayout>
            <DesktopRegister title={title} />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout>
            <MobileRegister title={title} />
          </MobileLayout>
        </MobileView>
      </Fragment>
    ),
    guard: {
      condition: !!customer?.id,
      redirect: '/',
    },
  };
}

export default action;
