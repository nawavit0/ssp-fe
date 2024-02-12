import React from 'react';
import { withLocales, withStoreConfig } from '@central-tech/core-ui';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import ProductListPage from '../../components/ProductListPage';
import { get } from 'lodash';

const Search = props => {
  const { translate, searchKeyWord, location } = props;

  let searchTerm = '';

  if (get(location, 'pathname')) {
    searchTerm = location.pathname.split('/')[3];
  } else {
    searchTerm = searchKeyWord;
  }

  return (
    <>
      <Helmet>
        <title>{translate('seo.search.title', { keyword: searchTerm })}</title>
        <meta
          name="description"
          content={translate('seo.search.title', { keyword: searchTerm })}
        />
      </Helmet>
      <Breadcrumbs breadcrumbsData={[{ name: translate('search') }]} />
      <ProductListPage
        metaTitle={searchKeyWord}
        metaDescription={false}
        useFromPage={'SEARCH'}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default withLocales(withStoreConfig(Search));
