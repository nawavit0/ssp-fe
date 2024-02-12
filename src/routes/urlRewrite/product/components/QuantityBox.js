import React from 'react';
import styled from 'styled-components';
import { IncrementInputBox } from '@central-tech/core-ui';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

export const QuantityBoxStyled = styled.div`
  position: relative;
  .overlay {
    &.disabled {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      background: #eee;
      opacity: 0.9;
    }
  }
`;

export const MiniCartQtyBoxStyled = styled(IncrementInputBox)`
  border: ${props => (props.isMobile ? 'none' : '1px solid #e1e1e1;')}
  width: ${props => (props.isMobile ? '139px' : '144px')}
  height: 38px;
  line-height: 36px;
  text-align: center;
  input {
    width: ${props => (props.isMobile ? '57px' : '66px')}
    height: 38px;
    border-top: ${props => (props.isMobile ? '1px #e1e1e1 solid' : '0px')}
    border-bottom: ${props => (props.isMobile ? '1px #e1e1e1 solid' : '0px')}
    border-left: 1px #e1e1e1 solid;
    border-right: 1px #e1e1e1 solid;
    font-size: 16px;
    font-weight: bold;
    color: #363636;
  }
`;
export const MiniCartQtyActionStyled = styled.div`
  transition: all 300ms;
  width: 38px;
  border: ${props => (props.isMobile ? '1px solid #e1e1e1' : 'none')}
  ${props => (props.isMobile ? 'margin: 0 2px' : '')}
  display: inline-flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-size: 26px;
  color: #6b6b6b;
  font-weight: 300;
  :hover {
    background: #eee;
  }
`;
export const MiniCartQtyActionDisabledStyled = styled.div`
  transition: all 300ms;
  width: 38px;
  border: ${props => (props.isMobile ? '1px solid #e1e1e1' : 'none')}
  ${props => (props.isMobile ? 'margin: 0 2px' : '')}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-size: 26px;
  color: #6b6b6b;
  cursor: not-allowed;
  font-weight: 300;
  opacity: 0.4;
`;
const QuantityBox = props => {
  const { setQty, qty, stockQty, minQty, maxQty, isMobile } = props;
  const outOfStock = stockQty === 0;
  return (
    <QuantityBoxStyled>
      <div className={`overlay ${outOfStock && 'disabled'}`} />
      <MiniCartQtyBoxStyled
        isMobile={isMobile}
        defaultValue={qty}
        minValue={minQty}
        maxValue={maxQty}
        delay={0}
        onUpdateCompleted={value => setQty(value)}
        renderButton={direction => (
          <MiniCartQtyActionStyled isMobile={isMobile}>
            {direction === 'inc' ? '+' : '-'}
          </MiniCartQtyActionStyled>
        )}
        renderButtonDisabled={direction => (
          <MiniCartQtyActionDisabledStyled isMobile={isMobile}>
            {direction === 'inc' ? '+' : '-'}
          </MiniCartQtyActionDisabledStyled>
        )}
        id={generateElementId(
          ELEMENT_TYPE.SELECT,
          ELEMENT_ACTION.ADD,
          'SelectQtyProduct',
          'ProductDetailArea',
        )}
      />
    </QuantityBoxStyled>
  );
};

export default QuantityBox;
