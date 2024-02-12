import React, { Fragment, memo } from 'react';
import SelectPriceRange from '../../Select/SelectPriceRange/SelectPriceRange';
import { formatPrice } from '../utilFilter';
import FilterTypeToggle from './FilterTypeToggle';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const PriceFilter = ({
  filter = {
    items: []
  },
  getActiveFilter = [],
  onChange = () => null,
  handleReset = () => null,
  priceRange = {},
  location = {},
  title = ''
}) => {
  const queryParams = location && location.queryParams;
  const isFilter = queryParams && !!queryParams['price_range'];
  const selectedPrice = getActiveFilter.filter(
    active =>
      (
        active.filters[0] &&
        active.filters[0].field === 'price' &&
        active.filters[0].conditionType &&
        active.filters[0].conditionType === 'from'
      ) ||
      active.filters[0].conditionType === 'to',
  );
  const priceRangeDefault = selectedPrice.length
    ? {
      min:
        parseInt(selectedPrice[0].filters[0].value || 0) ||
        parseInt(priceRange.min),
      max:
        parseInt(selectedPrice[1].filters[0].value || 0) ||
        parseInt(priceRange.max),
    }
    : priceRange;

  return (
    <FilterTypeToggle
      type={title}
      onReset={handleReset}
      titleText={!isFilter ? '' : `฿${formatPrice(priceRangeDefault.min)} - ฿${formatPrice(priceRangeDefault.max)}`}
      id={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.VIEW,
        'PriceFilter',
        'Plp',
      )}
      btnClearId={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.EDIT,
        'PriceFilter',
        'Plp',
      )}
    >
      <SelectPriceRange
        priceDefault={priceRangeDefault}
        onChange={value => onChange(value)}
        priceRangeLimit={priceRange}
        isFilter={isFilter}
      />
    </FilterTypeToggle>
  );
}
export default memo(PriceFilter);
