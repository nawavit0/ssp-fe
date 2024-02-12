import React, { memo } from 'react';
import { get as prop } from 'lodash';
import styled from 'styled-components';
import {
  CategoryBlockStyled,
  CategoryLabelStyled,
  CategoryLoadingStyled,
} from './styled';
import { withLocales, Link, Skeleton } from '@central-tech/core-ui';
import FlickitySlide from '../Flickity';

const FlickitySlideStyled = styled(FlickitySlide)`
  .flickity-slider {
    div {
      width: auto;
      white-space: nowrap;
    }
  }
}
`;
const BackgroundColorList = [
  '#2E8BC0',
  '#0C2D48',
  '#145DA0',
  '#274472',
  '#003060',
  '#1E3D58',
  '#057DCD',
  '#43B0F1',
  '#0074B7',
  '#60A3D9',
  '#68A4F1',
  '#2B6AD0',
  '#1F4591',
  '#2685F0',
  '#16488F',
  '#0C2144',
  '#1848A0',
  '#2692D0',
  '#263F60',
  '#09509A',
  '#2E74A0',
  '#1477B2',
  '#19569A',
  '#153C64',
  '#0070E0',
  '#055CB4',
  '#468CCA',
  '#41729F',
  '#055C9D',
];

const SubCategoryBlock = ({ subCategoryObjList, loading, isMobile }) => {
  const sortSubCategoryObjList = subCategoryObjList
    .map(category => {
      return {
        label: category.label,
        small: category.label.toLowerCase(),
        custom_attributes: category.custom_attributes,
      };
    })
    .sort((a, b) => (a.small < b.small ? -1 : a.small > b.small ? 1 : 0));
  let backgroundColor = -1;

  if (loading) {
    return (
      <CategoryBlockStyled>
        <CategoryLoadingStyled>
          <Skeleton
            time={1}
            width="100px"
            borderRadius={6}
            height="42px"
            margin="4px"
          />
          <Skeleton
            time={1}
            width="100px"
            borderRadius={6}
            height="42px"
            margin="4px"
          />
          <Skeleton
            time={1}
            width="100px"
            borderRadius={6}
            height="42px"
            margin="4px"
          />
          <Skeleton
            time={1}
            width="100px"
            borderRadius={6}
            height="42px"
            margin="4px"
          />
        </CategoryLoadingStyled>
      </CategoryBlockStyled>
    );
  }
  const labelBlock = sortSubCategoryObjList.map((category, index) => {
    const url_path = prop(category, 'custom_attributes.url_path', '');
    backgroundColor++;
    if (backgroundColor >= BackgroundColorList.length) {
      backgroundColor = 0;
    }
    return (
      <CategoryLabelStyled
        key={`categoryLabel${index}`}
        style={{ background: `${BackgroundColorList[backgroundColor]}` }}
      >
        <Link to={`/${url_path}`}>{`${category.label} `}</Link>
      </CategoryLabelStyled>
    );
  });

  return isMobile ? (
    <FlickitySlideStyled
      className={'js-flickity-slide'}
      options={{
        pageDots: false,
        wrapAround: false,
        prevNextButtons: false,
        cellAlign: 'left',
        contain: true,
      }}
      reloadOnUpdate
      static
    >
      {labelBlock}
    </FlickitySlideStyled>
  ) : (
    <CategoryBlockStyled>{labelBlock}</CategoryBlockStyled>
  );
};

export default memo(withLocales(SubCategoryBlock));
