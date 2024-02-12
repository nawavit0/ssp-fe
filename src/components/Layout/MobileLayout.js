import React, { memo, useState, useEffect } from 'react';
import SpeechRecognition from 'react-speech-recognition';
import styled from 'styled-components';
import MobileHeader from '../Header/MobileHeader';
import MobileMenu from '../Header/MobileMenu';
import { FooterMobile } from '../Footer';
import GlobalStyle from '../../styles/global';
import SearchBarMobileModal from '../SearchBar/components/SearchBarMobileModal';
import GlobalMobileStyle from '../../styles/globalMobile';
import propTypes from 'prop-types';

const WrapperStyled = styled.div`
  width: 100%;
  padding-top: 76px;
`;
const ContainerStyled = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0;
`;

const MobileLayout = (
  {
    children,
    pageName,
    listening,
    transcript,
    browserSupportsSpeechRecognition,
    startListening,
    abortListening,
    resetTranscript,
  },
  { deviceDetect },
) => {
  const [isOpenMenu, onToggleMenu] = useState(false);
  const [isOpenSearchBarModal, setIsOpenSearchBarModal] = useState(false);
  const { os } = deviceDetect;
  useEffect(() => abortListening(), [abortListening]);
  return (
    <WrapperStyled id="layout" className={`device-os-${os.toLowerCase()}`}>
      <GlobalStyle />
      <GlobalMobileStyle />
      <MobileHeader
        onToggleMenu={onToggleMenu}
        pageName={pageName}
        setIsOpenSearchBarModal={setIsOpenSearchBarModal}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        startListening={startListening}
      />
      <MobileMenu
        onToggleMenu={onToggleMenu}
        isOpenMenu={isOpenMenu}
        setIsOpenSearchBarModal={setIsOpenSearchBarModal}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        startListening={startListening}
        pageName={pageName}
      />
      {isOpenSearchBarModal && (
        <SearchBarMobileModal
          startListening={startListening}
          abortListening={abortListening}
          listening={listening}
          setIsOpenSearchBarModal={setIsOpenSearchBarModal}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
          onToggleMenu={onToggleMenu}
          transcript={transcript}
          resetTranscript={resetTranscript}
        />
      )}
      <ContainerStyled>{children}</ContainerStyled>
      <FooterMobile />
    </WrapperStyled>
  );
};

MobileLayout.contextTypes = {
  deviceDetect: propTypes.object,
};

export default SpeechRecognition({ autoStart: false, continuous: false })(
  memo(MobileLayout),
);
