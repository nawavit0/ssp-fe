import React, { memo } from 'react';
import { withLocales } from '@central-tech/core-ui';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Filters } from '../Filters';
import ImageV2 from '../Image/ImageV2';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

const WrapperStyled = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 30;
  ${props =>
    props.isOpen
      ? `
      &.mobileFilter {
        transition: left 400ms 0ms;
        left: 0;
      }`
      : `
      &.mobileFilter {
        transition: left 400ms 0ms;
        left: -100%;
      }`}
`;
const BackgroundShadow = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 29;
  background-color: rgba(0, 0, 0, 0.5);
  ${props =>
    props.isOpen
      ? `
      &.mobileBackgroundFilter {
        transition: opacity 400ms 0ms;
        opacity: 1;
      }`
      : `
      &.mobileBackgroundFilter {
        transition: opacity 400ms 0ms;
        opacity: 0;
        z-index: -1;
      }`}
`;
const FilterStyled = styled.div`
  width: 100%;
  background-color: #ffffff;
  overflow-y: scroll;
`;
const CloseButton = styled.div`
  width: 70px;
  background-color: #17212c;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const HeaderFilter = styled.div`
  width: 100%;
  height: 55px;
  border-bottom: 10px solid #d5d6d7;
  font-size: 16px;
  font-weight: bold;
  color: #1a1b1a;
  padding: 0 15px;
  line-height: 45px;
`;
const ResultNumberStyled = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #1a1b1a;
  margin-top: 18px;
  text-align: center;
`;
const FilterMobile = ({
  isOpen,
  category,
  priceRange,
  filters,
  sorting,
  getActiveFilter,
  useFromPage,
  loading,
  onCloseFilter,
  translate,
  productsTotal,
}) => {
  return (
    <>
      <BackgroundShadow
        className="mobileBackgroundFilter"
        isOpen={isOpen}
        onClick={onCloseFilter}
      />
      <WrapperStyled className="mobileFilter" isOpen={isOpen}>
        <FilterStyled>
          <HeaderFilter>{translate('mobile_filter.filters')}</HeaderFilter>
          <Filters
            category={category}
            filters={filters}
            sorting={sorting}
            getActiveFilter={getActiveFilter}
            useFromPage={useFromPage}
            priceRange={priceRange}
            loading={loading}
            onCloseFilter={onCloseFilter}
          />
          {!loading && (
            <ResultNumberStyled
              id={generateElementId(
                ELEMENT_TYPE.LABEL,
                ELEMENT_ACTION.VIEW,
                'ProductNumberFilterMobbile',
                'ProductList',
              )}
            >
              {productsTotal > 1
                ? translate('productPreview.products_view_mobile', {
                    count: productsTotal,
                  })
                : translate('productPreview.product_view_mobile', {
                    count: productsTotal,
                  })}
            </ResultNumberStyled>
          )}
        </FilterStyled>
        <CloseButton
          onClick={onCloseFilter}
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.VIEW,
            'CloseFilterMobile',
            'ProductList',
          )}
        >
          <ImageV2 src="/static/icons/CloseIconFilter.svg" width="26px" />
        </CloseButton>
      </WrapperStyled>
    </>
  );
};

FilterMobile.defaultProps = {
  isOpen: false,
  loading: false,
  getActiveFilter: [],
  filters: [],
  category: {},
  priceRange: {},
  useFromPage: '',
  onCloseFilter: () => null,
  productsTotal: 0,
};

FilterMobile.propTypes = {
  translate: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  getActiveFilter: PropTypes.array,
  filters: PropTypes.array,
  category: PropTypes.object,
  priceRange: PropTypes.object,
  useFromPage: PropTypes.string,
  onCloseFilter: PropTypes.func,
  productsTotal: PropTypes.number,
};

export default memo(withLocales(FilterMobile));
