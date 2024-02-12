import React, { memo } from 'react';
import propTypes from 'prop-types';
import { CmsView } from '@central-tech/core-ui';
import {
  initProductSlideWidget,
  initCmsBlockWidget,
  instagramWidget,
} from './cmsWidget';

const CmsRender = ({ ...rest }, context) => {
  return (
    <CmsView
      {...rest}
      context={context}
      isMobile={context?.deviceDetect?.isMobile}
      widget={{
        cmsBlock: initCmsBlockWidget,
        productSlide: initProductSlideWidget,
        instagramWidget: instagramWidget,
      }}
    />
  );
};

CmsRender.contextTypes = {
  client: propTypes.object.isRequired,
  insertCss: propTypes.func,
  pathname: propTypes.string,
  store: propTypes.object,
  deviceDetect: propTypes.object,
};

CmsRender.propTypes = {
  hasRenderCss: propTypes.bool,
  hasRenderJs: propTypes.bool,
  replaceHtml: propTypes.array,
};

export default memo(CmsRender);
