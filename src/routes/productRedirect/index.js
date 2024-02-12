import React from 'react';
import Redirect from './Redirect';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';

function action({ deviceDetect, query }) {
  return {
    title: '',
    chunks: ['productRedirect'],
    component: (
      <>
        {deviceDetect.isMobile === true ? (
          <MobileLayout>
            <Redirect sku={query?.sku || ''} />
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <Redirect sku={query?.sku || ''} />
          </DesktopLayout>
        )}
      </>
    ),
  };
}

export default action;
