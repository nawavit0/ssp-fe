import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import { find } from 'lodash';
import {
  DropdownBlockStyled,
  LabelDropdownStyled,
  ArrowDropdownStyled,
  DropdownListStyled,
  DropdownListItemStyled,
  DropdownText,
} from './styled';
import Image from '../../Image';

const handleClickPanel = (setStyleDropdown, open) => {
  return setStyleDropdown({
    open: open,
    activeClass: open ? 'active' : '',
  });
};
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
    selectedOption,
    options,
    placeholder,
    onChange,
  } = props;
  const selectedOptionText = find(options, o => selectedOption === o.value);

  return (
    <>
      {placeholder && <LabelDropdownStyled>{placeholder}</LabelDropdownStyled>}
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
            {selectedOptionText.label}
            <ArrowDropdownStyled>
              <Image width={`24px`} src={`/icons/arrow-down.svg`} />
            </ArrowDropdownStyled>
          </DropdownText>
          <DropdownListStyled widthStyled={width} style={styledOpenDropdown}>
            {options.map((option, index) => (
              <DropdownListItemStyled
                key={`dropdownListItem${index}`}
                onClick={() => {
                  onChange(option);
                  handleClickPanel(setStyleDropdown, 0);
                }}
              >
                {option.label}
              </DropdownListItemStyled>
            ))}
          </DropdownListStyled>
        </OutsideClickHandler>
      </DropdownBlockStyled>
    </>
  );
};

export default DropdownList;
