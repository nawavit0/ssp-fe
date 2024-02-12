import React from 'react';
import styled from 'styled-components';

const RatioBoxStyled = styled.input`
  &:not(:first-child) {
    margin-left: 20px;
  }
`;
const RatioBoxLabelStyled = styled.span`
  margin-left: 15px;
`;

const RatioBox = ({ label, value, name, checked }) => {
  return (
    <>
      <RatioBoxStyled
        type="radio"
        name={name}
        value={value}
        checked={checked}
      />
      <RatioBoxLabelStyled>{label}</RatioBoxLabelStyled>
    </>
  );
};

export default RatioBox;
