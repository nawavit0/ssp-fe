import React from 'react';
import styled from 'styled-components';

const CheckboxStyled = styled.input`
    width: 16px;
    height: 16px;
    outline: 1px solid #1e5180
    display: inline-block;
    margin: 0 10px 0 5px;
    border: none;
    transform: translateY(2px);
    background: #fff;
    &:checked {
      background: none;
    }
`;
const Icon = styled.svg`
  position: absolute;
  fill: none;
  stroke: #4a90e2;
  stroke-width: 3px;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  margin-left: 5px;
`;

const Checkbox = ({ checkFlag, checkHandler }) => {
  return (
    <>
      <Icon viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12" />
      </Icon>
      <CheckboxStyled
        id="remember-me"
        type="checkbox"
        checked={checkFlag}
        onChange={checkHandler}
      />
    </>
  );
};

export default Checkbox;
