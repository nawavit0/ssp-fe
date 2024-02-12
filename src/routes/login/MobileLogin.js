import React, { Fragment, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { withAuth, withLocales, withRoutes } from '@central-tech/core-ui';
import Cookies from 'js-cookie';
import { get } from 'lodash';

import {
  LayoutStyled,
  TitleStyled,
  FacebookButtonStyled,
  SectionBreakPointStyled,
  SectionBreakPointStyledSpanStyled,
  EmailInputBoxStyled,
  PasswordInputBoxStyled,
  FormFooterStyled,
  RememberMeCheckboxStyled,
  ForgotPasswordStyled,
  LoginEmailButtonStyled,
  RegisterNowLabelStyled,
  LoginStatusStyled,
} from './styled';
import InputBox from './components/InputBox';
import Link from '../../components/Link';
import LoginFacebookButton from './components/LoginFacebookButton';
import LoginEmailButton from './components/LoginEmailButton';
import RegisterNowButton from './components/RegisterNowButton';
import RememberMeCheckbox from './components/RememberMeCheckbox';
import { validateEmail, validatePassword } from './utils';

const MobileLogin = ({ auth, translate, location }, { customer }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [rememberMeCheckFlag, setRememberMeCheckFlag] = useState(true);
  const generateValidateEmailMessage = email => {
    const emailErrorMessage = validateEmail(email);
    return emailErrorMessage ? translate(emailErrorMessage) : '';
  };
  const generateValidatePasswordMessage = password => {
    const passwordErrorMessage = validatePassword(password);
    return passwordErrorMessage ? translate(passwordErrorMessage) : '';
  };
  const submitLoginRequest = async loginRequest => {
    const { queryParams } = location;
    auth.loginManual
      .mutation({
        variables: loginRequest,
      })
      .then(data => {
        Cookies.set('uut', data.data.login.token, { expires: 365 });
      })
      .then(() => {
        if (queryParams.previous_page) {
          document.location.href = `${decodeURI(queryParams.previous_page)}${
            queryParams.auto_wishlist ? `?auto_wishlist=true` : ``
          }${queryParams.size ? `&size=${queryParams.size}` : ``}`;
        } else {
          document.location.href = '/';
        }
      })
      .catch(() => {
        setLoginStatus(translate('login.invalid_email_password'));
      });
  };
  const handleEmailChange = e => {
    setEmail(e.target.value);
    setEmailErrorMessage(generateValidateEmailMessage(e.target.value));
  };
  const handleSubmit = async e => {
    e.preventDefault();

    if (!email || !password || emailErrorMessage || passwordErrorMessage) {
      setEmailErrorMessage(generateValidateEmailMessage(email));
      setPasswordErrorMessage(generateValidatePasswordMessage(password));
    } else {
      const loginRequest = {
        username: email,
        password: password,
        is_jwt: true,
      };
      submitLoginRequest(loginRequest);
    }
  };
  const handlePasswordChange = e => {
    setPassword(e.target.value);
    setPasswordErrorMessage(generateValidatePasswordMessage(e.target.value));
  };
  const handleRememberMeCheck = () => {
    setRememberMeCheckFlag(!rememberMeCheckFlag);
  };

  useEffect(() => {
    if (get(customer, 'firstname', '')) {
      document.location.href = '/';
    }
  }, [customer]);

  return (
    <Fragment>
      <LayoutStyled>
        <TitleStyled>{translate('login.login')}</TitleStyled>
        <FacebookButtonStyled>
          <LoginFacebookButton />
        </FacebookButtonStyled>
        <SectionBreakPointStyled>
          <SectionBreakPointStyledSpanStyled>
            {translate('login.or')}
          </SectionBreakPointStyledSpanStyled>
        </SectionBreakPointStyled>
        <form onSubmit={e => handleSubmit(e)}>
          <EmailInputBoxStyled>
            <InputBox
              type="email"
              id="email"
              label={translate('login.email')}
              placeholder={translate('login.enter_email')}
              handleInputChange={handleEmailChange}
              errorMessage={emailErrorMessage}
              value={email}
            />
          </EmailInputBoxStyled>
          <PasswordInputBoxStyled>
            <InputBox
              type="password"
              id="password"
              label={translate('login.password')}
              placeholder={translate('login.enter_password')}
              handleInputChange={handlePasswordChange}
              errorMessage={passwordErrorMessage}
              value={password}
            />
          </PasswordInputBoxStyled>
          <FormFooterStyled>
            <RememberMeCheckboxStyled>
              <RememberMeCheckbox
                checkHandler={handleRememberMeCheck}
                rememberMeCheckFlag={rememberMeCheckFlag}
              />
            </RememberMeCheckboxStyled>
            <ForgotPasswordStyled>
              <Link to="/user/forgot-password">
                {translate('login.forgot_password')}
              </Link>
            </ForgotPasswordStyled>
          </FormFooterStyled>
          {loginStatus ? (
            <LoginStatusStyled>{loginStatus}</LoginStatusStyled>
          ) : null}
          <LoginEmailButtonStyled>
            <LoginEmailButton />
          </LoginEmailButtonStyled>
        </form>
        <RegisterNowLabelStyled>
          {translate('login.not_member_yet')}
        </RegisterNowLabelStyled>
        <RegisterNowButton />
      </LayoutStyled>
    </Fragment>
  );
};

MobileLogin.contextTypes = {
  customer: propTypes.object,
};

export default withAuth(withLocales(withRoutes(MobileLogin)));
