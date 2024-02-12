import React from 'react';
import { withLocales, withStoreConfig } from '@central-tech/core-ui';
import styled from 'styled-components';

import { nativePopup } from '../../../../utils/popup';

const ButtonStyled = styled.button`
  width: 100%;
  height: 50px;
  display: block;
  font-size: 16px;

  background-color: #3d5997;
  color: #fff;
  border: none;

  padding-right: 15px;
  padding: 5px 0;
`;
const FacebookIconStyled = styled.img`
  height: 90%;
  display: inline;
  margin-right: 5px;
  padding-bottom: 5px;
`;
const MessageStyled = styled.p`
  display: inline;
`;

const FacebookLoginButton = ({ translate, activeConfig }) => {
  const handleFacebookLogin = e => {
    e.preventDefault();

    const loginUrl = `${activeConfig.base_url}sociallogin/auth/login/provider/facebook`;
    nativePopup(loginUrl);
  };

  return (
    <ButtonStyled
      id="btn-facebookLogin"
      type="button"
      onClick={handleFacebookLogin}
    >
      <FacebookIconStyled src="/icons/social-facebook.svg" />
      <MessageStyled>{translate('register.button_facebook')}</MessageStyled>
    </ButtonStyled>
  );
};

export default withLocales(withStoreConfig(FacebookLoginButton));
