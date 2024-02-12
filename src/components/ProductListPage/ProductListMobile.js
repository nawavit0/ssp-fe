import React, { useState, useRef } from 'react';
import {
  CustomButtonMobileStyled,
  CustomRowStyled,
  PageSwitcherStyled,
  ParagraphLabelMobileStyled,
  ReadMoreMobileStyled,
  HideTextMobileStyled,
  ResultProductBlockStyled,
  ResultProductTextStyled,
  TextElStyled,
  TitlePLPStyled,
  FilterAndSortRowMobileStyled,
  FilterAndSortBoxMobileStyled,
  SubCategoryRowMobileStyled,
  ProgressListStyled,
  ProductGridMobileStyled,
} from './styled';
import { Col, Row, Skeleton, withLocales } from '@central-tech/core-ui';
import { Filters } from '../Filters';
import SubCategoryBlock from '../SubCategoryBlock/SubCategoryBlock';
import Sort from '../Sort/Sort';
import ProductGrid from '../ProductGrid';
import ProductGridSkeleton from '../ProductGridSkeleton/ProductGridSkeleton';
import { ceil, get as prop } from 'lodash';
import ImageV2 from '../Image/ImageV2';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

const renderPageTitle = (
  cmsRender,
  title,
  description,
  brandLogo,
  translate,
  useFromPage,
  products,
  totalCount,
  divContent,
  hideDescriptionFlag,
  setHideDescriptionFlag,
) => {
  const hideData = description === '' || !description ? '0' : '1';
  const heightOfContent = prop(divContent, 'current.clientHeight', 0);
  return (
    <TitlePLPStyled>
      <li>
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
          {!cmsRender && (
            <>
              <h1>{title}</h1>
            </>
          )}
        </label>
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
        {description !== '' && (
          <div className={`collapse-panel`} data-hide={hideDescriptionFlag}>
            <div className={`collapse-inner`}>
              <ParagraphLabelMobileStyled ref={divContent}>
                {description}
              </ParagraphLabelMobileStyled>
            </div>
            {heightOfContent > 48 && (
              <>
                <ReadMoreMobileStyled
                  onClick={() => setHideDescriptionFlag(false)}
                  className={`collapse-read`}
                >
                  {translate('productPreview.read_more')}
                </ReadMoreMobileStyled>
                <HideTextMobileStyled
                  onClick={() => setHideDescriptionFlag(true)}
                >
                  {translate('product_detail.hide_text')}
                </HideTextMobileStyled>
              </>
            )}
          </div>
        )}
      </li>
    </TitlePLPStyled>
  );
};

const ProductListMobile = props => {
  const {
    title,
    description,
    loading,
    loadingFilter,
    loadingSubCategory,
    subCategoryObjList,
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
    onOpenFilter,
  } = props;
  const sectionName = `Search Result/${title}`;
  const progressBarPercentage = ceil(100 * products.length) / totalCount;
  const [hideDescriptionFlag, setHideDescriptionFlag] = useState(true);
  const divContent = useRef(null);
  return (
    <>
      <CustomRowStyled>
        <Col xs={12} md={3} lg="240px" style={{ display: 'none' }}>
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
          ) : (
            products && (
              <>
                <Filters
                  category={category}
                  filters={filters}
                  sorting={sorting}
                  getActiveFilter={getActiveFilter}
                  useFromPage={useFromPage}
                  priceRange={priceRange}
                  loading={loading}
                />
              </>
            )
          )}
        </Col>
        <Col xs={12}>
          {(useFromPage === 'BRAND' && cmsRender) || null}
          <Row>
            <Col>
              {title &&
                renderPageTitle(
                  cmsRender,
                  title,
                  description,
                  brandLogo,
                  translate,
                  useFromPage,
                  products,
                  totalCount,
                  divContent,
                  hideDescriptionFlag,
                  setHideDescriptionFlag,
                )}
            </Col>
          </Row>
          {(useFromPage === 'CATEGORY' && cmsRender) || null}
          {subCategoryObjList?.length ? (
            <SubCategoryRowMobileStyled>
              <Col>
                <SubCategoryBlock
                  subCategoryObjList={subCategoryObjList}
                  loading={loading || loadingSubCategory}
                  isMobile
                />
              </Col>
            </SubCategoryRowMobileStyled>
          ) : null}
          <FilterAndSortRowMobileStyled>
            <Col>
              <FilterAndSortBoxMobileStyled>
                <div
                  onClick={onOpenFilter}
                  id={generateElementId(
                    ELEMENT_TYPE.BUTTON,
                    ELEMENT_ACTION.VIEW,
                    'FilterMobile',
                    'ProductList',
                  )}
                >
                  <label>
                    {translate('mobile_filter.filters')}
                    <ImageV2
                      width={`16px`}
                      src={`/static/icons/FilterMobile.svg`}
                    />
                  </label>
                </div>
                <div>
                  <Sort location={location} activeSort={sort} />
                </div>
              </FilterAndSortBoxMobileStyled>
            </Col>
          </FilterAndSortRowMobileStyled>
          <Row>
            {products && products.length
              ? products.map((product, index) => (
                  <Col xs={6} sm={4} md={3} key={product.id}>
                    <ProductGridMobileStyled>
                      <ProductGrid
                        product={product}
                        index={index}
                        sectionName={sectionName}
                      />
                    </ProductGridMobileStyled>
                  </Col>
                ))
              : isNoProduct === true && <span />}
            {loading &&
              [...Array(4)].map((x, index) => (
                <Col xs={6} sm={4} md={3} key={`productGridSkeleton${index}`}>
                  <ProductGridMobileStyled>
                    <ProductGridSkeleton loading />
                  </ProductGridMobileStyled>
                </Col>
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
                    <CustomButtonMobileStyled
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
                    </CustomButtonMobileStyled>
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

export default withLocales(ProductListMobile);
