import React from 'react';
import styled from 'styled-components';
import pt from 'prop-types';
import Price from '../../Price';
// import FlashDealTimer from '../FlashDealTimer';
import { checkDate } from '../../../utils/date';
import withDeviceDetect from '../../DeviceDetect/withDeviceDetect';

const RootStyled = styled.div`
  display: block;
  flex-direction: column;
  color: red;
`;
const PriceConStyled = styled.div`
  display: inline-block;
  align-items: center;
  margin-right: 6px;
`;
const CustomMsg = styled.span`
  margin-right: 4px;
`;
const SpecialPrice = styled.div`
  display: inline-block;
  height: 19px;
  align-items: center;
`;
const PriceContainer = ({
  product,
  hidePromo = false,
  customMessage = null,
  // countdown,
  isMobile,
}) => {
  const activePrice = product.price_min || product.price;
  const specialPriceValid =
    product.special_price &&
    activePrice - product.special_price > 0 &&
    checkDate(product.special_from_date, product.special_to_date);
  return (
    <RootStyled>
      <PriceConStyled>
        {customMessage && <CustomMsg>{customMessage}</CustomMsg>}
        <Price
          format
          digit={2}
          fontSize={!isMobile ? 23 : 16}
          fontWeight={600}
          price={
            specialPriceValid
              ? product.special_price || activePrice
              : activePrice
          }
        />
      </PriceConStyled>

      {specialPriceValid && !hidePromo && (
        <SpecialPrice>
          {customMessage && <CustomMsg>{customMessage}</CustomMsg>}
          <Price
            digit={2}
            price={product.price}
            color="#827F7F"
            fontSize={!isMobile ? 14 : 12}
            customStyle="text-decoration: line-through;"
            format
          />
        </SpecialPrice>
      )}

      {/*{countdown && <FlashDealTimer product={product} />}*/}
    </RootStyled>
  );
};

PriceContainer.propTypes = {
  product: pt.object.isRequired,
};

export default withDeviceDetect(PriceContainer);
