import React, { useEffect, useState } from 'react';
import {
  ArrowDropdownStyled,
  DropdownBlockStyled,
  DropdownListItemStyled,
  DropdownListStyled,
  DropdownText,
} from '../styled';
import OutsideClickHandler from 'react-outside-click-handler';
import ImageV2 from '../../../Image/ImageV2';
import withLocales from '../../../../utils/decorators/withLocales';
import t from '../../AccountMenu/translation';

let selectedOptionFlag = '';

const handleClickPanel = (setStyleDropdown, onExpandMenu, open) => {
  onExpandMenu(open === 1);
  return setStyleDropdown({
    open: open,
    activeClass: open ? 'active' : '',
  });
};

function AccountMenuMobile(props) {
  const { menuList, onUrlChange, activeMenu, translate, onExpandMenu } = props;
  const mobileMenuList = menuList.filter(menu => menu.value);
  return (
    <DropdownList
      width={`100%`}
      margin={`0px`}
      options={mobileMenuList}
      selectedOption={activeMenu.key}
      id="sel-menu-account"
      placeholder={translate(activeMenu.label)}
      value=""
      onChange={change => onUrlChange(change.value)}
      translate={translate}
      onExpandMenu={onExpandMenu}
    />
  );
}

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
    onExpandMenu,
    translate,
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
            handleClickPanel(setStyleDropdown, onExpandMenu, 0);
          }}
        >
          <DropdownText
            onClick={() =>
              handleClickPanel(
                setStyleDropdown,
                onExpandMenu,
                styleDropdown.open ? 0 : 1,
              )
            }
          >
            <span>
              {placeholder}
              <ArrowDropdownStyled>
                <ImageV2 width={`20px`} src={`/static/icons/ArrowDown.svg`} />
              </ArrowDropdownStyled>
            </span>
          </DropdownText>
          <DropdownListStyled widthStyled={width} style={styledOpenDropdown}>
            {options.map((option, index) => {
              const isSelected = selectedOptionFlag === option.key;
              return (
                <DropdownListItemStyled
                  key={`dropdownListItem${index}`}
                  onClick={() => {
                    onChange(option);
                    handleClickPanel(setStyleDropdown, onExpandMenu, 0);
                  }}
                  isSelected={isSelected}
                  data-attr={isSelected.toString()}
                >
                  {translate(option.label)}
                </DropdownListItemStyled>
              );
            })}
          </DropdownListStyled>
        </OutsideClickHandler>
      </DropdownBlockStyled>
    </>
  );
};

export default withLocales(t)(AccountMenuMobile);
