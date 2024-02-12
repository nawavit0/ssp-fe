import React from 'react';
import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';
import withDeviceDetect from '../../DeviceDetect/withDeviceDetect';
import { getProductCustomAttributesSearchSuggestion } from '../../../utils/gtm';

const ProductCardStyled = styled.div`
  display: grid;
  grid-template-columns: ${props =>
    props.isMobile ? '1fr' : 'max-content 1fr'};
`;
const ProductImageStyled = styled.img`
  width: ${props => (props.isMobile ? '100%' : 'auto')};
  height: ${props => (props.isMobile ? 'auto' : '75px')};
  margin-bottom: ${props => (props.isMobile ? '10px' : '0')};
`;
const ProductDetailStyled = styled.div`
  height: 100%;
  font-size: 10px;
  padding: ${props => (props.isMobile ? '0' : '0 15px')};

  h3 {
    color: #1a1b1a;
    font-weight: 300;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    color: #e80000;
    font-weight: 300;
    display: inline-block;

    &:not(:last-child) {
      margin-right: 5px;
    }
  }
`;
const ProductDetailSpecialPriceStyled = styled.p`
  &:last-child {
    color: #1a1b1a;
    text-decoration: line-through;
    font-size: 9px;
  }
`;

const ProductCard = ({
  productForGtm,
  productName,
  price,
  productImageUrl,
  specialPrice,
  productUrl,
  clearSearchValue,
  index,
  isMobile,
}) => {
  const productCustomAttributes = getProductCustomAttributesSearchSuggestion({
    product: productForGtm,
    options: { name: productName, position: index },
  });
  return (
    <Link
      to={productUrl}
      onClick={clearSearchValue}
      {...productCustomAttributes}
    >
      <ProductCardStyled isMobile={isMobile}>
        <ProductImageStyled src={productImageUrl} isMobile={isMobile} />
        <ProductDetailStyled isMobile={isMobile}>
          <h3>{productName}</h3>
          <p>฿{price}</p>
          {specialPrice !== price ? (
            <ProductDetailSpecialPriceStyled>
              ฿{specialPrice}
            </ProductDetailSpecialPriceStyled>
          ) : null}
        </ProductDetailStyled>
      </ProductCardStyled>
    </Link>
  );
};

export default withDeviceDetect(ProductCard);
