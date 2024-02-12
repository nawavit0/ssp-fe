import React from 'react';
import Store from './Store';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';

async function action(context, { urlKey }) {
  return {
    title: '',
    chunks: ['store'],
    component: (
      <>
        {context.deviceDetect.isMobile === true ? (
          <MobileLayout>
            <Store cmsUrlKey={`mobileWeb-article/${urlKey}`} />
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <Store cmsUrlKey={`article/${urlKey}`} />
          </DesktopLayout>
        )}
      </>
    ),
  };
}

export default action;
