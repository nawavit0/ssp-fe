import React from 'react';
import { withLocales, Link } from '@central-tech/core-ui';
import styled from 'styled-components';

const ButtonStyled = styled.button`
  width: 100%;
  height: 50px;
  display: block;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  background-color: #78e723;
  color: #13283f;
  letter-spacing: 2px;
`;

const RegisterNowButton = ({ translate, handleRegisterNow }) => {
  return (
    <Link to="/register">
      <ButtonStyled
        id="btn-registerNow"
        type="button"
        onClick={handleRegisterNow}
      >
        {translate('login.register_now')}
      </ButtonStyled>
    </Link>
  );
};

export default withLocales(RegisterNowButton);
