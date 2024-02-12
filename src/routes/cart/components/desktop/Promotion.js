import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const PromotionCodeStyled = styled.div`
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #171717;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
`;
const PromotionCodeMessageStyled = styled.div`
  display: grid
  grid-template-columns: 22px 1fr;
  p {
    margin: 0;
    font-style: ${props =>
      props.promotionCodeErrorFlag ? 'italic' : 'normal'};
    color: ${props => (props.promotionCodeErrorFlag ? '#EC3232' : '#3F820B')};
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: bold;
    display: ${props => (props.displayFlag ? 'inline-block' : 'none')};
    word-wrap: break-word;
  }
  img {
    width: 14px;
    height: 14px;
    margin-top: 1px;
    display: ${props => (props.displayFlag ? 'inline-block' : 'none')};
  }
`;
const PromotionCodeBoxStyled = styled.div`
  height: 40px;
  display: grid;
  grid-template-columns: 1fr 70px;
  grid-gap: 10px;
  box-sizing: border-box;
  input {
    font-weight: bold;
    padding: 0 15px;
    border: 1px solid #d7d7d7;
    font-size: 14px;
    width: 100%;
    ::placeholder {
      color: #a8a8a8;
    }
  }
  button {
    font-weight: bold;
    cursor: pointer;
    background-color: #78e723;
    color: #fff;
    border: none;
    font-size: 14px;
    text-transform: uppercase;
  }
`;
const AppliedPromotionCodeStyled = styled.div`
  h3 {
    text-transform: uppercase;
    font-size: 16px;
    font-weight: bold;
    color: #171717;
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
    font-size: 18px;
    color: #171717;
    margin: 0;
    text-transform: uppercase;
  }
  > span:last-child {
    text-transform: none;
    font-size: 12px;
    margin-left: 10px;
    color: #1065c2;
    cursor: pointer;
  }
`;
const Promotion = ({
  promotionCodeErrorFlag,
  submitPromotionMessage,
  promotionCode,
  promotionCodeHandler,
  submitPromotionHandler,
  submittedPromotionCode,
  removeSubmittedPromotionCodeHandler,
  translate,
}) => {
  return (
    <>
      <PromotionCodeStyled>
        <h3>{translate('shopping_bag.promotion_code')}</h3>
        <PromotionCodeMessageStyled
          promotionCodeErrorFlag={promotionCodeErrorFlag}
          displayFlag={submitPromotionMessage}
        >
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
              'Promotion',
            )}
          >
            {submitPromotionMessage}
          </p>
        </PromotionCodeMessageStyled>
        <PromotionCodeBoxStyled>
          <input
            id={generateElementId(
              ELEMENT_TYPE.FORM,
              ELEMENT_ACTION.CHECK,
              'EnterCode',
              'Promotion',
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
              'Promotion',
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
          <AppliedPromotionCodeComponentStyled index={index} key={index}>
            <span
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'CodeName',
                'Promotion',
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
                'Promotion',
                code,
              )}
              onClick={() => removeSubmittedPromotionCodeHandler(code)}
            >
              {translate('shopping_bag.remove')}
            </span>
          </AppliedPromotionCodeComponentStyled>
        ))}
      </AppliedPromotionCodeStyled>
    </>
  );
};

export default withLocales(Promotion);
