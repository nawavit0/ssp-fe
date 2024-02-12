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

const RegisterButton = ({ translate }) => {
  return (
    <ButtonStyled
      id="btn-emailLogin"
      type="submit"
      value={translate('register.form.register_button_text')}
    />
  );
};

export default withLocales(RegisterButton);
