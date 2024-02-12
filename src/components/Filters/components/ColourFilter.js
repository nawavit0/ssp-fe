import React, { Fragment, memo } from 'react';
import CheckBoxList from './CheckBoxList';
import FilterTypeToggle from './FilterTypeToggle';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const ColourFilter = ({
  filter = {
    items: []
  },
  getActiveFilter = [],
  onChange = () => null,
  handleReset = () => null
}) => {
  const resultColour = filter.items.length
    ? filter.items.filter(item => item.count > 0)
    : [];
  const activeListValues = getActiveFilter
    .filter(
      active => active.filters[0] && active.filters[0].field === 'color',
    )
    .map(filter => filter.filters[0]);
  const selectedListValues =
    activeListValues && activeListValues.length
      ? activeListValues[0].value
        .split(',')
        .map(value => decodeURIComponent(value))
      : [];

  return (
    <FilterTypeToggle
      type="Color"
      titleList={selectedListValues}
      onReset={handleReset}
      id={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.VIEW,
        'ColourFilter',
        'Plp',
      )}
      btnClearId={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.EDIT,
        'ColourFilter',
        'Plp',
      )}
    >
      <CheckBoxList
        list={resultColour}
        uniqTextId="Colour"
        onChange={value => onChange(value)}
        selectedList={selectedListValues}
      />
    </FilterTypeToggle>
  );
};

export default memo(ColourFilter);
