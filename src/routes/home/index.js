import React, { Fragment } from 'react';
import Home from './Home';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';

async function action(context) {
  return {
    title: '',
    chunks: ['home'],
    component: (
      <Fragment>
        {context.deviceDetect.isMobile === true ? (
          <MobileLayout>
            <Home cmsUrlKey="mobileWeb-homepage" />
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <Home cmsUrlKey="homepage" />
          </DesktopLayout>
        )}
      </Fragment>
    ),
  };
}

export default action;
