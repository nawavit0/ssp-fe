import React from 'react';
import styled from 'styled-components';
import ImageV2 from '../../../../components/Image/ImageV2';
import { withLocales } from '@central-tech/core-ui';

const PromotionItemStyled = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
  grid-gap: 40px;
  min-height: 160px;
  padding-top: 20px;
  &:not(:last-child) {
    padding-bottom: 20px;
  }
  img {
    width: 100%;
  }
`;
const PromotionFreeOutOfStockStyled = styled.p`
  font-size: 14px;
  color: #de1818;
  margin-top: 10px;
  font-style: italic;
`;
const PromotionQuantityDetailStyled = styled.div`
  display: grid;
  grid-template-columns: 212px 1fr;
  grid-gap: 20px;
`;
const PromotionDetailStyled = styled.div`
  width: 100%;
`;
const PromotionNameStyled = styled.p`
  font-size: 14px;
  margin: 0;
  font-weight: bold;
  color: #000000;
`;
const PromotionQuantityStyled = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #474747;
  margin: 0;
  span {
    margin-left: 30px;
  }
`;
const PromotionFreeStyled = styled.div`
  position: relative;
  text-align: right;
`;
const PromotionFreeContainerStyled = styled.div`
  color: #dd1b1b;
  font-size: 24px;
  position: absolute;
  bottom: 0;
  right: 0;
`;
const PromotionFreeTitleStyled = styled.p`
  font-weight: bold;
  font-size: 14px;
  color: #474747;
  margin: 0;
`;
const PromotionFreeContentStyled = styled.p`
  text-transform: uppercase;
  color: #dd0000;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
`;

const FreeGiftCard = ({
  freeGiftName,
  freeGiftImagePath,
  freeGiftIsOutOfStock,
  freeGiftQty,
  translate,
}) => {
  return (
    <PromotionItemStyled>
      <ImageV2 src={freeGiftImagePath} />
      <PromotionDetailStyled>
        <PromotionQuantityDetailStyled>
          <PromotionNameStyled>{freeGiftName}</PromotionNameStyled>
          {!freeGiftIsOutOfStock && (
            <PromotionQuantityStyled>
              {translate('shopping_bag.quantity')}
              <span>{freeGiftQty}</span>
            </PromotionQuantityStyled>
          )}
        </PromotionQuantityDetailStyled>
        {freeGiftIsOutOfStock ? (
          <PromotionFreeOutOfStockStyled>
            {translate('shopping_bag.free_item_out_of_stock')}
          </PromotionFreeOutOfStockStyled>
        ) : null}
        {!freeGiftIsOutOfStock && (
          <PromotionFreeStyled>
            <PromotionFreeContainerStyled>
              <PromotionFreeTitleStyled>
                {translate('shopping_bag.total')}
              </PromotionFreeTitleStyled>
              <PromotionFreeContentStyled>
                {translate('shopping_bag.free')}
              </PromotionFreeContentStyled>
            </PromotionFreeContainerStyled>
          </PromotionFreeStyled>
        )}
      </PromotionDetailStyled>
    </PromotionItemStyled>
  );
};

export default withLocales(FreeGiftCard);
