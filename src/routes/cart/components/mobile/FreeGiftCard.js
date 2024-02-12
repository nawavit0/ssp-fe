import React from 'react';
import styled from 'styled-components';
import ImageV2 from '../../../../components/Image/ImageV2';
import { withLocales } from '@central-tech/core-ui';

const FreeGiftSellerContentStyled = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
`;
const PromotionItemStyled = styled.div`
  display: flex;
  img {
    height: 62px;
    margin-right: 15px;
  }
`;
const PromotionFreeStyled = styled.div`
  position: relative;
`;
const PromotionFreeContainerStyled = styled.div`
  text-transform: uppercase;
  color: #dd1b1b;
  font-size: 24px;
  position: absolute;
  bottom: 0;
  right: 0;
`;
const PromotionFreeOutOfStockStyled = styled.p`
  color: #dd0000;
`;
const PromotionFreeTitleStyled = styled.p`
  font-weight: bold;
  font-size: 9px;
  color: #474747;
  margin: 0;
`;
const PromotionFreeContentStyled = styled.p`
  color: #dd0000;
  font-size: 11px;
  font-weight: bold;
  margin: 0;
`;
const PromotionNameContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  p {
    font-weight: bold;
    font-size: 9px;
    margin: 0;
  }
`;

const FreeGiftCard = ({
  freeGiftName,
  freeGiftImagePath,
  freeGiftIsOutOfStock,
  translate,
}) => {
  return (
    <FreeGiftSellerContentStyled>
      <PromotionItemStyled>
        <ImageV2 src={freeGiftImagePath} />
        <PromotionNameContentStyled>
          <p>{freeGiftName}</p>
          {freeGiftIsOutOfStock ? (
            <PromotionFreeOutOfStockStyled>
              {translate('shopping_bag.free_item_out_of_stock')}
            </PromotionFreeOutOfStockStyled>
          ) : null}
        </PromotionNameContentStyled>
      </PromotionItemStyled>
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
    </FreeGiftSellerContentStyled>
  );
};

export default withLocales(FreeGiftCard);
