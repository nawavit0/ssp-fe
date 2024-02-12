import React from 'react';
import styled from 'styled-components';

const SignupButtonStyled = styled.button`
  padding: 9px 10px;
  color: #363636;
  background-color: #78e723;
  ${({ width = '100%' }) => width};
  border: none;
  font-size: 14px;
  cursor: pointer;
  grid-column: 5 / 6;
  height: 100%;
  width: 100%;
`;

const SignupButton = ({ label, width }) => {
  return (
    <SignupButtonStyled type="submit" width={width}>
      {label}
    </SignupButtonStyled>
  );
};

export default SignupButton;
