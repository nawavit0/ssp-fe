import React from 'react';
import propTypes from 'prop-types';
import { Skeleton, Link } from '@central-tech/core-ui';
import styled from 'styled-components';
import RunningText from '../Header/RunningText';
import ImageV2 from '../Image/ImageV2';
import { Cms } from '../CMSGrapesjsView';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';
import { get } from 'lodash';
import SearchBarDummy from '../SearchBar/components/SearchBarDummy';
import RenderMiniQty from './CartQty';

const WrapperStyled = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 10;
`;
const RunningBarStyled = styled.div`
  background-color: #000;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #ffffff;
  a {
    width: 100%;
    text-align: center;
  }
`;
const MenuBarStyled = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
  background-color: ${props => props.theme.color.defaultSsp};
  justify-content: space-between;
  height: 56px;
  align-items: center;
  padding: 0 10px;
`;
const LineStyled = styled.div`
  border-bottom: 1px solid #ffffff;
  width: 22px;
  height: 5px;
`;
const HamburgerStyled = styled.div`
  height: 20px;
  display: inline-block;
  margin-right: 6px;
`;
const SearchSectionStyled = styled.div`
  width: 100%;
  position: relative;
`;
const MiddleSideStyled = styled.div`
  margin: 0 6px 0 6px;
  width: 100%;
`;
const LeftSideStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 80px;
`;
const RightSideStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 80px;
`;
const CustomCartLink = styled(Link)`
  margin: 0 10px 0 12px;
  position: relative;
`;
const skeletonSkinny = () => {
  return (
    <Skeleton
      time={3}
      width="100%"
      borderRadius={0}
      height="50px"
      margin="0 auto"
      style={{
        maxWidth: '1024px',
        float: 'none',
      }}
    />
  );
};
const MobileHeader = (
  {
    onToggleMenu,
    pageName,
    setIsOpenSearchBarModal,
    browserSupportsSpeechRecognition,
    startListening,
  },
  { customer },
) => {
  const isGuest = !get(customer, 'id', false);
  const guestCartId = get(customer, 'guest.cartId', '');

  return (
    <>
      <WrapperStyled>
        <RunningBarStyled>
          <RunningText identifier="mobileWeb|CMS_HOMEPAGE_RUNNING_TEXT" />
        </RunningBarStyled>
        <MenuBarStyled>
          <LeftSideStyled>
            <HamburgerStyled
              onClick={() => onToggleMenu(true)}
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.VIEW,
                `HamburgerMenu`,
                'MobileHeaderMenu',
              )}
            >
              <LineStyled />
              <LineStyled />
              <LineStyled />
              <LineStyled />
            </HamburgerStyled>
            <Link
              to="/"
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                `HomePage`,
                'MobileHeader',
              )}
            >
              <ImageV2
                src={'/static/images/LogoMobileSsp.svg'}
                customStyle={`
                  width: 49px;
                  height: 35px;
                  max-width: none;
                `}
              />
            </Link>
          </LeftSideStyled>
          <MiddleSideStyled>
            <SearchSectionStyled>
              <SearchBarDummy
                setIsOpenSearchBarModal={setIsOpenSearchBarModal}
                browserSupportsSpeechRecognition={
                  browserSupportsSpeechRecognition
                }
                startListening={startListening}
              />
            </SearchSectionStyled>
          </MiddleSideStyled>
          <RightSideStyled>
            <Link
              to={
                customer && customer.firstname ? '/account/overview' : '/login'
              }
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                `AccountOrLogin`,
                'MobileHeader',
              )}
            >
              <ImageV2
                src={
                  customer && customer.firstname
                    ? '/static/icons/AfterLogin.svg'
                    : '/static/icons/BeforeLogin.svg'
                }
                customStyle={`
                  width: 23px;
                  height: 23px;
                  margin-left: 8px;
                  max-width: none;
                `}
              />
            </Link>
            <CustomCartLink
              to="/cart"
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                `Cart`,
                'MobileHeader',
              )}
            >
              <RenderMiniQty
                isGuest={isGuest}
                guestCartId={guestCartId}
                isMobile
              />
              <ImageV2
                src={'/static/icons/ShoppingBag.svg'}
                customStyle={`
                  width: 19px;
                  height: 25px;
                  max-width: none;
                `}
              />
            </CustomCartLink>
          </RightSideStyled>
        </MenuBarStyled>
      </WrapperStyled>
      {pageName !== 'product' && (
        <Cms
          identifier="mobileWeb|SKINNY_BANNER"
          ssr={false}
          blockLoading={skeletonSkinny}
        />
      )}
    </>
  );
};

MobileHeader.defaultProps = {
  onToggleMenu: () => null,
};
MobileHeader.contextTypes = {
  customer: propTypes.object,
};

export default MobileHeader;
