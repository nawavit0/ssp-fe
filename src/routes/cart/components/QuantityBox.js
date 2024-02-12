import React from 'react';
import styled from 'styled-components';
import { IncrementInputBox } from '@central-tech/core-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';

const QuantityBoxStyled = styled(IncrementInputBox)`
  border: 1px solid #e1e1e1;
  width: ${props => (props.layoutWidth ? props.layoutWidth : '120px')};
  height: 38px;
  line-height: 26px;
  text-align: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  user-select: ${props => (props.disabled ? 'none' : 'auto')};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  input {
    width: ${props => (props.inputWidth ? props.inputWidth : '53px')};
    height: 38px;
    border-top: 0px;
    border-bottom: 0px;
    border-left: 1px #e1e1e1 solid;
    border-right: 1px #e1e1e1 solid;
    font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
    font-weight: bold;
    color: #363636;
  }
`;
const QuantityActionStyled = styled.div`
  transition: all 300ms;
  height: 36px;
  width: ${props => (props.width ? props.width : '32px')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 300;
  user-select: ${props => (props.disableButtonFlag ? 'none' : 'auto')};
  opacity: ${props => (props.disableButtonFlag ? 0.4 : 1)};
  color: ${props => (props.disableButtonFlag ? '#6b6b6b' : '#525252')};
  cursor: ${props => (props.disableButtonFlag ? 'not-allowed' : 'pointer')};
  :hover {
    background: #eee;
  }
`;

const QuantityBox = ({
  inputId,
  disableBoxFlag,
  productId,
  qty,
  minQty,
  maxQty,
  layoutWidth,
  buttonWidth,
  inputWidth,
  fontSize,
  updateProductQtyHandler,
}) => {
  const id = inputId ? inputId : `IncrementInputBox-${productId}`;
  return (
    <QuantityBoxStyled
      inputId={id}
      disabled={disableBoxFlag}
      layoutWidth={layoutWidth}
      inputWidth={inputWidth}
      fontSize={fontSize}
      defaultValue={qty}
      minValue={minQty}
      maxValue={maxQty}
      onUpdateCompleted={value => updateProductQtyHandler(productId, value)}
      renderButton={direction => (
        <QuantityActionStyled
          width={buttonWidth}
          id={
            direction === 'inc'
              ? `${id}-increment-button`
              : `${id}-decrement-button`
          }
        >
          {direction === 'inc' ? '+' : '-'}
        </QuantityActionStyled>
      )}
      renderButtonDisabled={direction => (
        <QuantityActionStyled
          width={buttonWidth}
          id={
            direction === 'inc'
              ? `${inputId}-increment-button`
              : `${inputId}-decrement-button`
          }
          disableButtonFlag
        >
          {direction === 'inc' ? '+' : '-'}
        </QuantityActionStyled>
      )}
      id={generateElementId(
        ELEMENT_TYPE.SELECT,
        ELEMENT_ACTION.EDIT,
        'SelectQtyProductItem',
        'ShoppingBagArea',
      )}
    />
  );
};

export default QuantityBox;
