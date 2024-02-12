import React from 'react';
import Redirect from './Redirect';
import { DesktopView, MobileView } from '../../components/DeviceDetect';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
import { get } from 'lodash';

function action(context) {
  return {
    title: '',
    chunks: ['search'],
    component: (
      <>
        <DesktopView>
          <DesktopLayout>
            <Redirect url={get(context, 'query.url')} />
          </DesktopLayout>
        </DesktopView>
        <MobileView>
          <MobileLayout>
            <Redirect url={get(context, 'query.url')} />
          </MobileLayout>
        </MobileView>
      </>
    ),
  };
}

export default action;
