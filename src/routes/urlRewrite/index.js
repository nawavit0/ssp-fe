import React from 'react';
import { get, includes } from 'lodash';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
import urlType from '../../constants/urlRewrite';
import pagesMap from './pagesMap';
import {
  GET_URL_REWRITE,
  GET_CMS,
  cmsGenerateKey,
} from '@central-tech/core-ui';

const cmsUrlRewriteData = ({
  mdcEntityType,
  mdcEntityId,
  cmsHash,
  formatSlug,
}) => {
  let type = mdcEntityType;
  let id = mdcEntityId;
  if (cmsHash && formatSlug) {
    if (formatSlug === 'cms-brand-preview') {
      type = 'brand';
      id = 1;
    } else if (formatSlug === 'cms-category-preview') {
      type = 'category';
      id = 2;
    }
  }

  return {
    type,
    id,
  };
};

async function action(context, params) {
  const { slug } = params;
  const { deviceDetect, customer, cms } = context;
  let urlRewriteData;
  let pageComponent;
  let statusCode = 200;

  const formatSlug = slug.join('/');
  const isImage = formatSlug.match(/\.(jpeg|jpg|gif|png|svg)$/);

  if (!isImage) {
    try {
      const responseQuery = await context.client.query({
        query: GET_URL_REWRITE,
        variables: { url: formatSlug },
      });

      urlRewriteData = responseQuery.data.urlRewrite;
    } catch (error) {
      pageComponent = '';
      statusCode = 404;
    }
  }

  const cmsData = cmsUrlRewriteData({
    mdcEntityType: urlRewriteData?.entity_type || 'page',
    mdcEntityId: urlRewriteData?.entity_id || 0,
    cmsHash: cms?.cmsHash || '',
    formatSlug,
  });

  const type = cmsData?.type;
  const id = cmsData?.id;
  const redirectType = urlRewriteData?.redirect_type;
  const targetPath = urlRewriteData?.target_path;

  if (redirectType === 301 || redirectType === 302) {
    return {
      redirect: includes(targetPath, 'http') ? targetPath : `/${targetPath}`,
    };
  }

  if (!pageComponent) pageComponent = pagesMap[type] ? pagesMap[type] : '';

  const title = '';
  const description = '';
  const keywords = '';
  const isFullBrandPage = false;
  const siteName = 'Supersports Online Shopping';
  const metaImage = '';

  switch (type) {
    case urlType.CATEGORY:
      params.categoryId = id;
      params.identifier = cmsGenerateKey({
        cmsHash: cms?.cmsHash || '',
        categoryId: id,
        isMobile: deviceDetect.isMobile,
      }).identifier;
      break;

    case urlType.PRODUCT:
      params.slug = formatSlug;
      params.isMobile = deviceDetect.isMobile;
      params.customer = customer;
      break;

    case urlType.BRAND:
      params.brandId = id;
      params.identifier = cmsGenerateKey({
        cmsHash: cms?.cmsHash || '',
        brandId: id,
        isMobile: deviceDetect.isMobile,
      }).identifier;
      break;

    default:
      let urlKey = formatSlug;
      urlKey = cmsGenerateKey({
        cmsHash: cms?.cmsHash || '',
        isMobile: deviceDetect.isMobile,
        urlKey,
      }).urlKey;

      const { data } = await context.client.query({
        query: GET_CMS,
        variables: { filter: { url_key: urlKey } },
      });

      if (get(data, 'cms.cms_list[0]')) {
        params.cmsData = data.cms.cms_list[0];
        pageComponent = pagesMap['cmsPage'];
      } else {
        pageComponent = pagesMap['not-found'];
      }

      break;
  }
  return {
    chunks: ['urlRewrite'],
    pageName: type,
    title: title,
    description: description,
    keywords: keywords,
    responsive: !isFullBrandPage,
    siteName: siteName,
    metaImage: metaImage,
    component: (
      <>
        {deviceDetect.isMobile === true ? (
          <MobileLayout pageName={type}>
            {React.createElement(pageComponent, params)}
          </MobileLayout>
        ) : (
          <DesktopLayout pageName={type}>
            {React.createElement(pageComponent, params)}
          </DesktopLayout>
        )}
      </>
    ),
    status: statusCode,
  };
}

export default action;
