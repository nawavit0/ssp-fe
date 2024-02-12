import React, { Fragment } from 'react';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
import { DesktopView, MobileView } from '../../components/DeviceDetect';

import MobileLogin from './MobileLogin';
import DesktopLogin from './DesktopLogin';

const title = 'Login';

function action() {
  return {
    chunks: ['mobile-login'],
    title,
    component: (
      <Fragment>
        <DesktopView>
          <DesktopLayout>
            <DesktopLogin />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout>
            <MobileLogin />
          </MobileLayout>
        </MobileView>
      </Fragment>
    ),
  };
}

export default action;
