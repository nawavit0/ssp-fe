import React, { memo } from 'react';
import { string } from 'prop-types';
import { Link } from '@central-tech/core-ui';
import styled from 'styled-components';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../../utils/generateElementId';

const RelatedBoxStyled = styled.div`
  padding: 5px 8px 6px 8px;
  /* margin-bottom: 5px; */
  background-color: #f6f6f6;
  color: #656565;
  margin-right: 6px;
  white-space: pre;
  ${props => props.customBoxRelatedStyle || ''}
`;
const RelatedSearchStyled = styled.div`
  color: #676666;
  font-weight: bold;
  font-size: 11px;
  display: flex;
  align-items: center;
  padding: 14px 14px 11px 14px;
  span {
    white-space: pre;
    margin-right: 6px;
  }
  ${props =>
    !props.isSlide &&
    `
    flex-wrap: wrap;
    grid-row-gap: 20px;
    line-height: 2.5;
  `}
  ${props => props.customRelatedSectionStyle || ''}
`;
const SlideContainStyled = styled.div`
  position: relative;
  width: 100%;
  min-height: 30px;
  > div {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-points-y: repeat(100%);
    scroll-snap-type: x mandatory;
    scroll-snap-destination: 100% 0%;
    justify-content: flex-start;
    align-items: center;
    display: flex;
  }
`;

const RelatedSearch = ({
  relatedSearch,
  title,
  customRelatedSectionStyle,
  customBoxRelatedStyle,
  isSlide,
}) => {
  if (!relatedSearch) return null;

  const resultRelatedArray = relatedSearch ? relatedSearch.split(',') : [];
  const renderRelatedSearch = resultRelatedArray.map((related, index) => {
    if (related) {
      return (
        <Link
          to={`/search/${related}`}
          id={generateElementId(
            ELEMENT_TYPE.LINK,
            ELEMENT_ACTION.VIEW,
            'RelateSearch',
            'ProductDetailPage',
            `${index + 1}`,
          )}
          key={`relatedSearch${index}`}
        >
          <RelatedBoxStyled
            className="related-item-box"
            customBoxRelatedStyle={customBoxRelatedStyle}
          >
            {related}
          </RelatedBoxStyled>
        </Link>
      );
    }
  });

  const renderContent = isSlide ? (
    <>
      <span>{title}:</span>
      <SlideContainStyled>
        <div>{renderRelatedSearch}</div>
      </SlideContainStyled>
    </>
  ) : (
    <>
      <span>{title}:</span>
      {renderRelatedSearch}
    </>
  );

  return (
    <RelatedSearchStyled
      isSlide={isSlide}
      customRelatedSectionStyle={customRelatedSectionStyle}
    >
      {renderContent}
    </RelatedSearchStyled>
  );
};

RelatedSearch.propTypes = {
  relatedSearch: string.isRequired,
  title: string.isRequired,
};

export default memo(RelatedSearch);
