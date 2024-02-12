import React from 'react';
import styled from 'styled-components';

const RadioBoxStyled = styled.label`
  display: flex;
  cursor: pointer;
`;
const InputLayoutStyled = styled.div`
  position: relative;
  width: 18px
  height: 18px;
  margin-right: 15px;
`;
const RadioStyled = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: solid 1px ${props => props.border || '#828282'};
  background-color: ${props => props.background || 'lightgrey'};
  margin: 0;
  cursor: pointer;
`;
const CheckedStyled = styled.div`
  display: ${props => (props.isActive ? 'block' : 'none')}
  width: 50%;
  height: 50%;
  background-color: ${props => props.checkedColor || 'black'};
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const LabelStyled = styled.p`
  color: #333232;
  font-size: ${props => (props.isMobile ? '13px' : '14px')};
  font-weight: bold;
  margin: 0;
`;

const RadioButton = ({
  label,
  input,
  isMobile,
  border,
  background,
  checkedColor,
  className = '',
  ...rest
}) => {
  const { checked } = input;
  return (
    <RadioBoxStyled className={className}>
      <InputLayoutStyled>
        <RadioStyled
          type="radio"
          {...input}
          {...rest}
          border={border}
          background={background}
        />

        <CheckedStyled isActive={checked} checkedColor={checkedColor} />
      </InputLayoutStyled>
      <LabelStyled isMobile={isMobile}>{label}</LabelStyled>
    </RadioBoxStyled>
  );
};

export default RadioButton;
