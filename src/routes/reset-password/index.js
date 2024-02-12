import React, { Fragment } from 'react';
import ResetPassword from './ResetPassword';
import { DesktopView, MobileView } from '../../components/DeviceDetect';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';

const title = 'Reset Password';

function action() {
  return {
    chunks: ['auth'],
    title,
    component: (
      <Fragment>
        <DesktopView>
          <DesktopLayout>
            <ResetPassword />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout>
            <ResetPassword />
          </MobileLayout>
        </MobileView>
      </Fragment>
    ),
  };
}

export default action;
