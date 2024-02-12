/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  withLocales,
  withSuggestion,
  withStoreConfig,
  withRoutes,
  Link,
} from '@central-tech/core-ui';
import ProductCard from './ProductCard';
import CrossIcon from './CrossIcon';
import { CmsData } from '../../CMSGrapesjsView';
import { stripHtmlTag } from '../../../utils/stripHtmlTag';
import { get, indexOf } from 'lodash';

const SearchBarMobileModalStyled = styled.div`
  background-color: #fff;
  padding: 15px 10px;
  width: 100%;
  height: 100%;
  z-index: 100;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: scroll;
`;
const SearchbarInputGroupStyled = styled.form`
  position: relative;
  border: 1px solid #767676;
  background-color: ${props => (props.listening ? '#767676' : '#fff')};
  margin-right: 35px;
  margin-bottom: 20px;
`;
const SearchBarInputStyled = styled.input`
  height: 100%;
  width: 100%;
  background-color: ${props => (props.listening ? '#767676' : '#fff')};
  padding-left: ${props => (props.listening ? '10px' : '25px')};
  margin: 4px 0;
  outline: ${props => (props.listening ? 'none' : '')};
  text-shadow: ${props => (props.listening ? '0 0 0 #fff' : '')};
  color: ${props => (props.listening ? 'transparent' : '#333436')};
  font-size: 16px;
  line-height: 150%;
  border: none;
  ::placeholder {
    color: ${props => (props.listening ? '#C0BFBF' : '#b2b5bd')};
  }
`;
const CrossIconStyled = styled.div`
  position: absolute;
  top: 14px;
  right: 24px;
`;
const InitialSearchStyled = styled.div`
  height: auto;
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
  margin-bottom: 0;
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
const SearchResultCommonTitleStyled = styled.h3`
  font-weight: 400;
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 10px;
`;
const SearchResultCategoryTitleStyled = styled(SearchResultCommonTitleStyled)`
  margin-bottom: 10px;
`;
const SearchResultProductContentStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
`;
const SearchResultNotFoundStyled = styled.p`
  font-size: 10px;
  text-transform: none;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 300;
`;
const SectionBreakStyled = styled.hr`
  margin: 15px 0;
  overflow: hidden;
  border: 0.3px solid #c3c3c3;
`;
const SearchIconStyled = styled.img`
  width: 13px;
  height: 13px;
  display: ${props => (props.listening ? 'none' : 'relative')};
  position: absolute;
  left: 5px;
  top: 50%;
  transform: translateY(-50%);
`;
const MicrophoneIconStyled = styled.img`
  width: 13px;
  height: 13px;

  background-color: transparent;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
`;
const StaticCmsSearchPlaceholder = ({ html, state }) => {
  const removeTag = stripHtmlTag(html);
  const output = removeTag.replace(/&#x[0-9A-Fa-f]+;/g, htmlCode => {
    const codePoint = parseInt(htmlCode.slice(3, -1), 16);
    return String.fromCharCode(codePoint);
  });
  if (output) state(output);
};
const SearchBarMobileModal = ({
  activeConfig,
  lang,
  location,
  translate,
  getTrendingSuggestions,
  getSearchSuggestions,
  startListening,
  abortListening,
  listening,
  setIsOpenSearchBarModal,
  transcript,
  browserSupportsSpeechRecognition,
  onToggleMenu,
  resetTranscript,
}) => {
  const [searchPlaceHolder, setSearchPlaceholder] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [topSearchKeywords, setTopSearchKeywords] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [trendingSearch, setTrendingSearch] = useState([]);
  const nSuggestedProducts = 6;
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
  }, []);
  useEffect(() => {
    if (!listening) {
      handleSubmitSearch(searchMessage);
    }
  }, [listening]);
  useEffect(() => {
    setSearchMessage(transcript);
  }, [transcript]);
  const handleSearchMessageChange = e => {
    const newSearchMessage = e.target.value;
    setSearchMessage(newSearchMessage);
    getSearchSuggestions(newSearchMessage, nSuggestedProducts).then(result => {
      setSuggestedProducts(get(result, 'products', []));
      setSuggestedCategories(get(result, 'categories', []));
      setTopSearchKeywords(get(result, 'terms', []));
    });
    getTrendingSuggestions().then(result => {
      setTrendingSearch(result);
    });
  };
  const handleMicrophone = () => {
    if (listening) {
      abortListening();
      setSearchMessage('');
    } else {
      startListening();
    }
  };
  const clearSearchValue = () => {
    setSearchMessage('');
    onToggleMenu(false);
    setIsOpenSearchBarModal(false);
  };
  const handleSubmitSearch = keyword => {
    if (keyword) {
      resetTranscript();
      let recentSearchItems = window.localStorage.getItem('recent_search')
        ? window.localStorage.getItem('recent_search').split('|')
        : [];
      const valueIndex = indexOf(recentSearchItems, keyword);
      if (valueIndex > -1) {
        recentSearchItems = [
          keyword,
          ...recentSearchItems.filter(v => v !== keyword),
        ];
      } else {
        recentSearchItems.splice(0, 0, keyword);
      }
      recentSearchItems.splice(3);
      window.localStorage.setItem('recent_search', recentSearchItems.join('|'));
      setIsOpenSearchBarModal(false);
      onToggleMenu(false);
      const url = `/${lang}/search/${encodeURIComponent(keyword)}`;
      location.push(url);
    }
  };
  return (
    <SearchBarMobileModalStyled>
      <SearchbarInputGroupStyled
        onSubmit={() => handleSubmitSearch(searchMessage)}
        listening={listening}
      >
        <CmsData
          identifier="mobileWeb|HEADER_SEARCHBOX_TEXT"
          ssr={false}
          wrapper={false}
          callback={StaticCmsSearchPlaceholder}
          state={setSearchPlaceholder}
        />
        <SearchBarInputStyled
          autoComplete="off"
          type="search"
          placeholder={
            !listening ? searchPlaceHolder : translate('search_box.listening')
          }
          value={searchMessage}
          onChange={e => handleSearchMessageChange(e)}
          listening={listening}
          autoFocus
          disabled={listening ? 'disabled' : ''}
        />
        <SearchIconStyled
          src="/static/icons/Searching.svg"
          listening={listening}
        />
        {browserSupportsSpeechRecognition && (
          <MicrophoneIconStyled
            src={
              listening
                ? '/static/icons/Record.svg'
                : '/static/icons/MicrophoneBlackShape.svg'
            }
            onClick={handleMicrophone}
          />
        )}
      </SearchbarInputGroupStyled>
      <CrossIconStyled onClick={() => setIsOpenSearchBarModal(false)}>
        <CrossIcon />
      </CrossIconStyled>
      {searchMessage.length < 3 || listening ? (
        <InitialSearchStyled>
          {recentSearch.length > 0 && (
            <SearchResultCommonStyled>
              <SearchResultCommonTitleStyled>
                {translate('search_box.recent_search')}
              </SearchResultCommonTitleStyled>
              <SearchResultRecentSearchContentStyled>
                {recentSearch.map((item, index) => {
                  return (
                    <Link
                      key={index + item}
                      to={`/search/${encodeURIComponent(item)}`}
                      onClick={clearSearchValue}
                    >
                      {item}
                    </Link>
                  );
                })}
              </SearchResultRecentSearchContentStyled>
              <SectionBreakStyled />
            </SearchResultCommonStyled>
          )}
          {trendingSearch.length > 0 && (
            <SearchResultCommonContentStyled>
              <SearchResultCommonTitleStyled>
                {translate('search_box.trending_search')}
              </SearchResultCommonTitleStyled>
              <SearchResultTrendingSearchContentStyled>
                {trendingSearch.slice(0, 3).map((keyword, index) => {
                  return (
                    <Link
                      key={index}
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
        </InitialSearchStyled>
      ) : (
        <SearchResultCommonStyled>
          {topSearchKeywords.length > 0 && (
            <SearchResultCommonContentStyled>
              <SearchResultCommonTitleStyled>
                {translate('search_box.search_keyword')}
              </SearchResultCommonTitleStyled>
              <SearchResultTrendingSearchContentStyled>
                {topSearchKeywords.slice(0, 3).map((keyword, index) => {
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
              <SectionBreakStyled />
            </SearchResultCommonContentStyled>
          )}
          <SearchResultCategoryTitleStyled>
            {translate('search_box.category')}
          </SearchResultCategoryTitleStyled>
          <SearchResultTrendingSearchContentStyled>
            {suggestedCategories.length > 0 ? (
              suggestedCategories.slice(0, 3).map((category, index) => (
                <Link
                  key={index + category.title}
                  to={`${category.url}?q=${encodeURIComponent(searchMessage)}`}
                  onClick={clearSearchValue}
                >
                  {category.title}
                </Link>
              ))
            ) : (
              <SearchResultNotFoundStyled>
                {translate('search_box.no_search_term_found')}
              </SearchResultNotFoundStyled>
            )}
          </SearchResultTrendingSearchContentStyled>
          <SectionBreakStyled />
          <SearchResultCommonTitleStyled>
            {translate('search_box.product')}
          </SearchResultCommonTitleStyled>
          <SearchResultProductContentStyled>
            {suggestedProducts.length > 0 ? (
              suggestedProducts.map((product, index) => (
                <ProductCard
                  key={index + product.title}
                  productName={product.title}
                  price={product.price}
                  productImageUrl={`${baseMediaUrl}/catalog/product${product.image}`}
                  specialPrice={product.final_price}
                  productUrl={product.url}
                  clearSearchValue={clearSearchValue}
                />
              ))
            ) : (
              <SearchResultNotFoundStyled>
                {translate('search_box.no_product_found')}
              </SearchResultNotFoundStyled>
            )}
          </SearchResultProductContentStyled>
        </SearchResultCommonStyled>
      )}
    </SearchBarMobileModalStyled>
  );
};

export default withRoutes(
  withStoreConfig(withSuggestion(withLocales(SearchBarMobileModal))),
);
