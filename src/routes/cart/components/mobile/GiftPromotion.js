import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';
import Checkbox from './GiftCheckbox';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const GiftAndPromotionStyled = styled.div`
  padding: 20px 10px 20px 10px;
  border-bottom: 0.67px solid #d3d3d3;
  h3 {
    font-size: 13px;
    color: #171717;
    font-weight: bold;
    text-transform: uppercase;
  }
`;
const GiftStyled = styled.div`
  margin-bottom: 20px;
  h3 {
    margin-bottom: 10px;
  }
`;
const GiftLayoutStyled = styled.div`
  border: 0.67px solid #d3d3d3;
  display: grid;
  grid-template-columns: 80px 1fr;
`;
const GiftOptionStyled = styled.div`
  position: relative;
  border-left: 0.67px solid #d3d3d3;
  padding: 10px 20px 10px 55px;
  h4 {
    font-weight: bold;
    margin-bottom: 3px;
  }
  p {
    margin: 0;
    font-size: 10px;
  }
`;
const GiftImageStyled = styled.div`
  margin: auto;

  img {
    width: 30px;
    height: 30px;
  }
`;
const GiftOptionCheckboxStyled = styled.div`
  position: absolute;
  left: 15px;
  margin: auto;
`;
const PromotionCodeStyled = styled.div`
  h3 {
    font-size: 13px;
    margin-bottom: 10px;
  }
  p {
    margin: 0;
    color: ${props => (props.promotionCodeErrorFlag ? '#D75A4A' : '#3F820B')};
    margin-bottom: 12px;
    font-style: italic;
    font-size: 13px;
    font-weight: bold;
    display: ${props => (props.displayFlag ? 'inline-block' : 'none')};
  }
  img {
    width: 20px;
    height: 20px;
    display: ${props => (props.displayFlag ? 'inline-block' : 'none')};
    margin-right: 5px;
  }
`;
const PromotionCodeBoxStyled = styled.div`
  height: 46px;
  display: grid;
  grid-template-columns: 1fr 100px;
  grid-gap: 10px;
  box-sizing: border-box;
  input {
    padding: 0 15px;
    border: 0.67px solid #d3d3d3;
    font-size: 13px;
    font-weight: bold;
    ::placeholder {
      color: #a8a8a8;
    }
  }
  button {
    font-size: 17px;
    background-color: #78e723;
    color: #fff;
    border: none;
    font-weight: bold;
    text-transform: uppercase;
  }
`;
const AppliedPromotionCodeStyled = styled.div`
  h3 {
    font-size: 13px;
    margin-top: 20px;
    margin-bottom: 10px;
  }
`;
const AppliedPromotionCodeComponentStyled = styled.div`
  font-weight: bold;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
  > span {
    font-size: 16px;
    color: #171717;
    margin: 0;
    text-transform: uppercase;
  }
  > span:last-child {
    text-transform: none;
    font-size: 11px;
    margin-left: 10px;
    color: #1065c2;
  }
`;
const GiftMessageStyled = styled.div`
  margin-top: 15px;
`;
const GiftMessageTitleStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  h4 {
    margin: 0;
    font-size: 11px;
    font-weight: bold;
    color: #171717;
  }
  p {
    margin: 0;
    font-size: 11px;
    font-weight: bold;
    color: #a8a7a7;
  }
`;
const GiftMessageInputStyled = styled.textarea`
  resize: none;
  width: 100%;
  height: 103px;
  padding: 10px;
  font-size: 11px;
  font-weight: bold;
  border: 0.67px solid #d3d3d3;
  ::placeholder {
    color: #a8a7a7;
  }
`;

const GiftAndPromotion = ({
  promotionCodeErrorFlag,
  submitPromotionMessage,
  promotionCode,
  promotionCodeHandler,
  submitPromotionHandler,
  submittedPromotionCode,
  removeSubmittedPromotionCodeHandler,
  giftFlag,
  giftMessage,
  setGiftWrapMessageHandler,
  changeGiftWrapMessageHandler,
  translate,
}) => {
  const maxGiftMessageLength = 270;
  const AppliedPromotionCode = ({ id, code }) => {
    return (
      <AppliedPromotionCodeComponentStyled key={id}>
        <span
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'CodeName',
            'GiftPromotion',
            code,
          )}
        >
          {code}
        </span>
        <span
          id={generateElementId(
            ELEMENT_TYPE.LINK,
            ELEMENT_ACTION.REMOVE,
            'RemoveCode',
            'GiftPromotion',
            code,
          )}
          onClick={() => removeSubmittedPromotionCodeHandler(code)}
        >
          {translate('shopping_bag.remove')}
        </span>
      </AppliedPromotionCodeComponentStyled>
    );
  };
  return (
    <GiftAndPromotionStyled>
      <GiftStyled>
        <h3>{translate('shopping_bag.gift_option')}</h3>
        <GiftLayoutStyled>
          <GiftImageStyled>
            <img src="/static/icons/gift-wrap.svg" />
          </GiftImageStyled>
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
      </GiftStyled>
      <PromotionCodeStyled
        promotionCodeErrorFlag={promotionCodeErrorFlag}
        displayFlag={submitPromotionMessage}
      >
        <h3>{translate('shopping_bag.promotion_code')}</h3>
        <img
          src={`/static/icons/${
            promotionCodeErrorFlag ? 'Error' : 'DeliveryAvailable-01'
          }.svg`}
        />
        <p
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'PromotionCodeMessage',
            'GiftPromotion',
          )}
        >
          {submitPromotionMessage}
        </p>
        <PromotionCodeBoxStyled>
          <input
            id={generateElementId(
              ELEMENT_TYPE.FORM,
              ELEMENT_ACTION.CHECK,
              'EnterCode',
              'GiftPromotion',
            )}
            placeholder="Enter Code"
            value={promotionCode}
            onChange={e => promotionCodeHandler(e.target.value)}
          />
          <button
            id={generateElementId(
              ELEMENT_TYPE.BUTTON,
              ELEMENT_ACTION.CHECK,
              'ApplyCode',
              'GiftPromotion',
            )}
            onClick={() => submitPromotionHandler()}
          >
            {translate('shopping_bag.apply')}
          </button>
        </PromotionCodeBoxStyled>
      </PromotionCodeStyled>
      <AppliedPromotionCodeStyled>
        {submittedPromotionCode.length !== 0 && (
          <h3>{translate('shopping_bag.applied_promotion_code')}</h3>
        )}
        {submittedPromotionCode.map((code, index) => (
          <AppliedPromotionCode id={index} code={code} />
        ))}
      </AppliedPromotionCodeStyled>
    </GiftAndPromotionStyled>
  );
};

export default withLocales(GiftAndPromotion);
