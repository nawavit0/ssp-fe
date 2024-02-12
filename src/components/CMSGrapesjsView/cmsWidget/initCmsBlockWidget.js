import React from 'react';
import ReactDOM from 'react-dom';
import { CoreUiProvider, cmsBlockWidget } from '@central-tech/core-ui';
import theme from '../../../config/theme';
import App from '../../App';
import LazyLoad from 'react-lazyload';
import { Cms } from '../index';

function renderCmsBlockWidget(target, context, cmsIdentifier) {
  const comp = (
    <CoreUiProvider client={context.client} theme={theme}>
      <App context={context}>
        <LazyLoad height={330} once>
          <Cms identifier={cmsIdentifier} ssr={false} />
        </LazyLoad>
      </App>
    </CoreUiProvider>
  );
  ReactDOM.render(comp, target);
}

export default function initCmsBlockWidget(context) {
  cmsBlockWidget(context, renderCmsBlockWidget);
  return true;
}
