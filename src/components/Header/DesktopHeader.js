import React, { useState } from 'react';
import Headroom from 'react-headroom';
import {
  withLocales,
  withRoutes,
  Link,
  CategoriesWidget,
  withCustomer,
} from '@central-tech/core-ui';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';
import styled from 'styled-components';
import SearchBarDesktop from '../SearchBar/SearchBarDesktop';
import ImageV2 from '../Image/ImageV2';
import {
  MainMenu,
  CustomerInfo,
  ChangeLanguage,
  OpenCart,
  OpenDesktopTrackOrder,
  DesktopOpenWishlist,
} from './Menu';
import RunningText from './RunningText';
import PopupAddToCart from '../../routes/urlRewrite/product/components/desktop/PopupAddToCart';

const RenderDesktopHeaderStyled = styled.div`
  @media print {
    display: none;
  }
`;
const HeaderFixedStyled = styled.div`
  position: fixed;
  width: 100%;
  z-index: 4;
  top: 0px;
`;
const HeaderSpaceStyled = styled.div`
  height: 113px;
`;
const UpperHeaderContainerStyled = styled.div`
  font-size: 12px;
  display: flex;
  color: ${props => props.theme.color.whiteBase};
  line-height: 32px;
  height: 32px;
  overflow: hidden;
  .linkBlockCenter {
    width: 60%;
    justify-content: space-between;
    .flickity-slider {
      div {
        width: 100%;
        text-align: center;
      }
      a {
        width: 100%;
        text-align: center;
      }
    }
  }
`;
const LinkBlockLeftStyled = styled.div`
  width: 20%;
  justify-content: space-between;
  padding: 0 0 0 20px;
  display: block;
  cursor: pointer;
`;
const HeaderStyled = styled.div`
  z-index: 9;
  display: flex;
  justify-content: center;
  ${props => props.customStyle || ''};
  background-color: ${props => {
    return props.color === 'ssp'
      ? props.theme.color.defaultSsp
      : props.theme.color.blackBase;
  }};
  #cmsHomePageRunningText > div > div {
    background-color: #eee;
    div {
      padding: unset;
    }
  }
`;
const UpperHeaderStyled = styled.div`
  background-color: ${props => props.theme.color.blackBase};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;
const HeaderContenerStyled = styled.div`
  max-width: ${props => props.theme.container.maxWidth}px;
  width: 100%;
  ${props => props.customstyle || ''}
`;
const HeaderCategoryMenuStyled = styled(Headroom)`
  width: 100%;
  position: relative;
  > div {
    display: flex;
    flex-direction: column;
    margin: 0px auto;
    background-color: ${props => props.theme.color.defaultSsp};
    &.headroom--pinned {
      top: 113px !important;
      z-index: 3 !important;
      .popupAddtoCart {
        transition: all 0.2s ease-in-out 0s;
      }
    }
    &.headroom--unfixed {
      z-index: 3 !important;
      top: 0 !important;
      .popupAddtoCart {
        transition: all 0.2s ease-in-out 0s;
      }
    }
    &.headroom--unpinned {
      top: 112px !important;
      .popupAddtoCart {
        transition: all 0.2s ease-in-out 0s;
      }
      .bg-mega-menu {
        display: none;
      }
      div[class^='mega-menu-section-'] {
        display: none;
      }
    }
  }
`;
const LinkStoresStyled = styled.div`
  margin-left: 20px;
  cursor: pointer;
  float: left;
  span {
    margin-left: 2px;
    color: #ffffff;
    font-size: 12px;
  }
`;
const HeaderMainStyled = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #ffffff;
  height: 71px;
`;
const LeftStyled = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
`;
const RightStyled = styled.div`
  display: flex;
  width: 25%;
  justify-content: flex-start;
  align-items: center;
`;
const LogoStyled = styled(Link)`
  width: 363px;
  margin: 6px 0px 0px 19px;
  display: block;
`;
const SearchBarStyled = styled.div`
  flex: auto;
  margin: 6px 0 0 0;
`;
const PopupSectionStyled = styled.div`
  width: 1366px;
  position: relative;
  margin: 0 auto;
  height: 0;
`;

const DesktopHeader = ({ translate, pageName }) => {
  const [isOnHover, setIsOnHover] = useState(false);
  return (
    <RenderDesktopHeaderStyled>
      <HeaderSpaceStyled />
      <HeaderFixedStyled>
        <HeaderStyled>
          <HeaderContenerStyled>
            <UpperHeaderStyled>
              <UpperHeaderContainerStyled>
                <LinkBlockLeftStyled>
                  <ChangeLanguage pageName={pageName} />
                  <LinkStoresStyled>
                    <Link to="/store">
                      <ImageV2
                        src={'/static/icons/StoreLocation.svg'}
                        width="16px"
                      />
                      <span>{translate('header.store_locator')}</span>
                    </Link>
                  </LinkStoresStyled>
                </LinkBlockLeftStyled>
                <div className={'linkBlockCenter'}>
                  <RunningText identifier="CMS_HOMEPAGE_RUNNING_TEXT" />
                </div>
                <OpenDesktopTrackOrder />
              </UpperHeaderContainerStyled>
            </UpperHeaderStyled>
          </HeaderContenerStyled>
        </HeaderStyled>
        <HeaderStyled color={'ssp'} customStyle={'padding: 0 0 10px 0;'}>
          <HeaderContenerStyled>
            <HeaderMainStyled>
              <LeftStyled>
                <LogoStyled
                  to={'/'}
                  id={generateElementId(
                    ELEMENT_TYPE.IMAGE,
                    ELEMENT_ACTION.VIEW,
                    'GoToHome',
                    'Header',
                  )}
                >
                  <img width={343} src={'/static/images/Logo.svg'} />
                </LogoStyled>
                <SearchBarStyled>
                  <SearchBarDesktop key={'desktop'} />
                </SearchBarStyled>
              </LeftStyled>
              <RightStyled>
                <CustomerInfo />
                <DesktopOpenWishlist />
                <OpenCart />
              </RightStyled>
            </HeaderMainStyled>
          </HeaderContenerStyled>
        </HeaderStyled>
      </HeaderFixedStyled>
      <HeaderStyled color={'ssp'} customStyle={'height: 34px'}>
        <HeaderCategoryMenuStyled>
          <CategoriesWidget ssr={false}>
            {({ data, loading }) => {
              const categories = data?.categories || [];
              if (loading === false && categories) {
                return (
                  <MainMenu
                    categories={categories}
                    isOnHover={isOnHover}
                    setIsOnHover={setIsOnHover}
                  />
                );
              }
              return null;
            }}
          </CategoriesWidget>
          <PopupSectionStyled>
            <PopupAddToCart />
          </PopupSectionStyled>
        </HeaderCategoryMenuStyled>
      </HeaderStyled>
    </RenderDesktopHeaderStyled>
  );
};

export default withRoutes(withLocales(withCustomer(DesktopHeader)));
