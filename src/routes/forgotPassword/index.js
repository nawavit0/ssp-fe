import React, { Fragment } from 'react';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
import { DesktopView, MobileView } from '../../components/DeviceDetect';
import ForgotPassword from './ForgotPassword';

const title = 'Forgot Password';

function action() {
  return {
    chunks: ['auth'],
    title,
    component: (
      <Fragment>
        <DesktopView>
          <DesktopLayout>
            <ForgotPassword />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout>
            <ForgotPassword />
          </MobileLayout>
        </MobileView>
      </Fragment>
    ),
  };
}

export default action;
