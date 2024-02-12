import React, { useState } from 'react';
import {
  withAuth,
  withLocales,
  withCustomer,
  withStoreConfig,
  Link,
} from '@central-tech/core-ui';
import Cookies from 'js-cookie';
import LoginFacebookButton from './components/LoginFacebookButton';
import RegisterButton from './components/RegisterButton';
import TheOnePromotion from './components/TheOnePromotion';
import InputBox from './components/InputBox';
import CheckBox from './components/Checkbox';
import RatioBox from './components/RatioBox';
import {
  LayoutStyled,
  TitleStyled,
  TheOnePromotionStyled,
  FacebookButtonStyled,
  SectionBreakPointStyled,
  SectionBreakPointStyledSpanStyled,
  InputStyled,
  InputBoxStyled,
  GenderInputStyled,
  GenderInputElementStyled,
  ConsentCheckboxStyled,
  PasswordDescriptionStyled,
  RegisterStatusStyled,
  RegisterButtonStyled,
  AlreadyMemberStyled,
  AlreadyMemberTextStyled,
  AlreadyMemberLinkStyled,
  LinkAgreementStyled,
  LinkRegisterStyled,
} from './styled';
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
} from './utils';

const MobileRegister = ({ activeConfig, auth, register, translate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');
  const [receivePromotionFlag, setReceivePromotionFlag] = useState(true);
  const [acknowledgeAgreementFlag, setAcknowledgeAgreementFlag] = useState(
    true,
  );
  const [gender, setGender] = useState('male');
  const generateValidateFirstNameMessage = firstName => {
    const firstNameErrorMessage = validateFirstName(firstName);
    return firstNameErrorMessage ? translate(firstNameErrorMessage) : '';
  };
  const generateValidateLastNameMessage = lastName => {
    const lastNameErrorMessage = validateLastName(lastName);
    return lastNameErrorMessage ? translate(lastNameErrorMessage) : '';
  };
  const generateValidateEmailMessage = email => {
    const emailErrorMessage = validateEmail(email);
    return emailErrorMessage ? translate(emailErrorMessage) : '';
  };
  const generateValidatePasswordMessage = password => {
    const passwordErrorMessage = validatePassword(password);
    return passwordErrorMessage ? translate(passwordErrorMessage) : '';
  };
  const generateValidateTermAndConditionMessage = acknowledgeAgreementFlag => {
    return acknowledgeAgreementFlag ? '' : '';
  };
  const handleFirstNameChange = e => {
    setFirstName(e.target.value);
    setFirstNameErrorMessage(generateValidateFirstNameMessage(e.target.value));
  };
  const handleLastNameChange = e => {
    setLastName(e.target.value);
    setLastNameErrorMessage(generateValidateLastNameMessage(e.target.value));
  };
  const handleEmailChange = e => {
    setEmail(e.target.value);
    setEmailErrorMessage(generateValidateEmailMessage(e.target.value));
  };
  const handlePasswordChange = e => {
    setPassword(e.target.value);
    setPasswordErrorMessage(generateValidatePasswordMessage(e.target.value));
  };
  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      emailErrorMessage ||
      passwordErrorMessage ||
      firstNameErrorMessage ||
      lastNameErrorMessage ||
      !acknowledgeAgreementFlag
    ) {
      setEmailErrorMessage(generateValidateEmailMessage(email));
      setPasswordErrorMessage(generateValidatePasswordMessage(password));
      setFirstNameErrorMessage(generateValidateFirstNameMessage(firstName));
      setLastNameErrorMessage(generateValidateLastNameMessage(lastName));
      setRegisterStatus(
        generateValidateTermAndConditionMessage(acknowledgeAgreementFlag),
      );
    } else {
      const registerRequest = {
        email: email,
        password: password,
        firstname: firstName,
        lastname: lastName,
        is_subscribed: acknowledgeAgreementFlag,
        storeId: Number(activeConfig.id),
      };
      setRegisterStatus('');
      submitRegisterRequest(registerRequest);
    }
  };
  const handleReceivePromotionCheck = () => {
    setReceivePromotionFlag(!receivePromotionFlag);
  };
  const handleAcknowledgeAgreementCheck = () => {
    setAcknowledgeAgreementFlag(!acknowledgeAgreementFlag);
  };
  const submitRegisterRequest = async registerRequest => {
    register
      .mutation({
        variables: {
          input: registerRequest,
          storeCode: activeConfig.code,
        },
      })
      .then(response => {
        const responseMessage = response.data.register.message;
        if (responseMessage === 'success') {
          const loginRequest = {
            username: registerRequest.email,
            password: registerRequest.password,
            is_jwt: true,
          };
          auth.loginManual
            .mutation({
              variables: loginRequest,
            })
            .then(data => {
              Cookies.set('uut', data.data.login.token, { expires: 365 });
            })
            .then(() => {
              document.location.href = '/';
            });
        } else if (
          responseMessage ===
          'A customer with the same email address already exists in an associated website.'
        ) {
          setRegisterStatus(translate('register.form.same_email_exists'));
        }
      });
  };

  return (
    <LayoutStyled>
      <TitleStyled>{translate('register.create_with_fb')}</TitleStyled>
      <FacebookButtonStyled>
        <LoginFacebookButton />
      </FacebookButtonStyled>
      <SectionBreakPointStyled>
        <SectionBreakPointStyledSpanStyled>
          {translate('register.label_or')}
        </SectionBreakPointStyledSpanStyled>
      </SectionBreakPointStyled>
      <TheOnePromotionStyled>
        <TheOnePromotion />
      </TheOnePromotionStyled>
      <form onSubmit={e => handleSubmit(e)}>
        <InputStyled>
          <InputBoxStyled>
            <InputBox
              type="text"
              id="first-name"
              label={translate('register.form.name')}
              placeholder={translate('register.form.enter_first_name')}
              handleInputChange={handleFirstNameChange}
              errorMessage={firstNameErrorMessage}
            />
          </InputBoxStyled>
          <InputBoxStyled>
            <InputBox
              type="text"
              id="last-name"
              label={translate('register.form.last_name')}
              placeholder={translate('register.form.enter_last_name')}
              handleInputChange={handleLastNameChange}
              errorMessage={lastNameErrorMessage}
            />
          </InputBoxStyled>
          <InputBoxStyled>
            <InputBox
              type="email"
              id="email"
              label={translate('register.form.email')}
              placeholder={translate('register.form.enter_email')}
              handleInputChange={handleEmailChange}
              errorMessage={emailErrorMessage}
            />
          </InputBoxStyled>
          <InputBoxStyled>
            <InputBox
              type="password"
              id="password"
              label={translate('register.form.password')}
              placeholder={translate('register.form.enter_password')}
              handleInputChange={handlePasswordChange}
              errorMessage={passwordErrorMessage}
            />
            <PasswordDescriptionStyled>
              {translate('register.form.password_length')}
            </PasswordDescriptionStyled>
          </InputBoxStyled>
          <InputBoxStyled>
            <GenderInputStyled>
              <GenderInputElementStyled onClick={() => setGender('male')}>
                <RatioBox
                  name="gender"
                  value="male"
                  label={translate('register.form.male')}
                  checked={gender === 'male'}
                />
              </GenderInputElementStyled>
              <GenderInputElementStyled onClick={() => setGender('female')}>
                <RatioBox
                  name="gender"
                  value="female"
                  label={translate('register.form.female')}
                  checked={gender === 'female'}
                />
              </GenderInputElementStyled>
            </GenderInputStyled>
          </InputBoxStyled>
          <InputBoxStyled>
            <ConsentCheckboxStyled>
              <CheckBox
                checkFlag={receivePromotionFlag}
                checkHandler={handleReceivePromotionCheck}
                label={[translate('register.accept_receive_exclusive')]}
              />
            </ConsentCheckboxStyled>
            <ConsentCheckboxStyled>
              <CheckBox
                checkFlag={acknowledgeAgreementFlag}
                checkHandler={handleAcknowledgeAgreementCheck}
                label={[
                  translate('register.accept_term_condition'),
                  <Link to="/terms-condition" key={`terms-condition`}>
                    <LinkAgreementStyled>
                      {translate('register.terms_conditions')}
                    </LinkAgreementStyled>
                  </Link>,
                  translate('register.and_text'),
                  <Link to="/privacy-policy" key={`privacy-policy`}>
                    <LinkAgreementStyled>
                      {translate('register.privacy_policy')}
                    </LinkAgreementStyled>
                  </Link>,
                  translate('register.of_supersports'),
                ]}
              />
            </ConsentCheckboxStyled>
          </InputBoxStyled>
        </InputStyled>
        {registerStatus ? (
          <RegisterStatusStyled>{registerStatus}</RegisterStatusStyled>
        ) : null}
        <RegisterButtonStyled>
          <RegisterButton />
        </RegisterButtonStyled>
        <AlreadyMemberStyled>
          <AlreadyMemberTextStyled>
            {translate('register.form.already_member')}
          </AlreadyMemberTextStyled>
          <AlreadyMemberLinkStyled>
            <Link to="/login">
              <LinkRegisterStyled>
                {translate('register.form.signin')}
              </LinkRegisterStyled>
            </Link>
          </AlreadyMemberLinkStyled>
        </AlreadyMemberStyled>
      </form>
    </LayoutStyled>
  );
};

export default withAuth(
  withStoreConfig(withCustomer(withLocales(MobileRegister))),
);
