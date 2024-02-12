import React from 'react';
import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';

const CustomLink = styled(Link)`
  color: #474747;
  height: 38px;
  overflow: hidden;
  white-space: normal;
  font-size: 13px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;
const TextStyled = styled.h4`
  font-size: 16px;
  color: #474747;
  line-height: 18px;
  font-weight: 500;
`;

const ProductName = ({ product, activeProduct, gtmCustomAttributes }) => {
  return (
    <CustomLink
      activeProduct={activeProduct}
      product={product}
      id={`lnk-viewProduct-${product.sku}`}
      to={`/${product.url_key}`}
      title={activeProduct.name}
      {...gtmCustomAttributes}
    >
      <TextStyled as="h4" className={'product-detail-color'}>
        {product.name}
      </TextStyled>
    </CustomLink>
  );
};

export default ProductName;
