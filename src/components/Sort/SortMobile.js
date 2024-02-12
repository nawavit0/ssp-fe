import React, { useState, useEffect } from 'react';
import { withLocales } from '@central-tech/core-ui';
import {
  DropdownBlockStyled,
  DropdownListItemStyled,
  DropdownListStyled,
  DropdownText,
} from './styled';
import OutsideClickHandler from 'react-outside-click-handler';
import ImageV2 from '../Image';

const handleClickPanel = (setStyleDropdown, open) => {
  return setStyleDropdown({
    open: open,
    activeClass: open ? 'active' : '',
  });
};

let selectedOptionFlag = '';
const DropdownList = props => {
  const [styleDropdown, setStyleDropdown] = useState({
    open: 0,
    activeClass: '',
  });
  let styledOpenDropdown = { display: 'none' };
  if (styleDropdown.open) {
    styledOpenDropdown = { display: 'block' };
  }
  const {
    width,
    margin,
    options,
    placeholder,
    onChange,
    selectedOption,
  } = props;
  useEffect(() => {
    selectedOptionFlag = selectedOption;
  });
  return (
    <>
      <DropdownBlockStyled
        widthStyled={width}
        marginStyled={margin}
        className={styleDropdown.activeClass}
      >
        <OutsideClickHandler
          onOutsideClick={() => {
            handleClickPanel(setStyleDropdown, 0);
          }}
        >
          <DropdownText
            onClick={() =>
              handleClickPanel(setStyleDropdown, styleDropdown.open ? 0 : 1)
            }
          >
            <label>
              {placeholder}
              <ImageV2 width={`16px`} src={`/static/icons/SortSolid.svg`} />
            </label>
          </DropdownText>
          <DropdownListStyled widthStyled={width} style={styledOpenDropdown}>
            {options.map((option, index) => {
              const isSelected = selectedOptionFlag === option.key;
              return (
                <DropdownListItemStyled
                  key={`dropdownListItem${index}`}
                  onClick={() => {
                    onChange(option);
                    handleClickPanel(setStyleDropdown, 0);
                  }}
                  isSelected={isSelected}
                  data-attr={isSelected.toString()}
                >
                  {option.label}
                  {selectedOptionFlag === option.key && (
                    <img src="/static/icons/CheckMark.svg" alt={`CheckMark`} />
                  )}
                </DropdownListItemStyled>
              );
            })}
          </DropdownListStyled>
        </OutsideClickHandler>
      </DropdownBlockStyled>
    </>
  );
};

const SortMobile = props => {
  const { sortLists, activeOptionString, handleFilterClick, translate } = props;
  return (
    <>
      <DropdownList
        width={`100%`}
        margin={`0px`}
        options={sortLists}
        selectedOption={activeOptionString}
        id="sel-formFilter-sort"
        placeholder={translate('sort_and_list.sort')}
        value=""
        onChange={change => handleFilterClick('sort', change.value)}
      />
    </>
  );
};

export default withLocales(SortMobile);
