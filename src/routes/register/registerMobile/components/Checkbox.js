import React from 'react';
import styled from 'styled-components';

const CheckBoxStyled = styled.label`
  font-size: 14px;
  padding-left: 10px;
  color: #7e7e7e;

  display: flex;
`;
const CheckboxButtonStyled = styled.input`
    width: 16px;
    height: 16px;
    outline: 1px solid #1e5180
    display: inline-block;
    margin-right: 20px;

    transform: translateY(0px);
    background: #fff;
    border: none;

    &:checked {
      background: none;
    }
`;
const IconStyled = styled.svg`
  position: absolute;
  fill: none;
  stroke: #4a90e2;
  stroke-width: 3px;
  width: 16px;
  height: 16px;
  margin-left: 3px;
  margin-top: 3px;

  flex: 1;
`;
const LabelStyled = styled.div`
  display: inline-block;
  flex: 1;
  vertical-align: top;
  margin: 4px 0 0 0;
`;

const CheckBox = ({ label, checkFlag, checkHandler }) => {
  return (
    <CheckBoxStyled>
      <IconStyled viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </IconStyled>
      <CheckboxButtonStyled
        type="checkbox"
        checked={checkFlag}
        onChange={checkHandler}
      />
      <LabelStyled>{label}</LabelStyled>
    </CheckBoxStyled>
  );
};

export default CheckBox;
