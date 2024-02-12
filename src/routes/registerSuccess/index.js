import React from 'react';
import RegisterSuccess from './RegisterSuccess';
import MobileLayout from '../../components/Layout/MobileLayout';
import DesktopLayout from '../../components/Layout/DesktopLayout';

const title = 'Register Success';

async function action(context) {
  return {
    title: 'Register Success',
    chunks: ['auth'],
    component: (
      <>
        {context.deviceDetect.isMobile === true ? (
          <MobileLayout>
            <RegisterSuccess title={title} />
          </MobileLayout>
        ) : (
          <DesktopLayout>
            <RegisterSuccess title={title} />
          </DesktopLayout>
        )}
      </>
    ),
  };
}

export default action;
