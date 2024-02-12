import React, { useState } from 'react';
import FreeGiftCard from './FreeGiftCard';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';

const FreeGiftSellerStyled = styled.div`
  margin: 0 0 30px;
`;
const FreeGiftSellerTitleStyled = styled.div`
  padding-left: 160px;
  display: flex;
  justify-content: space-between;
`;
const FreeGiftSellerTitleLeftStyled = styled.div`
  display: flex;
  p {
    margin: 0;
    font-size: 16px;
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
  margin-right: 5px;
  cursor: pointer;
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
            height="30px"
            width="35px"
            openFlag={showFreeGiftSellerFlag}
          />
        </FreeGiftSellerTitleStyled>
        {showFreeGiftSellerFlag &&
          freeItems.map((item, index) => {
            const freeGiftName =
              item?.productName || translate('shopping_bag.free_gift');
            const freeGiftImagePath =
              item?.productImage ||
              'https://www.supersports.co.th/store/wp-content/uploads/new_ssp_online_banner.jpg';
            const freeGiftIsOutOfStock = item?.isOutOfStock || false;
            const freeGiftQty = item?.qty || 0;
            return (
              <FreeGiftCard
                freeGiftName={freeGiftName}
                freeGiftImagePath={freeGiftImagePath}
                freeGiftIsOutOfStock={freeGiftIsOutOfStock}
                freeGiftQty={freeGiftQty}
                key={index}
              />
            );
          })}
      </FreeGiftSellerStyled>
    )
  );
};

export default withLocales(FreeGiftSeller);
