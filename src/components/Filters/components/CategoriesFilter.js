import React, { memo } from 'react';
import FilterTypeToggle from './FilterTypeToggle';
import CheckBoxList from './CheckBoxList';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const CategoriesFilter = ({
  onChange = () => null,
  getActiveFilter = [],
  rootParentCategory = {},
  filter = {
    items: [],
  },
  handleReset = () => null,
  isSearchPage = false,
  isBrandPage = false,
}) => {
  const selectedListIDs =
    getActiveFilter
      .filter(
        active =>
          active.filters[0] &&
          active.filters[0].field === 'category_id' &&
          active.filters[0].conditionType &&
          active.filters[0].conditionType === 'in',
      )
      .map(category => category.filters[0].value.split(','))[0] || [];
  const parentCategoryID = rootParentCategory.id || '';
  const resultCategories = filter.items
    .filter(item => {
      if (isSearchPage || isBrandPage) {
        return (
          item.custom_attributes &&
          item.custom_attributes.url_key !== 'default-category' &&
          item.count > 0 &&
          item.custom_attributes.level === 2
        );
      }
      return (
        item.custom_attributes &&
        item.custom_attributes.url_key !== 'default-category' &&
        item.count > 0 &&
        item.custom_attributes.parent_id &&
        parseInt(item.custom_attributes.parent_id) ===
          parseInt(parentCategoryID)
      );
    })
    .map(category => {
      return {
        normal: category.label,
        small: category.label.toLowerCase(),
        category: category,
      };
    })
    .sort((a, b) => (a.small < b.small ? -1 : a.small > b.small ? 1 : 0))
    .map(category => category.category);
  const titleListSelected = selectedListIDs
    .map(id => {
      if (filter.items.filter(item => item.value === id)[0]) {
        return filter.items.filter(item => item.value === id)[0].label;
      }
    })
    .filter(item => item !== undefined);

  return resultCategories.length ? (
    <FilterTypeToggle
      type="Categories"
      titleList={titleListSelected}
      onReset={handleReset}
      id={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.VIEW,
        'CategoriesFilter',
        'Plp',
      )}
      btnClearId={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.EDIT,
        'CategoriesFilter',
        'Plp',
      )}
    >
      <CheckBoxList
        list={resultCategories}
        uniqTextId="Categories"
        onChange={value => onChange(value)}
        selectedList={selectedListIDs}
      />
    </FilterTypeToggle>
  ) : null;
};

export default memo(CategoriesFilter);
