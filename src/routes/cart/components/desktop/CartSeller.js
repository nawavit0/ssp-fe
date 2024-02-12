import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const CartMobileSellerStyled = styled.div`
  padding: 15px 20px;
  font-size: 12px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  background-color: #e5e5e5;
  p {
    margin: 0;
    &:not(:first-child) {
      margin-left: 15px;
    }
  }
  span {
    text-transform: uppercase;
  }
`;
const CartMobileSellerLeftStyled = styled.div`
  display: flex;
`;
const SellerNameStyled = styled.p`
  font-weight: bold;
  color: #2f2e2e;
`;
const SellerIndexStyled = styled.p`
  color: #5f5f5f;
`;
const ItemQuantityStyled = styled.p`
  color: #2f2e2e;
`;
const CartMobileSeller = ({
  itemQuantity,
  sellerName,
  currentSellerIndex,
  totalSeller,
  translate,
}) => {
  return (
    <CartMobileSellerStyled>
      <CartMobileSellerLeftStyled>
        <SellerNameStyled>
          {translate('shopping_bag.seller')} <span>{sellerName}</span>
        </SellerNameStyled>
        <SellerIndexStyled>
          {translate('shopping_bag.shipment')} {currentSellerIndex}{' '}
          {translate('shopping_bag.of')} {totalSeller}
        </SellerIndexStyled>
      </CartMobileSellerLeftStyled>
      <ItemQuantityStyled
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'ItemQuantity',
          'CartSellerDesktop',
          sellerName,
        )}
      >
        {itemQuantity} {translate('shopping_bag.item_s')}
      </ItemQuantityStyled>
    </CartMobileSellerStyled>
  );
};

export default withLocales(CartMobileSeller);
