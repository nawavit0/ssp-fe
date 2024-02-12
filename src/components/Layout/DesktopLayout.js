import React, { memo } from 'react';
import styled from 'styled-components';
import DesktopHeader from '../Header/DesktopHeader';
import { Footer } from '../Footer';
import GlobalStyle from '../../styles/global';
import GlobalDesktopStyle from '../../styles/globalDesktop';
import propTypes from 'prop-types';
import { Container, Skeleton } from '@central-tech/core-ui';
import { Cms } from '../CMSGrapesjsView';

const Wrapper = styled.div`
  width: 100%;
`;
const ContainerStyled = styled(Container)`
  width: 100%;
  margin: 0 auto;
  padding: 0;
`;
const CmsBlockHeaderStyled = styled.div`
  @media print {
    display: none;
  }
`;

const skeletonSkinny = () => {
  return (
    <Skeleton
      time={3}
      width="100%"
      borderRadius={0}
      height="100px"
      margin="0 auto"
      style={{
        maxWidth: '1366px',
        float: 'none',
      }}
    />
  );
};

const DesktopLayout = ({ children, pageName = '' }) => {
  return (
    <Wrapper id="layout">
      <GlobalStyle />
      <GlobalDesktopStyle />
      <DesktopHeader pageName={pageName} />
      <ContainerStyled>
        <CmsBlockHeaderStyled>
          {pageName !== 'product' && (
            <Cms
              identifier="SKINNY_BANNER"
              ssr={false}
              blockLoading={skeletonSkinny}
            />
          )}
        </CmsBlockHeaderStyled>
        {children}
      </ContainerStyled>
      <Footer />
    </Wrapper>
  );
};

DesktopLayout.propTypes = {
  pageName: propTypes.string,
};

export default memo(DesktopLayout);
