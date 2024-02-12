import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const CardMobileSellerStyled = styled.div`
  background-color: #d3d3d3;
  padding: 10px 25px;
  font-size: 11px;
  margin: 0;
  p {
    margin: 0;
  }
  span {
    font-weight: bold;
  }
`;
const FlexSpaceBetweenStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardMobileSeller = ({
  itemQuantity,
  sellerName,
  currentSellerIndex,
  totalSeller,
  translate,
}) => {
  return (
    <CardMobileSellerStyled>
      <FlexSpaceBetweenStyled>
        <p>
          <span>
            {translate('shopping_bag.seller')} {sellerName}
          </span>
        </p>
      </FlexSpaceBetweenStyled>
      <FlexSpaceBetweenStyled>
        <p>
          {translate('shopping_bag.shipment')} <span>{currentSellerIndex}</span>{' '}
          {translate('shopping_bag.of')} {totalSeller}
        </p>
        <p
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'ItemQuantity',
            'CartSellerMobile',
            sellerName,
          )}
        >
          {itemQuantity} {translate('shopping_bag.item_s')}
        </p>
      </FlexSpaceBetweenStyled>
    </CardMobileSellerStyled>
  );
};

export default withLocales(CardMobileSeller);
