import React from 'react';
import styled from 'styled-components';
import { withLocales, Link } from '@central-tech/core-ui';
import { formatPrice } from '../../../../utils/formatPrice';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const CheckoutBoxStyled = styled.div`
  height: 46px;
  background-color: ${props => (props.disable ? '#b7b7b7' : '#13283f')};
  padding: 16px auto;
  color: #ffffff;
  font-size: 17px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  img {
    width: 28px;
    height: 25px;
    margin-right: 8px;
  }
`;
const CheckoutFooterStyled = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 2;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  padding: 10px 10px 18px 10px;
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-gap: 15px;
  margin-bottom: 0;
`;
const FooterPriceStyled = styled.div`
  * {
    margin: 0;
  }
`;
const FooterPriceLabelStyled = styled.p`
  color: #3d3d3d;
  font-size: 14px;
  font-weight: bold;
`;
const FooterPriceContentStyled = styled.p`
  color: #dc0000;
  font-size: ${props => (props.overMillionFlag ? '18px' : '23px')};
  font-weight: bold;
  margin: 0;
`;
const FooterDescriptionStyled = styled.div`
  text-align: center;
`;
const FooterEarnTheOneStyled = styled.div`
  display: flex;
  img {
    background-color: black;
    width: 17px;
    height: 16px;
    margin-right: 8px;
  }
  p {
    font-size: 10px;
    text-align: left;
    margin-top: 5px;
    margin-bottom: 0;
    color: #787878;
  }
  span {
    color: #3d3d3d;
    font-weight: bold;
  }
`;
const OrderQualifyDeliveryStyled = styled.p`
  font-size: 10px;
  color: #8c8c8c;
  text-align: center;
  margin-top: 0;
  font-weight: bold;
`;

const CheckoutFooter = ({
  orderTotal,
  earnTheOnePoint,
  shippingCost,
  translate,
  isDisableCartCheckout,
}) => {
  return (
    <CheckoutFooterStyled>
      <FooterPriceStyled>
        <FooterPriceLabelStyled>
          {translate('shopping_bag.order_total')}
        </FooterPriceLabelStyled>
        <FooterPriceContentStyled
          overMillionFlag={orderTotal >= 1000000}
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'PriceOrderTotal',
            'CartMobile',
          )}
        >
          ฿{formatPrice(orderTotal, 2)}
        </FooterPriceContentStyled>
      </FooterPriceStyled>
      <FooterDescriptionStyled>
        {shippingCost === 0 && (
          <OrderQualifyDeliveryStyled>
            {translate('shopping_bag.order_qualify_free_delivery')}
          </OrderQualifyDeliveryStyled>
        )}
        <Link
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.VIEW,
            'SecureCheckout',
            'CartMobile',
          )}
          to={isDisableCartCheckout ? `` : `/checkout`}
          native
        >
          <CheckoutBoxStyled disable={isDisableCartCheckout}>
            <img src="/static/icons/LockWhite@2x.png" alt="Pad Lock" />
            {translate('shopping_bag.secure_checkout')}
          </CheckoutBoxStyled>
        </Link>
        <FooterEarnTheOneStyled>
          <img src="/static/icons/TheOne.svg" alt="The 1 Card" />
          <p>
            {`${translate('shopping_bag.earn')} `}
            <span>
              {`${formatPrice(earnTheOnePoint)} ${translate(
                'shopping_bag.points',
              )} `}
            </span>
            {translate('shopping_bag.with_your_the_1')}
          </p>
        </FooterEarnTheOneStyled>
      </FooterDescriptionStyled>
    </CheckoutFooterStyled>
  );
};
export default withLocales(CheckoutFooter);
