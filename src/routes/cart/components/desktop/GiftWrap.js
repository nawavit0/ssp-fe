import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import styled from 'styled-components';
import Checkbox from './GiftCheckbox';

const GiftLayoutStyled = styled.div`
  border: 0.67px solid #d7d7d7;
  display: grid;
  grid-template-columns: 80px 1fr;
`;
const GiftOptionCheckboxStyled = styled.div`
  margin-right: 5px;
  * {
    cursor: pointer;
  }
`;
const GiftImageStyled = styled.img`
  width: 28px;
  height: 23px;
  margin: auto;
`;
const GiftOptionStyled = styled.div`
  display: flex;
  border-left: 0.67px solid #d7d7d7;
  align-items: center;
  padding: 20px 20px;
  h4 {
    font-size: 14px;
    font-weight: bold;
    margin-right: 20px;
  }
`;
const GiftMessageStyled = styled.div`
  width: 595px;
  margin-top: 25px;
`;
const GiftMessageTitleStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  h4 {
    margin: 0;
    font-size: 12px;
    font-weight: bold;
    padding-left: 17px;
  }
  p {
    margin: 0;
    font-size: 12px;
    font-weight: bold;
    color: #a8a7a7;
  }
`;
const GiftMessageInputStyled = styled.textarea`
  resize: none;
  width: 100%;
  height: 103px;
  padding: 10px;
  font-size: 12px;
  font-weight: bold;
  border: 0.67px solid #d7d7d7;
  ::placeholder {
    color: #a8a7a7;
  }
`;
const GiftWrapTitleStyled = styled.h3`
  text-transform: uppercase;
  font-size: 14px;
  margin-bottom: 15px;
`;

const GiftWrap = ({
  translate,
  giftFlag,
  giftMessage,
  changeGiftWrapMessageHandler,
  setGiftWrapMessageHandler,
}) => {
  const maxGiftMessageLength = 270;
  return (
    <>
      <GiftWrapTitleStyled>
        {translate('shopping_bag.gift_option')}
      </GiftWrapTitleStyled>
      <GiftLayoutStyled>
        <GiftImageStyled
          src="/static/icons/gift-wrap.svg"
          alt="Gift wrap icon"
        />
        <label>
          <GiftOptionStyled>
            <GiftOptionCheckboxStyled>
              <Checkbox
                checkFlag={giftFlag}
                checkHandler={setGiftWrapMessageHandler}
              />
            </GiftOptionCheckboxStyled>
            <h4>{translate('shopping_bag.gift_wrapping')}</h4>
            <p>{translate('shopping_bag.gift_wrapping_message')}</p>
          </GiftOptionStyled>
        </label>
      </GiftLayoutStyled>
      {giftFlag && (
        <GiftMessageStyled>
          <GiftMessageTitleStyled>
            <h4>{translate('shopping_bag.add_your_message')}</h4>
            <p>
              {`${maxGiftMessageLength - giftMessage.length} ${translate(
                'shopping_bag.character_left',
              )}`}
            </p>
          </GiftMessageTitleStyled>
          <GiftMessageInputStyled
            placeholder={translate('shopping_bag.gift_message')}
            onChange={e => changeGiftWrapMessageHandler(e.target.value)}
            maxLength={maxGiftMessageLength}
          />
        </GiftMessageStyled>
      )}
    </>
  );
};

export default withLocales(GiftWrap);
