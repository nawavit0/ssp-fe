import React from 'react';
import { get } from 'lodash';
import {
  CategoryWidget,
  CmsWidget,
  withStoreConfig,
  withLocales,
} from '@central-tech/core-ui';
import { Helmet } from 'react-helmet';
import CmsRender from '../../components/CMSGrapesjsView/CmsRender';
import ProductListPage from '../../components/ProductListPage';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductListPageSkeleton from '../../components/ProductListPageSkeleton/ProductListPageSkeleton';

const renderHeader = category => {
  const categoryPath = get(category, 'path', []);
  const categoryName = get(category, 'name', '');
  const categoryTitle = get(category, 'meta_title', false);
  const categoryDescription = get(category, 'meta_description', '');
  const categoryKeywords = get(category, 'meta_keywords', '');
  return (
    <>
      <Helmet>
        <title>{categoryTitle || categoryName}</title>
        <meta name="description" content={categoryDescription} />
        <meta name="keywords" content={categoryKeywords} />
      </Helmet>
      <Breadcrumbs breadcrumbsData={categoryPath} />
    </>
  );
};

const Category = props => {
  const { categoryId, activeConfig, lang, identifier } = props;
  return (
    <CategoryWidget categoryId={categoryId} ssr storeCode={activeConfig.code}>
      {({ data, loading }) => {
        if (loading) return <ProductListPageSkeleton />;
        const category = get(data, 'category', {});
        const categoryName = get(category, 'name', '');
        const categoryTitle = get(category, 'meta_title', false);
        const categoryDescription = get(category, 'meta_description', '');
        if (categoryId !== 0) {
          return (
            <CmsWidget
              ssr
              filter={{ identifier }}
              skip={!identifier}
              context={{ batching: true }}
            >
              {({ data, loading }) => {
                if (loading) {
                  return <div>Loading...</div>;
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
                        {renderHeader(category)}
                        <ProductListPage
                          useFromPage={`CATEGORY`}
                          categoryId={categoryId}
                          category={category}
                          categoryName={categoryName}
                          metaTitle={categoryTitle}
                          metaDescription={categoryDescription}
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
                      {renderHeader(category)}
                      <ProductListPage
                        useFromPage={`CATEGORY`}
                        categoryId={categoryId}
                        category={category}
                        categoryName={categoryName}
                        metaTitle={categoryTitle}
                        metaDescription={categoryDescription}
                      />
                    </>
                  );
                }
                return (
                  <>
                    {renderHeader(category)}
                    <ProductListPage
                      useFromPage={`CATEGORY`}
                      categoryId={categoryId}
                      category={category}
                      categoryName={categoryName}
                      metaTitle={categoryTitle}
                      metaDescription={categoryDescription}
                    />
                  </>
                );
              }}
            </CmsWidget>
          );
        }
        return (
          <>
            {renderHeader(category)}
            <ProductListPage
              useFromPage={`CATEGORY`}
              categoryId={categoryId}
              category={category}
              categoryName={categoryName}
              metaTitle={categoryTitle}
              metaDescription={categoryDescription}
            />
          </>
        );
      }}
    </CategoryWidget>
  );
};

export default withLocales(withStoreConfig(Category));
