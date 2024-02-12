import React from 'react';
import { get } from 'lodash';
import {
  BrandDetailWidget,
  CmsWidget,
  withLocales,
} from '@central-tech/core-ui';
import ProductListPage from '../../../components/ProductListPage';
import CmsRender from '../../../components/CMSGrapesjsView/CmsRender';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '../../../components/Breadcrumbs/Breadcrumbs';
import ProductListPageSkeleton from '../../../components/ProductListPageSkeleton/ProductListPageSkeleton';

const renderHeader = brand => {
  const brandName = get(brand, 'name', '');
  const brandTitle = get(brand, 'meta_title', false);
  const brandDescription = get(brand, 'meta_description', '');
  return (
    <>
      <Helmet>
        <title>{brandTitle || brandName}</title>
        <meta name="description" content={brandDescription} />
      </Helmet>
      <Breadcrumbs breadcrumbsData={[{ name: brandName }]} />
    </>
  );
};

const Brand = props => {
  const { brandId, lang, identifier } = props;

  return (
    <BrandDetailWidget brandId={brandId} ssr>
      {({ data, loading }) => {
        if (loading) return <ProductListPageSkeleton />;
        const brand = get(data, 'brandDetail', {});
        const brandName = encodeURIComponent(get(brand, 'name', ''));
        const brandId = parseInt(get(brand, 'brand_id', 0));
        const brandTitle = get(brand, 'meta_title', false);
        const brandDescription = get(brand, 'meta_description', false);
        const brandLogo = get(brand, 'logo', false);
        if (brandId !== 0) {
          return (
            <CmsWidget
              ssr
              filter={{ identifier }}
              skip={!identifier}
              context={{ batching: true }}
            >
              {({ data, loading }) => {
                if (loading) {
                  return <div>CMS Widget Loading...</div>;
                }
                const cms = get(data, 'cms.cms_list[0]');
                const layoutType = get(cms, 'page_layout', false);
                const content = cms && cms.contents ? cms.contents : {};
                if (Object.keys(content).length) {
                  if (layoutType === 'full') {
                    return (
                      <CmsRender
                        content={content}
                        uniqid={`cms-${lang}-${cms._id}`}
                      />
                    );
                  } else if (layoutType === 'standard') {
                    return (
                      <>
                        {renderHeader(brand)}
                        <ProductListPage
                          useFromPage={`BRAND`}
                          brandName={brandName}
                          brandLogo={brandLogo}
                          metaTitle={brandTitle}
                          metaDescription={brandDescription}
                          cmsRender={
                            <CmsRender
                              content={content}
                              uniqid={`cms-${lang}-${cms._id}`}
                            />
                          }
                        />
                      </>
                    );
                  }
                  return (
                    <>
                      {renderHeader(brand)}
                      <ProductListPage
                        useFromPage={`BRAND`}
                        brandName={brandName}
                        brandLogo={brandLogo}
                        metaTitle={brandTitle}
                        metaDescription={brandDescription}
                      />
                    </>
                  );
                }
                return (
                  <>
                    {renderHeader(brand)}
                    <ProductListPage
                      useFromPage={`BRAND`}
                      brandName={brandName}
                      brandLogo={brandLogo}
                      metaTitle={brandTitle}
                      metaDescription={brandDescription}
                    />
                  </>
                );
              }}
            </CmsWidget>
          );
        }
        return <ProductListPage useFromPage={`BRAND`} brandName={brandName} />;
      }}
    </BrandDetailWidget>
  );
};

export default withLocales(Brand);
