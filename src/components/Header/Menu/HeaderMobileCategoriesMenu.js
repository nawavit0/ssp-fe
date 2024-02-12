import React, { memo } from 'react';
import { withLocales, withRoutes } from '@central-tech/core-ui';
import styled from 'styled-components';
import ImageV2 from '../../Image/Image';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';
import SearchBarDummy from '../../SearchBar/components/SearchBarDummy';

const HeaderStyled = styled.div`
  border-bottom: 1px solid #d5d6d7;
  min-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 15px;
`;
const ChangeLanguageStyled = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  color: #6a6969;
`;
const SelectLanguage = styled.select`
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  top: 0;
`;
const SearchSectionStyled = styled.div`
  width: 65%;
  position: relative;
  border: 1px solid #e6e6e6;
  padding: 0;
`;
const customImage = `
  margin-right: 8px;
`;
const HeaderMobileCategoriesMenu = ({
  onToggleMenu,
  lang,
  location,
  translate,
  setIsOpenSearchBarModal,
  startListening,
  browserSupportsSpeechRecognition,
  pageName,
}) => {
  return (
    <HeaderStyled>
      <SearchSectionStyled>
        <SearchBarDummy
          setIsOpenSearchBarModal={setIsOpenSearchBarModal}
          startListening={startListening}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        />
      </SearchSectionStyled>
      <ChangeLanguageStyled>
        <SelectLanguage
          value={lang}
          id={generateElementId(
            ELEMENT_TYPE.SELECT,
            ELEMENT_ACTION.VIEW,
            'Language',
            'MobileHeaderMenu',
          )}
          onChange={e => {
            if (lang !== e.target.value) {
              window.handleChangeLanguage(e.target.value, location, pageName);
            }
          }}
        >
          <option value="th">{translate('header.thai_language')}</option>
          <option value="en">{translate('header.eng_language')}</option>
        </SelectLanguage>
        <ImageV2
          src={
            lang === 'en'
              ? `/static/icons/ThaiLanguage.svg`
              : `/static/icons/EngLanguage.svg`
          }
          width="20px"
          customStyle={customImage}
        />{' '}
        {lang === 'en'
          ? translate('header.thai_language_sort')
          : translate('header.eng_language')}
      </ChangeLanguageStyled>
      <ImageV2
        src="/static/icons/CloseIcon.svg"
        onClick={() => onToggleMenu(false)}
        id={generateElementId(
          ELEMENT_TYPE.BUTTON,
          ELEMENT_ACTION.VIEW,
          'Close',
          'MobileHeaderMenu',
        )}
        customStyle={`
          width: 18px;
          margin-right: 10px;
        `}
      />
    </HeaderStyled>
  );
};
export default memo(withRoutes(withLocales(HeaderMobileCategoriesMenu)));
