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
  p {
    margin: 0;
  }
`;
const TotalPriceDetailStyled = styled.div`
  border-bottom: 1px solid lightgrey;
  padding-bottom: 10px;
  margin-bottom: 10px;
`;
const TotalPriceSummaryStyled = styled.div`
  margin: 0;
`;
const TotalPriceContentStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SubTotalStyled = styled(TotalPriceContentStyled)`
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #171717;
`;
const ShippingCostStyled = styled(TotalPriceContentStyled)`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #171717;
`;
const DiscountStyled = styled(TotalPriceContentStyled)`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #171717;
  span {
    color: #dd0a0a;
  }
`;
const GiftWrapStyled = styled(TotalPriceContentStyled)`
  font-weight: bold;
  margin-bottom: 10px;
`;
const GiftWrapTitleStyled = styled.p`
  color: #171717;
  font-size: 14px;
`;
const GiftWrapValueStyled = styled.p`
  color: #202020;
  font-size: 14px;
`;
const PriceSummaryStyled = styled(TotalPriceContentStyled)`
  font-size: 19px;
  font-weight: bold;
  color: #171717;
  span {
    color: #dd0a0a;
  }
`;
const TotalPrice = ({
  shippingCost,
  discountAmount,
  giftWrap,
  baseGrandTotal,
  subTotalInclTax,
  giftFlag,
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
              'CartDesktopTotalPrice',
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
              'CartDesktopTotalPrice',
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
                  'CartDesktopTotalPrice',
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
                'CartDesktopTotalPrice',
              )}
            >
              ฿{formatPrice(giftWrap || 0, 2)}
            </GiftWrapValueStyled>
          </GiftWrapStyled>
        )}
      </TotalPriceDetailStyled>
      <TotalPriceSummaryStyled>
        <PriceSummaryStyled>
          <p>{translate('shopping_bag.order_total')}</p>
          <p>
            <span
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceTotal',
                'CartDesktopTotalPrice',
              )}
            >
              ฿{formatPrice(baseGrandTotal, 2)}
            </span>
          </p>
        </PriceSummaryStyled>
      </TotalPriceSummaryStyled>
    </TotalPriceStyled>
  );
};

export default withLocales(TotalPrice);
