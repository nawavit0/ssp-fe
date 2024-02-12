import React, { useState, useEffect, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Cms } from '../../CMSGrapesjsView';
import { withLocales, Link } from '@central-tech/core-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';
import { handleTransFormCategory } from '../../../utils/categories';
import MainContentTemplate from './templateMegaMenu/MainContentTemplate';
import history from '../../../history';

const MenuStyled = styled.div`
  display: flex;
  justify-content: space-between;
  color: #ffffff;
  width: ${props => props.width || '100%'};
  font-size: 16px;
  font-weight: bold;
  justify-content: center;
  animation: animateElement linear 0.3s;
  animation-iteration-count: 1;
  position: relative;
  a {
    line-height: 24px;
    color: #ffffff;
    font-weight: bold;
    display: block;
    width: 100%;
    text-align: center;
    height: auto;
    padding: 5px 0px 5px 0px;
  }
  @keyframes animateElement {
    0% {
      opacity: 0;
      transform: translate(0px, 0px);
    }
    100% {
      opacity: 1;
      transform: translate(0px, 0px);
    }
  }
  ${props => props.customStyle || ''}
`;
const MegaMenuStyled = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 34px;
  background-color: #ffffff;
  z-index: 3;
  width: 1366px;
  margin: 0 auto;
`;
const MenuVirtualCategoryStyled = styled(MenuStyled)`
  background-color: ${props => props.color || '#f7c646'};
  ${props => props.customStyle || ''};
`;
const CategoryMenuStyled = styled.div`
  max-width: ${props => props.theme.container.maxWidth}px;
  width: 100%;
  display: flex;
  margin: 0 auto;
`;
const HoverAreaStyled = styled.div`
  width: 100%;
  .mega-menu-section-${props => props.type || ''} {
    display: none;
  }
  .bg-mega-menu {
    display: none;
  }
  &:hover {
    .button-mega-menu-${props => props?.type || ''} {
      a {
        background-color: #ffffff;
        color: #13283f;
      }
    }
    .bg-mega-menu {
      background-color: #000000;
      opacity: 0.7;
      position: absolute;
      top: 34px;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2;
      height: 100vh;
    }
  }
  ${props =>
    props?.isOnHover &&
    css`
      &:hover {
        .mega-menu-section-${props => props?.type || ''} {
          display: block;
        }
        .button-mega-menu-${props => props?.type || ''} {
          a {
          }
        }
        .bg-mega-menu {
          display: block;
        }
      }
    `}
`;
const PopularBrandStyled = styled.div`
  width: 100%;
  padding: 0 40px;
`;

const renderCmsCampaign = (
  { html, id, loading },
  setLoading,
  setCmsCampaign,
) => {
  if (!loading) {
    setLoading(false);
    if (html) {
      return <MenuStyled id={id} dangerouslySetInnerHTML={{ __html: html }} />;
    }
    setCmsCampaign(false);
  }
  return null;
};

const MainMenu = ({ categories, isOnHover, setIsOnHover, translate }) => {
  const [isLoading, setLoading] = useState(true);
  const [hasCmsCampaign, setCmsCampaign] = useState(true);
  const mainCategoriesUrlPath = [
    'women',
    'men',
    'sports',
    'sports/running',
    'sports/football',
    'kids',
  ];
  const activeCategories = handleTransFormCategory(
    categories,
    mainCategoriesUrlPath,
  );
  useEffect(() => {
    return history.listen(() => {
      setIsOnHover(false);
    });
  }, [setIsOnHover]);

  return (
    <>
      <CategoryMenuStyled hasCmsCampaign={hasCmsCampaign}>
        <Cms
          identifier="CMS_MAIN_MENU_CAMPAIGN"
          ssr={false}
          hasRenderJs={false}
          wrapContent={html =>
            renderCmsCampaign(html, setLoading, setCmsCampaign)
          }
        />
        {!isLoading && (
          <>
            {activeCategories.map((category, index) => {
              if (!category) return null;
              const urlKey = category?.url_key || '';
              const urlPath = category?.url_path || '';
              const categoryName = category?.name || '';
              const childrenData = category?.children_data || [];
              const groupSegment = category?.groupSegment || {};

              return (
                <Fragment key={`menu${index}`}>
                  <HoverAreaStyled type={urlKey} isOnHover={isOnHover}>
                    <div
                      onMouseEnter={() => {
                        setIsOnHover(true);
                      }}
                      onMouseLeave={() => {
                        setIsOnHover(false);
                      }}
                    >
                      <MenuStyled
                        key={urlKey}
                        className={`button-mega-menu-${urlKey}`}
                      >
                        <Link
                          to={`/${urlPath}`}
                          id={generateElementId(
                            ELEMENT_TYPE.LINK,
                            ELEMENT_ACTION.VIEW,
                            `Category${urlKey}`,
                            'HeaderMenu',
                          )}
                        >
                          {categoryName}
                        </Link>
                      </MenuStyled>
                      <MegaMenuStyled
                        className={`mega-menu-section-${urlKey}`}
                        type={urlKey}
                      >
                        <MainContentTemplate
                          type={urlKey}
                          urlPath={urlPath}
                          menuList={childrenData}
                          name={categoryName}
                          groupSegment={groupSegment}
                        />
                        <PopularBrandStyled>
                          <Cms
                            identifier={`MEGA_MENU_POPULAR_BRAND_${urlKey.toUpperCase()}`}
                            ssr={false}
                          />
                        </PopularBrandStyled>
                      </MegaMenuStyled>
                    </div>
                    <div className="bg-mega-menu" />
                  </HoverAreaStyled>
                </Fragment>
              );
            })}
            <HoverAreaStyled type="brands" isOnHover={isOnHover}>
              <div className="bg-mega-menu" />
              <div
                onMouseEnter={() => {
                  setIsOnHover(true);
                }}
                onMouseLeave={() => {
                  setIsOnHover(false);
                }}
              >
                <MenuStyled className={`button-mega-menu-brands`}>
                  <Link
                    to={`/brands`}
                    id={generateElementId(
                      ELEMENT_TYPE.LINK,
                      ELEMENT_ACTION.VIEW,
                      'AllBrands',
                      'HeaderMenu',
                    )}
                  >
                    {translate('main_menu.brands')}
                  </Link>
                </MenuStyled>
                <MegaMenuStyled
                  className={`mega-menu-section-brands`}
                  type="brands"
                >
                  <MainContentTemplate type="brands" />
                </MegaMenuStyled>
              </div>
            </HoverAreaStyled>
            <MenuStyled
              customStyle={`
              padding: 0 10px 0 10px;
              white-space: nowrap;
            `}
            >
              <Link
                to={`http://www.supersports.co.th/store/supersports/`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'Store',
                  'HeaderMenu',
                )}
                native
              >
                {translate('main_menu.in_store')}
              </Link>
            </MenuStyled>

            <MenuVirtualCategoryStyled
              customStyle={'margin: 0px 6px 0 0;padding: 0 30px;'}
            >
              <Link
                to={`/new_arrivals`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'NewArrivals',
                  'HeaderMenu',
                )}
              >
                {translate('main_menu.new_arrivals')}
              </Link>
            </MenuVirtualCategoryStyled>
            <MenuVirtualCategoryStyled color={'#E1372A'}>
              <Link
                to={`/sale`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'Sale',
                  'HeaderMenu',
                )}
              >
                {translate('main_menu.sale')}
              </Link>
            </MenuVirtualCategoryStyled>
          </>
        )}
      </CategoryMenuStyled>
    </>
  );
};

export default withLocales(MainMenu);
