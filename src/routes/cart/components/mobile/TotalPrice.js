import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';
import { formatPrice } from '../../../../utils/formatPrice';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const TotalPriceStyled = styled.div`
  padding: 20px 10px;
  p {
    margin: 0;
  }
`;
const TotalPriceDetailStyled = styled.div`
  border-bottom: 1px solid lightgrey;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;
const TotalPriceContentStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SubTotalStyled = styled(TotalPriceContentStyled)`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
  color: #171717;
`;
const ShippingCostStyled = styled(TotalPriceContentStyled)`
  margin-bottom: 10px;
  font-size: 13px;
  color: #171717;
  span {
    font-size: 16px;
  }
`;
const DiscountStyled = styled(TotalPriceContentStyled)`
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: bold;
  color: #171717;
  span {
    color: #be0707;
    font-size: 16px;
  }
`;
const GiftWrapStyled = styled(TotalPriceContentStyled)`
  font-weight: bold;
`;
const GiftWrapTitleStyled = styled.p`
  color: #171717;
  font-size: 13px;
`;
const GiftWrapValueStyled = styled.p`
  color: #202020;
  font-size: 16px;
`;
const PriceSummaryStyled = styled(TotalPriceContentStyled)`
  font-weight: bold;
  color: #171717;
  margin: 0;
`;
const OrderTotalTitleStyled = styled.p`
  font-size: 19px;
`;
const OrderTotalValueStyled = styled.p`
  font-size: 21px;
`;

const TotalPrice = ({
  shippingCost,
  discountAmount,
  giftWrap,
  giftFlag,
  baseGrandTotal,
  subTotalInclTax,
  translate,
}) => {
  return (
    <TotalPriceStyled>
      <TotalPriceDetailStyled>
        <SubTotalStyled>
          <p>{translate('shopping_bag.sub_total')}</p>
          <p
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'PriceSubTotal',
              'CartMobileTotalPrice',
            )}
          >
            ฿{formatPrice(subTotalInclTax, 2)}
          </p>
        </SubTotalStyled>
        <ShippingCostStyled>
          <p>{translate('shopping_bag.shipping_and_handling')}</p>
          <p
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'PriceShipping',
              'CartMobileTotalPrice',
            )}
          >
            {shippingCost ? `฿${formatPrice(shippingCost, 2)}` : 'FREE'}
          </p>
        </ShippingCostStyled>
        {discountAmount !== 0 && (
          <DiscountStyled>
            <p>{translate('shopping_bag.discount')}</p>
            <p>
              <span
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'PriceDiscount',
                  'CartMobileTotalPrice',
                )}
              >
                -฿{formatPrice(discountAmount, 2)}
              </span>
            </p>
          </DiscountStyled>
        )}
        {giftFlag && (
          <GiftWrapStyled>
            <GiftWrapTitleStyled>
              {translate('shopping_bag.gift_wrap')}
            </GiftWrapTitleStyled>
            <GiftWrapValueStyled
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceGift',
                'CartMobileTotalPrice',
              )}
            >
              ฿{formatPrice(giftWrap || 0, 2)}
            </GiftWrapValueStyled>
          </GiftWrapStyled>
        )}
      </TotalPriceDetailStyled>
      <PriceSummaryStyled>
        <OrderTotalTitleStyled>
          {translate('shopping_bag.order_total')}
        </OrderTotalTitleStyled>
        <OrderTotalValueStyled
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'PriceTotal',
            'CartMobileTotalPrice',
          )}
        >
          ฿{formatPrice(baseGrandTotal, 2)}
        </OrderTotalValueStyled>
      </PriceSummaryStyled>
    </TotalPriceStyled>
  );
};

export default withLocales(TotalPrice);
