import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get, indexOf } from 'lodash';
import SpeechRecognition from 'react-speech-recognition';
import {
  withLocales,
  withRoutes,
  withSuggestion,
  withStoreConfig,
} from '@central-tech/core-ui';
import SearchResultProductsDesktop from './components/SearchResultProductsDesktop';
import ClickOutside from '../../components/ClickOutside';
import { CmsData } from '../CMSGrapesjsView';
import { stripHtmlTag } from '../../utils/stripHtmlTag';
import withDeviceDetect from '../DeviceDetect/withDeviceDetect';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';

const SearchBarStyled = styled.form`
  width: 100%;
  position: relative;
`;
const SearchBarInputStyled = styled.input`
  height: 100%;
  width: 100%;
  background-color: ${props => (props.listening ? '#767676' : '#fff')};
  color: ${props => (props.listening ? '#fff' : '#333436')};
  padding-left: ${props => (props.listening ? '15px' : '35px')}
  padding-top: 8px;
  padding-bottom: 8px; 
  font-size: 14px;
  border: none;

  ::placeholder {
    color: ${props => (props.listening ? '#C0BFBF' : '#b2b5bd')}
  }
`;
const SearchIconStyled = styled.img`
  width: 20px;
  height: 17px;
  display: ${props => (props.listening ? 'none' : 'inherit')};
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-55%);
`;
const MicrophoneIconStyled = styled.img`
  width: 20px;
  height: 20px;

  background-color: ${props => (props.color ? props.color : 'transparent')};
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-55%);
`;

const SearchBarDesktop = ({
  translate,
  location,
  getSearchSuggestions,
  getTrendingSuggestions,
  browserSupportsSpeechRecognition,
  startListening,
  stopListening,
  transcript,
  resetTranscript,
  lang,
  listening,
  abortListening,
}) => {
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestedCategories, setSuggestedCategories] = useState([]);
  const [topSearchKeywords, setTopSearchKeywords] = useState([]);
  const [recentSearch, setRecentSearch] = useState([]);
  const [trendingSearch, setTrendingSearch] = useState([]);
  const [hasMicrophone, setMicrophone] = useState(false);
  const [searchPlaceHolder, setSearchPlaceholder] = useState('');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const nSuggestedProducts = 6;
  const StaticCmsSearchPlaceholder = ({ html, state }) => {
    const removeTag = stripHtmlTag(html);
    const output = removeTag.replace(/&#x[0-9A-Fa-f]+;/g, htmlCode => {
      const codePoint = parseInt(htmlCode.slice(3, -1), 16);
      return String.fromCharCode(codePoint);
    });
    if (output) state(output);
  };

  useEffect(() => {
    setSearchMessage(transcript);
  }, [transcript]);

  useEffect(() => {
    if (!isFirstRender && !listening) {
      handleSearchSubmit(searchMessage);
      stopListening();
    }
  });

  useEffect(() => {
    if (browserSupportsSpeechRecognition) {
      setMicrophone(true);
    }
  }, [browserSupportsSpeechRecognition]);

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
  const handleSearchSubmit = keyword => {
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
      const url = `/${lang}/search/${encodeURIComponent(keyword)}`;
      location.push(url);
    }
  };
  const clearSearchValue = () => {
    setSearchMessage('');
    setShowSearchResult(false);
  };
  const handleMicrophone = () => {
    setIsFirstRender(false);
    if (listening) {
      abortListening();
      setSearchMessage('');
    } else {
      startListening();
    }
  };
  return (
    <SearchBarStyled onSubmit={() => handleSearchSubmit(searchMessage)}>
      <CmsData
        identifier="HEADER_SEARCHBOX_TEXT"
        ssr={false}
        wrapper={false}
        callback={StaticCmsSearchPlaceholder}
        state={setSearchPlaceholder}
      />
      <ClickOutside
        visible={showSearchResult}
        fnCallback={() => {
          setShowSearchResult(false);
          setSearchMessage('');
        }}
      >
        <SearchBarInputStyled
          autoComplete="off"
          type="search"
          placeholder={
            !listening ? searchPlaceHolder : translate('search_box.listening')
          }
          value={searchMessage}
          onChange={e => handleSearchMessageChange(e)}
          onClick={() => setShowSearchResult(true)}
          id={generateElementId(
            ELEMENT_TYPE.TEXT,
            ELEMENT_ACTION.EDIT,
            `SearchBar`,
            'MobileHeaderMenu',
          )}
          listening={listening}
          disabled={listening ? 'disabled' : ''}
        />
        <SearchIconStyled
          src="/static/icons/Searching.svg"
          listening={listening}
        />
        {hasMicrophone && (
          <MicrophoneIconStyled
            src={
              listening
                ? '/static/icons/Record.svg'
                : '/static/icons/MicrophoneBlackShape.svg'
            }
            onClick={handleMicrophone}
          />
        )}
        {showSearchResult && (
          <SearchResultProductsDesktop
            visible
            showDefaultLayout={searchMessage.length < 3}
            suggestedCategories={suggestedCategories}
            suggestedProducts={suggestedProducts}
            topSearchKeywords={topSearchKeywords}
            recentSearch={recentSearch}
            trendingSearch={trendingSearch}
            clearSearchValue={clearSearchValue}
            setTrendingSearch={setTrendingSearch}
            setRecentSearch={setRecentSearch}
            searchMessage={searchMessage}
          />
        )}
      </ClickOutside>
    </SearchBarStyled>
  );
};

export default SpeechRecognition({ autoStart: false, continuous: false })(
  withDeviceDetect(
    withStoreConfig(withSuggestion(withRoutes(withLocales(SearchBarDesktop)))),
  ),
);
