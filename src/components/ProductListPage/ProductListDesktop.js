import React, { useState, useRef } from 'react';
import {
  BlockCMSBrandStyled,
  CustomButtonDesktopStyled,
  CustomRowStyled,
  PageSwitcherStyled,
  ParagraphLabelStyled,
  ReadMoreStyled,
  ResultProductBlockStyled,
  ResultProductTextStyled,
  TextElStyled,
  TitlePLPStyled,
  ProgressListStyled,
  FiltersStyled,
  ProductGridDesktopStyled,
  HideTextStyled,
} from './styled';
import { Col, Row, Skeleton, withLocales } from '@central-tech/core-ui';
import { Filters } from '../Filters';
import SubCategoryBlock from '../SubCategoryBlock/SubCategoryBlock';
import Sort from '../Sort/Sort';
import ProductGrid from '../ProductGrid';
import ProductGridSkeleton from '../ProductGridSkeleton/ProductGridSkeleton';
import { get as prop, ceil } from 'lodash';
import ImageV2 from '../Image/ImageV2';

const renderPageTitle = (
  cmsRender,
  title,
  description,
  brandLogo,
  translate,
  useFromPage,
  divContent,
  hideDescriptionFlag,
  setHideDescriptionFlag,
) => {
  const hideData = description === '' || !description ? '0' : '1';
  const heightOfContent = prop(divContent, 'current.clientHeight', 0);
  return (
    <TitlePLPStyled>
      <li>
        {!cmsRender && (
          <>
            <label
              data-hide={hideData}
              className={`collapse-btn`}
              htmlFor="collapse-plp-title"
            >
              {useFromPage === 'SEARCH' && (
                <TextElStyled as={`h3`}>
                  {translate('productPreview.searchResultsFor')}
                </TextElStyled>
              )}
            </label>
            <h1>{title}</h1>
          </>
        )}
        {description !== '' && (
          <div className={`collapse-panel`} data-hide={hideDescriptionFlag}>
            <div className={`collapse-inner`}>
              <ParagraphLabelStyled ref={divContent}>
                {description}
              </ParagraphLabelStyled>
            </div>
            {heightOfContent > 48 && (
              <>
                <ReadMoreStyled
                  onClick={() => setHideDescriptionFlag(false)}
                  className={`collapse-read`}
                >
                  {translate('productPreview.read_more')}
                </ReadMoreStyled>
                <HideTextStyled onClick={() => setHideDescriptionFlag(true)}>
                  {translate('product_detail.hide_text')}
                </HideTextStyled>
              </>
            )}
          </div>
        )}
      </li>
    </TitlePLPStyled>
  );
};

const ProductListDesktop = props => {
  const {
    title,
    description,
    loading,
    loadingFilter,
    loadingSubCategory,
    subCategoryObjList,
    // isBrandCategory,
    products,
    category,
    filters,
    sorting,
    useFromPage,
    priceRange,
    cmsRender,
    totalCount,
    fetchMore,
    isNoProduct,
    brandLogo,
    handleLoadMore,
    translate,
    location,
    sort,
    getActiveFilter,
  } = props;
  let sectionName = ``;
  if (useFromPage === 'SEARCH') {
    sectionName = `Search Result/${title}`;
  } else if (useFromPage === 'BRAND') {
    sectionName = `Brand/${title}`;
  } else if (useFromPage === 'CATEGORY') {
    const categoryUrlKey = category?.url_key || '';
    sectionName = `Category/${categoryUrlKey}`;
  }
  const progressBarPercentage = ceil(100 * products.length) / totalCount;
  const divContent = useRef(null);
  const [hideDescriptionFlag, setHideDescriptionFlag] = useState(true);
  return (
    <>
      <CustomRowStyled>
        <Col xs={12} md={3} lg="240px">
          {loading && loadingFilter ? (
            <>
              <Skeleton
                time={1}
                width="100%"
                borderRadius={0}
                height="600px"
                margin="0"
                style={{
                  float: 'none',
                }}
              />
            </>
          ) : null}
          <FiltersStyled isDisplay={!loadingFilter}>
            <Filters
              category={category}
              filters={filters}
              sorting={sorting}
              //onClickFilterExpands={this.handleShowFiltersMobile}
              getActiveFilter={getActiveFilter}
              useFromPage={useFromPage}
              priceRange={priceRange}
              loading={loading}
            />
          </FiltersStyled>
        </Col>
        <Col xs="0px" md="0" lg="26px" />
        <Col xs={12} md={9} lg="auto">
          <Row>
            <Col>
              {useFromPage === 'BRAND' && cmsRender && (
                <BlockCMSBrandStyled>{cmsRender}</BlockCMSBrandStyled>
              )}
              {title &&
                renderPageTitle(
                  cmsRender,
                  title,
                  description,
                  brandLogo,
                  translate,
                  useFromPage,
                  divContent,
                  hideDescriptionFlag,
                  setHideDescriptionFlag,
                )}
              {useFromPage === 'CATEGORY' && cmsRender && (
                <BlockCMSBrandStyled>{cmsRender}</BlockCMSBrandStyled>
              )}
            </Col>
          </Row>
          <Row>
            <Col>
              <SubCategoryBlock
                subCategoryObjList={subCategoryObjList}
                loading={loading && loadingSubCategory}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Sort location={location} activeSort={sort} />
            </Col>
            <Col>
              <ResultProductBlockStyled>
                <ResultProductTextStyled>
                  {products.length <= 0
                    ? translate('productPreview.product_results_not_found')
                    : `${translate(
                        products.length <= 1
                          ? 'productPreview.product_results_found'
                          : 'productPreview.products_results_found',
                        {
                          count: products.length,
                        },
                      )}${translate(
                        totalCount <= 1
                          ? 'productPreview.product_results_all'
                          : 'productPreview.products_results_all',
                        {
                          count: totalCount,
                        },
                      )}`}
                </ResultProductTextStyled>
              </ResultProductBlockStyled>
            </Col>
          </Row>
          <Row>
            {products && products.length
              ? products.map((product, index) => (
                  <ProductGridDesktopStyled key={`productGrid${index}`}>
                    <ProductGrid
                      product={product}
                      key={product.id}
                      index={index}
                      sectionName={sectionName}
                    />
                  </ProductGridDesktopStyled>
                ))
              : isNoProduct === true && <span />}
            {loading &&
              [...Array(4)].map((x, index) => (
                <ProductGridDesktopStyled key={`skeletonPDP${index}`}>
                  <ProductGridSkeleton loading />
                </ProductGridDesktopStyled>
              ))}
            {!!totalCount && totalCount > 0 && totalCount > products.length && (
              <Col xs={12}>
                <ResultProductBlockStyled customProp={`loadmore`}>
                  <ResultProductTextStyled>
                    {`${translate('productPreview.product_view_results_found', {
                      count: products.length,
                    })}${translate(
                      'productPreview.product_view_results_all_found',
                      {
                        count: totalCount,
                      },
                    )}`}
                  </ResultProductTextStyled>
                </ResultProductBlockStyled>
                <PageSwitcherStyled>
                  <ProgressListStyled
                    customStyled={`width: ${progressBarPercentage}%`}
                  >
                    <div></div>
                  </ProgressListStyled>
                  {!loading && totalCount > products.length && (
                    <CustomButtonDesktopStyled
                      outline
                      color={`default`}
                      hoverColor={`primary`}
                      onClick={() => handleLoadMore(fetchMore)}
                    >
                      {translate('load_more')}
                      <ImageV2
                        src={`/static/icons/LoadMoreDesktop.svg`}
                        width={`16px`}
                      />
                    </CustomButtonDesktopStyled>
                  )}
                </PageSwitcherStyled>
              </Col>
            )}
          </Row>
        </Col>
      </CustomRowStyled>
    </>
  );
};

export default withLocales(ProductListDesktop);
