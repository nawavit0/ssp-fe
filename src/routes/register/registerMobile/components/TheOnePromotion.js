import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';

const TheOnePromotionStyled = styled.div`
  display: flex;
  flex-direction: row;
  text-align: left;
  width: 100%;
  margin-bottom: 15px;
  align-items: center;
  min-height: 15px;
  color: #606060;
  font-size: 14px;
`;
const TheOneImageStyled = styled.img`
  margin-right: 13px;
  width: 37px;
  height: 36px;
`;

const TheOnePromotion = ({ translate }) => {
  return (
    <TheOnePromotionStyled>
      <TheOneImageStyled src="/static/images/the1.png" />
      {translate('register.get_free_voucher')}
    </TheOnePromotionStyled>
  );
};

export default withLocales(TheOnePromotion);
