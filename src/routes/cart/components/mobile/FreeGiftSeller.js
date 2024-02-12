import React, { useState } from 'react';
import FreeGiftCard from './FreeGiftCard';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';

const FreeGiftSellerStyled = styled.div`
  margin: 0 20px 10px;
  padding-top: 20px;
`;
const FreeGiftSellerTitleStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;
const FreeGiftSellerTitleLeftStyled = styled.div`
  display: flex;
  p {
    margin: 0;
    font-size: 13px;
    color: #171717;
    font-weight: bold;
  }
  img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }
`;
const ArrowStyled = styled.img`
  transform: ${props => (props.openFlag ? 'rotate(0deg)' : 'rotate(180deg)')};
`;
const FreeGiftSeller = ({ freeItems, translate }) => {
  const [showFreeGiftSellerFlag, setShowFreeGiftSellerFlag] = useState(false);
  return (
    freeItems.length !== 0 && (
      <FreeGiftSellerStyled>
        <FreeGiftSellerTitleStyled>
          <FreeGiftSellerTitleLeftStyled>
            <img src="/static/icons/GiftPromotion.svg" />
            <p>{translate('shopping_bag.promotion_item_order')}</p>
          </FreeGiftSellerTitleLeftStyled>
          <ArrowStyled
            onClick={() => setShowFreeGiftSellerFlag(!showFreeGiftSellerFlag)}
            src="/static/icons/ArrowUp.svg"
            height="18"
            width="20"
            openFlag={showFreeGiftSellerFlag}
          />
        </FreeGiftSellerTitleStyled>
        {showFreeGiftSellerFlag &&
          freeItems.map((item, index) => {
            const freeGiftName =
              item?.productName || translate('shopping_bag.free_gift');
            const freeGiftImagePath =
              item?.productImage || '/static/images/DefaultImage.jpg';
            const freeGiftIsOutOfStock = item?.isOutOfStock || false;
            return (
              <FreeGiftCard
                freeGiftName={freeGiftName}
                freeGiftImagePath={freeGiftImagePath}
                freeGiftIsOutOfStock={freeGiftIsOutOfStock}
                key={index}
              />
            );
          })}
      </FreeGiftSellerStyled>
    )
  );
};

export default withLocales(FreeGiftSeller);
