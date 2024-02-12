import React from 'react';
import styled from 'styled-components';
import ImageV2 from '../../../../../components/Image/ImageV2';
import { Link } from '@central-tech/core-ui';
import FlickitySlide from '../../../../../components/Flickity';

const RelatedItemBox = styled.div`
  width: 110px;
  height: 110px;
  display: inline-block;
  &:first-child {
    > a {
      border: 1px solid #78e723;
    }
  }
  > a {
    border: 1px solid transparent;
    display: flex;
    margin: 0px 8px 0px 0px;
    max-width: 110px;
    max-height: 110px;
    img {
      width: 100%;
    }
  }
`;
const RelatedTextStyled = styled.div`
  display: flex;
  font-size: 16px;
  color: #646464;
  font-weight: bold;
  margin: 16px 0;
`;
const FlickitySlideStyled = styled(FlickitySlide)`
  display: block;
  max-height: 110px;
  overflow: hidden;
  .flex-slider {
    display: flex;
  }
}
`;

const RelatedProductDesktop = ({ products, translate }) => {
  return (
    <>
      <RelatedTextStyled>
        {translate('product_detail.select_more_colors')}
      </RelatedTextStyled>
      <FlickitySlideStyled
        className={'js-flickity-slide'}
        options={{
          wrapAround: false,
          cellAlign: 'left',
          contain: true,
          pageDots: false,
          prevNextButtons: true,
          groupCells: true,
        }}
        reloadOnUpdate
        static
      >
        {products.map(product => {
          return (
            <RelatedItemBox key={`relatedProduct${product.id}`}>
              <Link to={product.url || '#'} native={false}>
                <ImageV2 src={product.image} alt={product.name} />
              </Link>
            </RelatedItemBox>
          );
        })}
      </FlickitySlideStyled>
    </>
  );
};

export default RelatedProductDesktop;
