import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';

import {
  withStoreConfig,
  withLocales,
  withSuggestion,
  Link,
} from '@central-tech/core-ui';
import ProductCard from './ProductCard';
import withDeviceDetect from '../../DeviceDetect/withDeviceDetect';

const SearchResultStyled = styled.div`
  background-color: #fff;
  padding: 15px 25px;
  width: 150%;
  height: auto;
  transform: translateX(-20%);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  position: absolute;
  top: 50px;
  z-index: 100;

  display: grid;
  grid-template-columns: minmax(130px, 20%) 1fr;
`;
const InitialSearchStyled = styled(SearchResultStyled)`
  height: auto;

  display: grid;
  grid-template-columns: minmax(250px, 20%) 1fr;
`;
const SearchResultCommonStyled = styled.div`
  font-size: 10px;
  color: #1a1b1a;
`;
const SearchResultCommonContentStyled = styled.div`
  text-transform: uppercase;
  a {
    text-transform: none;
    font-size: 10px;
    color: #1a1b1a;
    font-weight: 300;
    margin-bottom: 12px;
    display: block;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
const SearchResultTrendingSearchContentStyled = styled(
  SearchResultCommonContentStyled,
)`
  margin-bottom: 30px;
`;
const SearchResultCategoryContentStyled = styled(
  SearchResultCommonContentStyled,
)`
  font-size: 10px;
`;
const SearchResultRecentSearchContentStyled = styled(
  SearchResultCommonContentStyled,
)`
  a {
    margin-bottom: 12px;
    display: block;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
const SearchResultProductStyled = styled.div`
  color: #1a1b1a;
`;
const SearchResultCommonTitleStyled = styled.h3`
  font-weight: 400;
  text-transform: uppercase;
  font-size: 14px;
  margin-bottom: 10px;
`;
const SearchResultCategoryTitleStyled = styled(SearchResultCommonTitleStyled)`
  margin-bottom: 10px;
`;
const SearchResultProductContentStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 49%);
  grid-gap: 10px;
`;
const ArrowSymbolStyled = styled.i`
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 20px solid white;
  position: absolute;
  left: 8px;
  bottom: -20px;
  display: grid;
  z-index: 200;
`;
const SearchResultNotFoundStyled = styled.p`
  font-size: 10px;
  text-transform: none;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 300;
`;
const SectionBreakStyled = styled.hr`
  margin: 12px 0;
  overflow: hidden;
  border: none;
`;
const SearchResultProducts = ({
  showDefaultLayout,
  suggestedCategories,
  suggestedProducts,
  topSearchKeywords,
  activeConfig,
  recentSearch,
  setRecentSearch,
  trendingSearch,
  setTrendingSearch,
  translate,
  clearSearchValue,
  getTrendingSuggestions,
  searchMessage,
}) => {
  const baseMediaUrl = activeConfig.base_media_url.substring(
    0,
    activeConfig.base_media_url.length - 1,
  );
  useEffect(() => {
    getTrendingSuggestions().then(result => {
      setTrendingSearch(result);
    });
    const recentSearchItems = window.localStorage.getItem('recent_search')
      ? window.localStorage.getItem('recent_search').split('|')
      : [];
    setRecentSearch(recentSearchItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      {showDefaultLayout ? (
        (recentSearch.length !== 0 || trendingSearch.length !== 0) && (
          <div>
            <ArrowSymbolStyled />
            <InitialSearchStyled>
              {recentSearch.length !== 0 && (
                <SearchResultCommonStyled>
                  <SearchResultCommonTitleStyled>
                    {translate('search_box.recent_search')}
                  </SearchResultCommonTitleStyled>
                  <SearchResultRecentSearchContentStyled>
                    {recentSearch.map((item, index) => {
                      return (
                        <Link
                          key={item + index}
                          to={`/search/${encodeURIComponent(item)}`}
                          onClick={clearSearchValue}
                        >
                          {item}
                        </Link>
                      );
                    })}
                  </SearchResultRecentSearchContentStyled>
                </SearchResultCommonStyled>
              )}
              <SearchResultCommonStyled>
                {trendingSearch.length > 0 && (
                  <SearchResultCommonContentStyled>
                    <SearchResultCommonTitleStyled>
                      {translate('search_box.trending_search')}
                    </SearchResultCommonTitleStyled>
                    <SearchResultTrendingSearchContentStyled>
                      {trendingSearch.slice(0, 3).map((keyword, index) => {
                        return (
                          <Link
                            key={index + keyword.text}
                            to={`/search/${encodeURIComponent(keyword.text)}`}
                            onClick={clearSearchValue}
                          >
                            {keyword.text}
                          </Link>
                        );
                      })}
                    </SearchResultTrendingSearchContentStyled>
                  </SearchResultCommonContentStyled>
                )}
              </SearchResultCommonStyled>
            </InitialSearchStyled>
          </div>
        )
      ) : (
        <div>
          <ArrowSymbolStyled />
          <SearchResultStyled>
            <SearchResultCommonStyled>
              {topSearchKeywords.length > 0 && (
                <>
                  <SearchResultCategoryTitleStyled>
                    {translate('search_box.search_keyword')}
                  </SearchResultCategoryTitleStyled>
                  <SearchResultCategoryContentStyled>
                    {topSearchKeywords.slice(0, 3).map((keyword, index) => (
                      <Link
                        key={index + keyword.text}
                        to={`/search/${encodeURIComponent(keyword.text)}`}
                        onClick={clearSearchValue}
                      >
                        {keyword.text}
                      </Link>
                    ))}
                  </SearchResultCategoryContentStyled>
                  <SectionBreakStyled />
                </>
              )}
              <SearchResultCategoryTitleStyled>
                {translate('search_box.category')}
              </SearchResultCategoryTitleStyled>
              <SearchResultCategoryContentStyled>
                {suggestedCategories.length > 0 ? (
                  suggestedCategories.slice(0, 3).map((item, index) => (
                    <Link
                      key={index}
                      to={`${item.url}?q=${encodeURIComponent(searchMessage)}`}
                      onClick={clearSearchValue}
                    >
                      {item.title}
                    </Link>
                  ))
                ) : (
                  <SearchResultNotFoundStyled>
                    {translate('search_box.no_search_term_found')}
                  </SearchResultNotFoundStyled>
                )}
              </SearchResultCategoryContentStyled>
            </SearchResultCommonStyled>
            <SearchResultProductStyled>
              <SearchResultCommonTitleStyled>
                {translate('search_box.product')}
              </SearchResultCommonTitleStyled>
              <SearchResultProductContentStyled>
                {suggestedProducts.length > 0 ? (
                  suggestedProducts.map((product, index) => {
                    const productName = product?.title || '';
                    const productPrice = product?.price || 0;
                    const productImage = product?.image || '';
                    const finalPrice = product?.final_price || 0;
                    const productId = product?.id || '';
                    const productUrl = product?.url || '';
                    return (
                      <ProductCard
                        key={index + productName}
                        productForGtm={product}
                        productName={productName}
                        price={productPrice}
                        productImageUrl={`${baseMediaUrl}/catalog/product${productImage}`}
                        specialPrice={finalPrice}
                        productUrl={productUrl}
                        productId={productId}
                        clearSearchValue={clearSearchValue}
                        index={index}
                      />
                    );
                  })
                ) : (
                  <SearchResultNotFoundStyled>
                    {translate('search_box.no_product_found')}
                  </SearchResultNotFoundStyled>
                )}
              </SearchResultProductContentStyled>
            </SearchResultProductStyled>
          </SearchResultStyled>
        </div>
      )}
    </Fragment>
  );
};

export default withSuggestion(
  withDeviceDetect(withLocales(withStoreConfig(SearchResultProducts))),
);
