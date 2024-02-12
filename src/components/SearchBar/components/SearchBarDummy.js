import React, { useState } from 'react';
import styled from 'styled-components';
import { CmsData } from '../../CMSGrapesjsView';
import { stripHtmlTag } from '../../../utils/stripHtmlTag';

const SearchBarDummyStyled = styled.div`
  width: 100%;
  position: relative;
  input {
    font-size: 10px !important;
  }
`;
const SearchBarDummyInputStyled = styled.input`
  width: 100%;
  background-color: #fff;
  padding-left: 25px;
  border: none;
  color: transparent;
  border-radius: 1px;
  height: 26px;
  line-height: 26px;
  &:focus {
    outline: none;
  }
  ::placeholder {
    color: ${props => (props.listening ? '#fff' : '#b2b5bd')};
  }
  ${props => (props.customSearchStyle ? props.customSearchStyle : '')};
`;
const SearchIconStyled = styled.img`
  width: 12px;
  height: 12px;
  display: ${props => (props.listening ? 'none' : 'relative')};
  position: absolute;
  left: 5px;
  top: 48%;
  transform: translateY(-50%);
`;
const MicrophoneIconStyled = styled.img`
  width: 10px;
  height: 14px;
  background-color: transparent;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
`;

const SearchBarDummy = ({
  setIsOpenSearchBarModal,
  startListening,
  browserSupportsSpeechRecognition,
  customSearchStyle = '',
}) => {
  const [searchPlaceHolder, setSearchPlaceholder] = useState('');
  const StaticCmsSearchPlaceholder = ({ html, state }) => {
    const removeTag = stripHtmlTag(html);
    const output = removeTag.replace(/&#x[0-9A-Fa-f]+;/g, htmlCode => {
      const codePoint = parseInt(htmlCode.slice(3, -1), 16);
      return String.fromCharCode(codePoint);
    });
    if (output) state(output);
  };
  return (
    <SearchBarDummyStyled>
      <CmsData
        identifier="mobileWeb|HEADER_SEARCHBOX_TEXT"
        ssr={false}
        wrapper={false}
        callback={StaticCmsSearchPlaceholder}
        state={setSearchPlaceholder}
      />
      <SearchBarDummyInputStyled
        placeholder={searchPlaceHolder}
        listening={false}
        value=""
        onClick={() => setIsOpenSearchBarModal(true)}
        customSearchStyle={customSearchStyle}
        readOnly
      />
      <SearchIconStyled src="/static/icons/Searching.svg" listening={false} />
      {browserSupportsSpeechRecognition && (
        <MicrophoneIconStyled
          src="/static/icons/MicrophoneBlackShape.svg"
          onClick={() => {
            setIsOpenSearchBarModal(true);
            startListening();
          }}
        />
      )}
    </SearchBarDummyStyled>
  );
};

export default SearchBarDummy;
