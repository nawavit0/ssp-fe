import React, { memo, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';
import { CategoriesWidget, Link, withLocales } from '@central-tech/core-ui';
import LazyLoad from 'react-lazyload';
import styled from 'styled-components';
import { MobileCategories, HeaderMobileCategoriesMenu } from './Menu';
import ImageV2 from '../Image/ImageV2';
import { Cms, CmsData } from '../CMSGrapesjsView';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';
import { handleTransFormCategory } from '../../utils/categories';
import MobileTrackOrder from './Menu/MobileTrackOrder';

const SideMenuBox = styled.div`
  position: relative;
`;
const customImage = `
  margin-right: 7px;
`;
const MobileMenuStyled = styled.div`
  position: fixed;
  display: flex;
  background-color: #ffffff;
  flex-direction: column;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 30;
  transition: transform 0.2s;
  overflow-y: auto;
  ${props =>
    props.isOpenMenu
      ? `
    &.mobileMainMenu {
      transition: right 400ms 0ms;
      right: 0;
    }
  `
      : `
    &.mobileMainMenu {
      transition: right 400ms 0ms;
      right: 100%;
    }
  `}
`;
const ScrollStyled = styled.div`
  overflow-y: auto;
  position: relative;
`;
const ListStaticMenuStyled = styled.div`
  display: flex;
  flex-direction: column;
  a {
    border-bottom: 1px solid #e6e6e6;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 18px;
    padding-right: 16px;
    font-size: 14px;
    color: #7a7979;
    font-weight: 400;

    &.newArrivalBlockLink {
      background-color: #f7c646;
      color: #ffffff;
      font-weight: 400;
      border-bottom: 1px solid #ffffff;
    }
    &.saleBlockLink {
      background-color: #e1372a;
      color: #ffffff;
      font-weight: 400;
      border-bottom: 1px solid #ffffff;
    }
    &.allBrandBlockLink {
      color: #474747;
      font-weight: 400;
      justify-content: space-between;
    }
    &.loggedAccount {
      color: #454545;
      font-weight: bold;
    }
  }
`;
const CampaignStyled = styled.div`
  border-bottom: 1px solid #e6e6e6;
`;
const FooterBannerStyled = styled.div`
  padding-left: 13px;
`;
const ViewAllBrandsStyled = styled(Link)`
  border-bottom: 1px solid #e6e6e6;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 18px;
  padding-right: 16px;
  color: #474747;
  font-weight: 300;
  font-size: 14px;
`;
const MenuBlockStyled = styled(Link)`
  border-bottom: 1px solid #e6e6e6;
  height: 50px;
  display: flex;
  justify-content: ${props =>
    props.justifyContent ? props.justifyContent : 'space-between'};
  align-items: center;
  padding-left: 18px;
  padding-right: 16px;
  color: #474747;
  font-weight: 400;
  font-size: 14px;
`;
const StaticBrandsStyled = styled.div`
  display: flex;
  flex-direction: column;
  a {
    border-bottom: 1px solid #e6e6e6;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 18px;
    padding-right: 16px;
    color: #666666;
    font-weight: 400;
    font-size: 14px;
    justify-content: start;
  }
`;
const ArrowLeftIconStyled = styled(ImageV2)`
  overflow: hidden;
  transform: translateX(-7px);
`;
const staticCmsBrands = ({ html }) => {
  const content = ReactHtmlParser(html);

  return <StaticBrandsStyled>{content}</StaticBrandsStyled>;
};
const MobileMenu = (
  {
    translate = () => null,
    isOpenMenu = false,
    onToggleMenu = () => null,
    setIsOpenSearchBarModal = false,
    browserSupportsSpeechRecognition = false,
    startListening,
    pageName,
  },
  { customer },
) => {
  const [isViewBrands, setViewBrands] = useState(false);
  const [isInitialData, setInitialData] = useState(false);
  const [isOpenTrackOrder, setOpenTrackOrder] = useState(false);

  const mainCategoriesUrlPath = [
    'women',
    'men',
    'sports',
    'sports/running',
    'sports/football',
    'kids',
  ];

  const handleTrackOrderMenu = isOpen => {
    setOpenTrackOrder(isOpen);
  };

  useEffect(() => {
    if (isOpenMenu && !isInitialData) {
      setTimeout(() => setInitialData(true), 501);
    }
  });

  return (
    <MobileMenuStyled isOpenMenu={isOpenMenu} className="mobileMainMenu">
      <ScrollStyled>
        <HeaderMobileCategoriesMenu
          onToggleMenu={onToggleMenu}
          setIsOpenSearchBarModal={setIsOpenSearchBarModal}
          browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
          startListening={startListening}
          pageName={pageName}
        />
        <SideMenuBox>
          <MobileTrackOrder
            onToggleMenu={onToggleMenu}
            isOpenTrackOrder={isOpenTrackOrder}
            setOpenTrackOrder={handleTrackOrderMenu}
          />
          {isViewBrands ? (
            <>
              <MenuBlockStyled
                onClick={() => setViewBrands(false)}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  `BackParentCategory`,
                  'MobileHeaderMenu',
                )}
                justifyContent="start"
              >
                <ArrowLeftIconStyled
                  src="/static/icons/ArrowLeft.svg"
                  width="24"
                />
                <div>{translate('back')}</div>
              </MenuBlockStyled>
              <ViewAllBrandsStyled
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  `ViewAllBrands`,
                  'MobileHeaderMenu',
                )}
                onClick={() => {
                  setViewBrands(false);
                  onToggleMenu(false);
                }}
                to={`/brands`}
              >
                {`${translate('view_all_brands')}`}
              </ViewAllBrandsStyled>
              <CmsData
                identifier="mobileWeb|MAIN_MENU_POPULAR_BRANDS"
                ssr={false}
                wrapper={false}
                callback={staticCmsBrands}
              />
            </>
          ) : null}
          {isInitialData ? (
            <LazyLoad height={300} once>
              <CategoriesWidget ssr={false}>
                {({ data, loading }) => {
                  if (loading) return 'loding';
                  const categories = (data && data.categories) || [];
                  const activeCategories = handleTransFormCategory(
                    categories,
                    mainCategoriesUrlPath,
                  );

                  return (
                    <MobileCategories
                      categories={activeCategories}
                      onToggleMenu={onToggleMenu}
                      isHiddenMenu={isViewBrands}
                      renderStaticMenuTop={() => {
                        return !isViewBrands ? (
                          <CampaignStyled>
                            <Cms
                              identifier="mobileWeb|CMS_MAIN_MENU_CAMPAIGN"
                              ssr={false}
                              hasRenderJs={false}
                            />
                          </CampaignStyled>
                        ) : null;
                      }}
                      renderStaticMenuButtom={() => {
                        return !isViewBrands ? (
                          <>
                            <MenuBlockStyled
                              onClick={() => setViewBrands(true)}
                            >
                              {translate('main_menu.brands')}
                              <ImageV2
                                src="/static/icons/ArrowRight.svg"
                                width="24"
                              />
                            </MenuBlockStyled>
                            <ListStaticMenuStyled>
                              <Link
                                onClick={() => onToggleMenu(false)}
                                to={`/new_arrivals`}
                                className="newArrivalBlockLink"
                                id={generateElementId(
                                  ELEMENT_TYPE.LINK,
                                  ELEMENT_ACTION.VIEW,
                                  'NewArrivals',
                                  'MobileHeaderMenu',
                                )}
                              >
                                {translate('main_menu.new_arrivals')}
                              </Link>
                              <Link
                                onClick={() => onToggleMenu(false)}
                                to={`/sale`}
                                className="saleBlockLink"
                                id={generateElementId(
                                  ELEMENT_TYPE.LINK,
                                  ELEMENT_ACTION.VIEW,
                                  'Sale',
                                  'MobileHeaderMenu',
                                )}
                              >
                                {translate('main_menu.sale')}
                              </Link>
                            </ListStaticMenuStyled>
                          </>
                        ) : null;
                      }}
                    />
                  );
                }}
              </CategoriesWidget>
            </LazyLoad>
          ) : null}
          <ListStaticMenuStyled>
            {customer && customer.firstname ? (
              <MenuBlockStyled
                onClick={() => onToggleMenu(false)}
                to={`/account/overview`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'AccountName',
                  'MobileHeaderMenu',
                )}
                className="loggedAccount"
              >
                <div>
                  <ImageV2
                    src={'/static/icons/AfterLoginMobile.svg'}
                    width={15}
                    height={15}
                    customStyle={customImage}
                  />
                  {`${translate('header.welcome_mobile_customer')} ${
                    customer.firstname
                  } ${customer.lastname}`}
                </div>
                <ImageV2 src="/static/icons/ArrowRight.svg" width="24" />
              </MenuBlockStyled>
            ) : (
              <MenuBlockStyled
                onClick={() => onToggleMenu(false)}
                to={`/login`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'Login',
                  'MobileHeaderMenu',
                )}
              >
                <div>
                  <ImageV2
                    src={'/static/icons/BeforeLoginMobile.svg'}
                    width="15"
                    height="15"
                    customStyle={customImage}
                  />
                  {translate('header.login_and_register')}
                </div>
                <ImageV2 src="/static/icons/ArrowRight.svg" width="24" />
              </MenuBlockStyled>
            )}
            <Link
              onClick={() => onToggleMenu(false)}
              to={customer && customer.firstname ? `/account/wishlist` : `/`}
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                'wishlist',
                'MobileHeaderMenu',
              )}
            >
              <ImageV2
                src={'/static/icons/WishlistMobile.svg'}
                width={15}
                height={15}
                customStyle={customImage}
              />
              {translate('header.wishlist')}
            </Link>
            <Link
              onClick={() => handleTrackOrderMenu(true)}
              //to={customer.firstname ? `/account/orders/asdasddasad` : ''}
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                'TrackOrder',
                'MobileHeaderMenu',
              )}
            >
              <ImageV2
                src={'/static/icons/TracYourOrderMobile.svg'}
                width={15}
                height={15}
                customStyle={customImage}
              />
              {translate('header.track_my_order')}
            </Link>
            <Link
              onClick={() => onToggleMenu(false)}
              to={`/store`}
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                'StoreLocator',
                'MobileHeaderMenu',
              )}
            >
              <ImageV2
                src={'/static/icons/StoreLocationMobile.svg'}
                width={15}
                height={15}
                customStyle={customImage}
              />
              {translate('header.store_locator')}
            </Link>
            <Link
              onClick={() => onToggleMenu(false)}
              to={`/store/supersports`}
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                'InStore',
                'MobileHeaderMenu',
              )}
            >
              {translate('main_menu.in_store')}
            </Link>
            {customer && customer.firstname ? (
              <Link
                to={`/logout`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'Logout',
                  'MobileHeaderMenu',
                )}
                native
              >
                {translate('header.log_out')}
              </Link>
            ) : null}
          </ListStaticMenuStyled>
          {isInitialData ? (
            <LazyLoad height={250} once>
              <FooterBannerStyled>
                <Cms
                  identifier="mobileWeb|MAIN_MENU_CAMPAIGN_FOOTER"
                  ssr={false}
                  hasRenderJs={false}
                />
                {!isViewBrands ? (
                  <Cms
                    identifier="mobileWeb|MAIN_MENU_FOOTER_POP_BRANDS"
                    ssr={false}
                    hasRenderJs={false}
                  />
                ) : null}
              </FooterBannerStyled>
            </LazyLoad>
          ) : null}
        </SideMenuBox>
      </ScrollStyled>
    </MobileMenuStyled>
  );
};

MobileMenu.contextTypes = {
  customer: propTypes.object,
};

export default memo(withLocales(MobileMenu));
