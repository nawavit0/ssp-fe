import React from 'react';
import styled from 'styled-components';
import { withRoutes, withLocales } from '@central-tech/core-ui';
import {
  CategoriesFilter,
  BrandFilter,
  ColourFilter,
  PriceFilter,
  SaleFilter,
  NewArrivalFilter,
} from './components';
import { resetFilter, handleFilterClick } from './utilFilter';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

const FilterBoxStyled = styled.div`
  &.active-blur {
    filter: blur(2px);
    -webkit-filter: blur(2px);
    height: 600px;
    position: relative;
    -webkit-transition: 800ms -webkit-filter linear;
    transition: 800ms filter linear;
    > div.overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      display: block;
    }
  }
  > div.overlay {
    z-index: -1;
    display: none;
  }
`;
const WrapperButtonStyled = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 1024px) {
    padding: 0 10px;
    flex-wrap: wrap;
  }
`;
const CustomButtonStyled = styled.button.attrs({ type: 'button' })`
  height: 30px;
  width: 114px;
  border: 1px solid #b7b7b7;
  font-size: 12px;
  background-color: ${props => props.backgroundColor || ''};
  color: ${props => props.color || ''};
  cursor: pointer;
  @media (max-width: 1024px) {
    width: 48%;
  }
`;
const Filters = ({
  filters,
  useFromPage,
  location,
  priceRange,
  getActiveFilter,
  translate,
  category,
  loading,
  onCloseFilter,
}) => {
  const isBrandPage = useFromPage === 'BRAND';
  const isSearchPage = useFromPage === 'SEARCH';

  return (
    <FilterBoxStyled className={loading ? 'active-blur' : ''}>
      <div className={`overlay`}></div>
      <CategoriesFilter
        rootParentCategory={category}
        filter={
          filters
            ? filters.filter(
                filter => filter.attribute_code === 'category_id',
              )[0]
            : []
        }
        getActiveFilter={getActiveFilter}
        onChange={objValue =>
          handleFilterClick(objValue, 'category_id', location)
        }
        handleReset={() => resetFilter('category_id', location)}
        isSearchPage={isSearchPage}
        isBrandPage={isBrandPage}
      />
      <BrandFilter
        filter={
          filters
            ? filters.filter(
                filter => filter.attribute_code === 'brand_name',
              )[0]
            : []
        }
        getActiveFilter={getActiveFilter}
        onChange={objValue =>
          handleFilterClick(objValue, 'brand_name', location)
        }
        handleReset={() => resetFilter('brand_name', location)}
        isBrandPage={isBrandPage}
      />
      <ColourFilter
        filter={
          filters
            ? filters.filter(filter => filter.attribute_code === 'color')[0]
            : []
        }
        getActiveFilter={getActiveFilter}
        onChange={objValue => handleFilterClick(objValue, 'color', location)}
        handleReset={() => resetFilter('color', location)}
      />
      <PriceFilter
        onChange={objValue =>
          handleFilterClick(
            {
              value: {
                min: objValue.min,
                max: objValue.max,
              },
            },
            'price_range',
            location,
          )
        }
        priceRange={priceRange}
        getActiveFilter={getActiveFilter}
        handleReset={() => resetFilter('price_range', location)}
        location={location}
        title={translate('filter_plp.price_range')}
      />
      <SaleFilter
        getActiveFilter={getActiveFilter}
        onChange={objValue =>
          handleFilterClick(objValue, 'online_price_enabled', location)
        }
      />
      <NewArrivalFilter
        getActiveFilter={getActiveFilter}
        onChange={objValue => handleFilterClick(objValue, 'new', location)}
      />
      <WrapperButtonStyled>
        <CustomButtonStyled
          backgroundColor="#FFFFFF"
          color="#1A1B1A"
          onClick={() => {
            resetFilter('', location);
          }}
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.EDIT,
            'ClearAll',
            'Plp',
          )}
        >
          Clear All
        </CustomButtonStyled>
        <CustomButtonStyled
          backgroundColor="#17212C"
          color="#FFFFFF"
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.SAVE,
            'Apply',
            'Plp',
          )}
          onClick={onCloseFilter}
        >
          Apply
        </CustomButtonStyled>
      </WrapperButtonStyled>
    </FilterBoxStyled>
  );
};

Filters.defaultProps = {
  filters: [],
  useFromPage: '',
  location: {},
  priceRange: {},
  getActiveFilter: [],
  translate: () => null,
  category: {},
  loading: false,
  onCloseFilter: () => null,
};

export default withLocales(withRoutes(Filters));
