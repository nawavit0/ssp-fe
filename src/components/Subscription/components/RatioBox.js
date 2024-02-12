import React from 'react';
import styled from 'styled-components';

const RadioButtonLabelStyled = styled.label`
  position: absolute;
  left: 0;
  width: 16px;
  height: 16px;
  border-radius: 20%;
  background: white;
  border: 1px solid #bebebe;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  pointer-events: none;
`;
const RadioButtonStyled = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 20%;
  width: 16px;
  height: 16px;
  display: block;

  &:checked + ${RadioButtonLabelStyled} {
    background: #29b311;
    border: 1px solid #27aa11;
    &::after {
      content: '';
      display: block;
      border-radius: 20%;
      width: 6px;
      height: 6px;
      margin: 4px;
      box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.1);
      background: white;
    }
  }
`;
const RatioBoxStyled = styled.label`
  width: 70px;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  &:not(:last-child) {
    margin-right: 30px;
  }
`;
const RatioBoxLabelStyled = styled.p`
  color: white;
  left: 30px;
  position: absolute;
  margin: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const RatioBox = ({ label, value, name, handler, checked }) => {
  return (
    <RatioBoxStyled>
      <RadioButtonStyled
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={e => handler(e)}
      />
      <RadioButtonLabelStyled />
      <RatioBoxLabelStyled>{label}</RatioBoxLabelStyled>
    </RatioBoxStyled>
  );
};

export default RatioBox;
