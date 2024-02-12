import React from 'react';
import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const MenuListStyled = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
`;
const ListStyled = styled.div`
  width: 100%;
`;
const CustomLinkStyled = styled(Link)`
  ${props => {
    if (props.categoryLv === 1) {
      return `
              color: #191919;
              font-size: 14px;
              font-weight: bold;
              display: block;
              margin-bottom: 10px;
              ${props.customStyle || ''}
              `;
    } else if (props.categoryLv === 2) {
      return `
              color: #636262;
              font-size: 14px;
              ${props.customStyle || ''}
              `;
    } else if (props.categoryLv === 3) {
      return `
              color: #bdbdbd;
              font-size: 12px;
              padding-left: 5px;
              ${props.customStyle || ''}
              `;
    }

    return '';
  }}
`;

function MenuList({ list }) {
  const renderCategoryLvChildren = (childrenMenu, categoryLv, index) => {
    const urlPath = childrenMenu?.url_path || '';
    const childrenData = childrenMenu?.children_data || [];

    return (
      <MenuListStyled key={`urlPath-${categoryLv}-${index}`}>
        <ListStyled>
          <CustomLinkStyled
            to={`/${urlPath}`}
            categoryLv={categoryLv}
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              `${childrenMenu.url_key}`,
              'MegaMenu',
            )}
          >
            {childrenMenu.name}
          </CustomLinkStyled>
        </ListStyled>
        {childrenData.length
          ? childrenData.map((menu, menuIndex) =>
              renderCategoryLvChildren(menu, categoryLv + 1, menuIndex),
            )
          : null}
      </MenuListStyled>
    );
  };
  const urlPath = list?.url_path || '';
  const childrenData = list?.children_data || [];

  return (
    <MenuListStyled>
      <ListStyled>
        <CustomLinkStyled
          to={`/${urlPath}`}
          categoryLv={1}
          id={generateElementId(
            ELEMENT_TYPE.LINK,
            ELEMENT_ACTION.VIEW,
            `${list.url_key}`,
            'MegaMenu',
          )}
          customStyle={
            !childrenData.length &&
            `
            margin: 0;
          `
          }
        >
          {list?.name.toUpperCase()}
        </CustomLinkStyled>
        {childrenData.length > 0
          ? childrenData.map((menu, index) =>
              renderCategoryLvChildren(menu, 2, index),
            )
          : null}
      </ListStyled>
    </MenuListStyled>
  );
}

export default MenuList;
