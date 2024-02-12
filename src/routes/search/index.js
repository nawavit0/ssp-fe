import React from 'react';
import Search from './Search';
import { DesktopView, MobileView } from '../../components/DeviceDetect';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';

function action(context, params) {
  return {
    title: '',
    chunks: ['search'],
    component: (
      <>
        <DesktopView>
          <DesktopLayout pageName={'search'}>
            <Search searchKeyWord={params.query} />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout pageName={'search'}>
            <Search searchKeyWord={params.query} />
          </MobileLayout>
        </MobileView>
      </>
    ),
  };
}

export default action;
