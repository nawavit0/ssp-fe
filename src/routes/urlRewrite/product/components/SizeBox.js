import React from 'react';
import styled from 'styled-components';

const SizeBoxStyled = styled.button`
  background-color: ${props => (props.isSelected ? '#17212C' : '#fff')};
  color: ${props => (props.isSelected ? '#fff' : '#1A1B1A')};
  border: 1px solid #363636;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  height: 48px;
  min-width: 48px;
  width: auto;
  position: relative;
  img {
    display: ${props => (props.disabled ? 'block' : 'none')}
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &:disabled {
    position: relative;
    color: #AEAEAE;
    border: 1px solid #AEAEAE;
    pointer-events: none;
    img {
      display: ${props => (props.disabled ? 'block' : 'none')}
    }
  }
`;
const SizeBox = ({ setSelectedSize, size, selectedSize }) => (
  <SizeBoxStyled
    isSelected={size.productId === selectedSize}
    onClick={() => setSelectedSize(size.productId)}
    disabled={!size.salableFlag}
  >
    <img src="/static/icons/CrossIcon.png" alt="Cross Icon" />
    {size.size}
  </SizeBoxStyled>
);

export default SizeBox;
