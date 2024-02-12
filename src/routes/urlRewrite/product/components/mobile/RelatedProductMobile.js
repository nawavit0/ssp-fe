import React from 'react';
import styled from 'styled-components';
import ImageV2 from '../../../../../components/Image/ImageV2';
import { Link } from '@central-tech/core-ui';

const RelatedLayoutStyled = styled.div`
  position: relative;
  height: 28.57vw;
  max-height: 100px;
  margin: 0 -16px 12px -16px;
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
    display: flex;
  }
`;

const RelatedItemBox = styled.div`
  float: left;
  width: auto;
  height: 28.57vw;
  max-height: 100px;
  > a {
    border: 1px solid transparent;
    display: block;
    width: 28.57vw;
    margin: 0px 8px 0px 0px;
    height: 28.57vw;
    max-width: 100px;
    max-height: 100px;
  }
  &:first-child {
    > a {
      border: 1px solid #78e723;
    }
  }
`;

const RelatedTextStyled = styled.div`
  display: flex;
  font-size: 12px;
  color: #000;
  font-weight: bold;
  margin: 16px 0;
`;

const RelatedProductMobile = ({ products, translate }) => {
  return (
    <>
      <RelatedTextStyled>
        {translate('product_detail.select_more_colors')}
      </RelatedTextStyled>
      <RelatedLayoutStyled>
        <div>
          {products.map(product => {
            return (
              <RelatedItemBox key={`relatedProduct${product.id}`}>
                <Link to={product.url || '#'} native={false}>
                  <ImageV2 src={product.image} alt={product.name} />
                </Link>
              </RelatedItemBox>
            );
          })}
        </div>
      </RelatedLayoutStyled>
    </>
  );
};

export default RelatedProductMobile;
