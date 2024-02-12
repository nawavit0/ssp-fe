import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import { Helmet } from 'react-helmet';
import CmsRender from '../../../components/CMSGrapesjsView/CmsRender';

const CmsPage = ({ cmsData, lang }) => {
  const content = cmsData && cmsData.contents ? cmsData.contents : {};
  return (
    <div id="cms-page">
      <Helmet>
        <title>{content?.meta?.title || ''}</title>
        <meta name="title" content={content?.meta?.title || ''} />
        <meta property="og:title" content={content?.meta?.title || ''} />
        <meta name="twitter:title" content={content?.meta?.title || ''} />
        <meta name="description" content={content?.meta?.description || ''} />
        <meta
          property="og:description"
          content={content?.meta?.description || ''}
        />
        <meta property="og:image" content={content?.meta?.image || ''} />
        <meta
          name="twitter:description"
          content={content?.meta?.description || ''}
        />
      </Helmet>
      <CmsRender content={content} uniqid={`cms-${lang}-${cmsData._id}`} />
    </div>
  );
};

export default withLocales(CmsPage);
