import React, { memo } from 'react';
import { Helmet } from 'react-helmet';
import { withLocales, withStoreConfig } from '@central-tech/core-ui';
import { RootBreadcrumbStyled, InnerCrumbStyled, LinkStyled } from './styled';
import { get } from 'lodash';
import withDeviceDetect from '../DeviceDetect/withDeviceDetect';

const setJSONLdBreadcrumb = props => {
  const { activeConfig, breadcrumbsData, translate } = props;
  const baseUrl = get(
    activeConfig,
    'base_url',
    'https://www.supersports.co.th/',
  );
  const itemListElement = [];
  itemListElement.push({
    '@type': 'ListItem',
    position: 1,
    name: translate('page.home'),
    item: baseUrl,
  });
  itemListElement.push(setItemElement(baseUrl, breadcrumbsData));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [itemListElement],
  });
};

const setItemElement = (baseUrl, breadcrumbsData) => {
  return (
    breadcrumbsData &&
    breadcrumbsData.map((item, index) => {
      return {
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: baseUrl + item.url_path,
      };
    })
  );
};

const Breadcrumbs = props => {
  const { isMobile, breadcrumbsData, translate } = props;
  const breadcrumbHome = {
    name: translate('page.home'),
    level: 1,
    url_path: '/',
  };
  const breadcrumbsObject = isMobile
    ? [breadcrumbHome].concat(breadcrumbsData).reverse()
    : [breadcrumbHome].concat(breadcrumbsData);
  return (
    <>
      <RootBreadcrumbStyled>
        {breadcrumbsObject &&
          breadcrumbsObject.map((item, index) => {
            const itemUrl = get(item, 'url_path', '#');
            return (
              <InnerCrumbStyled key={`breadcrumbs${index}`} isMobile={isMobile}>
                <LinkStyled to={itemUrl} title={item.name}>
                  <span>{item.name}</span>
                </LinkStyled>
              </InnerCrumbStyled>
            );
          })}
      </RootBreadcrumbStyled>
      <Helmet>
        <script type="application/ld+json">{setJSONLdBreadcrumb(props)}</script>
      </Helmet>
    </>
  );
};

export default memo(
  withDeviceDetect(withStoreConfig(withLocales(Breadcrumbs))),
);
