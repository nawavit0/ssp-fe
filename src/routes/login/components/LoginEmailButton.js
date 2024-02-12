import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import styled from 'styled-components';

const ButtonStyled = styled.input`
  width: 100%;
  height: 50px;
  display: block;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  background-color: #13283f;
  color: #fff;
  letter-spacing: 2px;
`;

const LoginEmailButton = ({ translate }) => {
  return (
    <ButtonStyled
      id="btn-emailLogin"
      type="submit"
      value={translate('login.login_with_email')}
    />
  );
};

export default withLocales(LoginEmailButton);
