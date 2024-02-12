import React, { useState, memo } from 'react';
import styled from 'styled-components';
import FilterTypeToggle from './FilterTypeToggle';
import CheckBoxList from './CheckBoxList';
import Image from '../../Image';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const SearchTextStyled = styled.input.attrs({ type: 'text' })`
  width: 100%;
  border: 1px solid #b7b7b7;
  background-color: #ffffff;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  margin-bottom: 11px;
  color: #1a1b1a;
  ::placeholder {
    color: #b9b9b9;
  }
`;
const Wrapper = styled.div`
  position: relative;
`;
const CustomImage = styled(Image)`
  position: absolute;
  right: 5px;
  top: 6px;
`;
const handelClearSearchBox = (onChange, value, updateText) => {
  onChange(value);
  updateText('');
};
const BrandFilter = ({
  onChange = () => null,
  handleReset = () => null,
  filter = {
    items: [],
  },
  getActiveFilter = [],
  isBrandPage = false,
}) => {
  const resultBrands = filter.items.length
    ? filter.items.filter(item => item.count > 0)
    : [];
  const activeListValues = getActiveFilter
    .filter(
      active => active.filters[0] && active.filters[0].field === 'brand_name',
    )
    .map(filter => filter.filters[0]);
  const selectedListValues =
    activeListValues && activeListValues.length
      ? activeListValues[0].value
          .split(',')
          .map(value => decodeURIComponent(value))
      : [];
  const priorityBrand = [
    'Nike',
    'Adidas',
    'Fila',
    'K-swiss',
    'New Balance',
    'Skechers',
    'Crocs',
  ].map(brand => brand.toLocaleLowerCase());

  /* Logic Sort BRAND Result */
  const resultSortAlphabetBrands = resultBrands
    .map(brand => {
      return {
        normal: brand.label,
        small: brand.label.toLowerCase(),
        brand: brand,
      };
    })
    .sort((a, b) => (a.small < b.small ? -1 : a.small > b.small ? 1 : 0))
    .map(brand => brand.brand);
  const orderBrand = resultSortAlphabetBrands
    .filter(brand => priorityBrand.indexOf(brand.value.toLowerCase()) !== -1)
    .concat(
      resultSortAlphabetBrands.filter(
        brand => priorityBrand.indexOf(brand.value.toLowerCase()) <= -1,
      ),
    );
  const [searchText, updateText] = useState('');
  const resultRenderBrands = searchText.trim()
    ? orderBrand.filter(
        brand =>
          brand.label.toUpperCase().indexOf(searchText.toUpperCase()) > -1,
      )
    : orderBrand;
  /* End */
  return resultBrands.length ? (
    <FilterTypeToggle
      type="Brand"
      titleList={selectedListValues}
      onReset={handleReset}
      disable={isBrandPage}
      id={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.VIEW,
        'BrandFilter',
        'Plp',
      )}
      btnClearId={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.EDIT,
        'BrandFilter',
        'Plp',
      )}
    >
      {!isBrandPage ? (
        <>
          <Wrapper>
            <SearchTextStyled
              value={searchText}
              onChange={e => updateText(e.target.value)}
              placeholder="Search Brands"
            />
            <CustomImage src="/icons/Searching.svg" height="17" width="20" />
          </Wrapper>
          <CheckBoxList
            list={resultRenderBrands}
            limit={7}
            uniqTextId="Brand"
            onChange={value =>
              handelClearSearchBox(onChange, value, updateText)
            }
            selectedList={selectedListValues}
          />
        </>
      ) : null}
    </FilterTypeToggle>
  ) : null;
};

export default memo(BrandFilter);
