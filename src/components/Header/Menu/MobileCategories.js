import React, { Fragment, useEffect, useState, memo } from 'react';
import { withLocales, Link } from '@central-tech/core-ui';
import styled from 'styled-components';
import ImageV2 from '../../Image/ImageV2';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';
import { getIconCategory } from '../../../utils/categories';

const MenuBlockStyled = styled(Link)`
  border-bottom: 1px solid #e6e6e6;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 18px;
  padding-right: 16px;
  font-weight: 400;
  font-size: 14px;
  ${props => (props.justifyContent ? 'justify-content: start;' : '')}
  ${props => (props.color ? `color:${props.color};` : '')}
`;
const ViewAllProductStyled = styled(Link)`
  border-bottom: 1px solid #e6e6e6;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 18px;
  padding-right: 16px;
  color: #474747;
  font-weight: 300;
  font-size: 14px;
`;
const CategoryInfoStyled = styled.div`
  color: ${props => props.color};
  display: flex;
  align-items: center;
  height: 20px;
  position: relative;

  img {
    position: absolute;
  }
  ${props =>
    props.hasIcon
      ? `
    span {
      margin-left: 28px;
    }
  `
      : null}
`;
const ArrowLeftIconStyled = styled(ImageV2)`
  overflow: hidden;
  transform: translateX(-7px);
`;
const BackLabelStyled = styled.div`
  color: #474747;
`;

let initialCategories = [];
const MobileCategories = ({
  categories = [],
  translate = () => null,
  renderStaticMenuTop = () => null,
  renderStaticMenuButtom = () => null,
  onToggleMenu = () => null,
  isHiddenMenu = false,
}) => {
  const [activeCategories, setActiveCategory] = useState(categories);
  const [parentCategory, setParentCategory] = useState([]);
  const parent = parentCategory.length
    ? parentCategory[parentCategory.length - 1]
    : {};

  useEffect(() => {
    if (!parent.name) {
      initialCategories = isHiddenMenu ? [] : categories;
      setActiveCategory(initialCategories);
    }
  });

  return (
    <Fragment>
      {!parent.name ? renderStaticMenuTop() : null}
      {parent.name ? (
        <>
          <MenuBlockStyled
            onClick={() => {
              setParentCategory(
                parentCategory.filter(category => {
                  return category.name !== parent.name;
                }),
              );
              setActiveCategory(parent.children_data);
            }}
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              `BackParentCategory`,
              'MobileHeaderMenu',
            )}
            justifyContent="start"
          >
            <ArrowLeftIconStyled src="/static/icons/ArrowLeft.svg" width="24" />
            <BackLabelStyled>{translate('back')}</BackLabelStyled>
          </MenuBlockStyled>
          <ViewAllProductStyled
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              `ViewAllParentCategory`,
              'MobileHeaderMenu',
            )}
            onClick={() => {
              setParentCategory([]);
              setActiveCategory(categories);
              onToggleMenu(false);
            }}
            to={`/${parent.url_path}`}
          >
            {`${translate('view_all_group')}${parent.name} ${translate(
              'products_en',
            )}`}
          </ViewAllProductStyled>
        </>
      ) : null}
      {activeCategories && activeCategories.length > 0 ? (
        activeCategories.map(category => {
          const linkTo = {};
          const svgIcon =
            parentCategory && parentCategory.length === 1
              ? getIconCategory(category.url_key)
              : '';
          const isNoChildren =
            !category.children_data.length && category.url_path;
          if (isNoChildren) {
            linkTo.to = `/${category.url_path}`;
          }

          return (
            <MenuBlockStyled
              key={category.id}
              onClick={() => {
                if (isNoChildren) {
                  setParentCategory([]);
                  setActiveCategory(categories);

                  return onToggleMenu(false);
                }
                if (category.children_data.length) {
                  setParentCategory([
                    ...parentCategory,
                    {
                      name: category.name,
                      url_path: category.url_path,
                      children_data: activeCategories,
                    },
                  ]);
                  setActiveCategory(category.children_data);
                }
              }}
              {...linkTo}
            >
              <CategoryInfoStyled
                hasIcon={parent.name && svgIcon}
                color={!parentCategory.length ? '#474747' : '#666666'}
              >
                {parent.name && svgIcon ? (
                  <ImageV2 customStyle="margin-right: 10px;" {...svgIcon} />
                ) : null}
                <span>{category.name}</span>
              </CategoryInfoStyled>
              {category.children_data && category.children_data.length ? (
                <ImageV2 src="/static/icons/ArrowRight.svg" width="24" />
              ) : null}
            </MenuBlockStyled>
          );
        })
      ) : !isHiddenMenu ? (
        <MenuBlockStyled color="#ff0000">
          {translate('no_results')}
        </MenuBlockStyled>
      ) : null}
      {!parent.name ? renderStaticMenuButtom() : null}
    </Fragment>
  );
};

export default memo(withLocales(MobileCategories));
