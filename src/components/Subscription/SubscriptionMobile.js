import React, { useState } from 'react';
import { Formik } from 'formik';
import styled from 'styled-components';
import { withLocales, withNewsletter } from '@central-tech/core-ui';

import RatioBox from './components/RatioBox';
import SignupButton from './components/SignupButton';
import { validateEmail } from './utils';

const LayoutStyled = styled.form`
  background-color: #13283f;
  padding: 20px 20px;

  input[type='radio'] {
    -webkit-appearance: radio;
  }
`;
const TopicStyled = styled.p`
  color: #fefefe;
  font-size: 14px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
`;
const GenderInputStyled = styled.div`
  margin-bottom: 15px;
  text-align: center;
`;
const SignupStyled = styled.div`
  text-align: center;
  width: 100%;
`;
const EmailInputStyled = styled.div`
  position: relative;
  margin-bottom: 12px;
  font-size: 12px;
`;
const InputBoxStyled = styled.input`
  border: none;
  padding: 10px;
  width: 100%;
  color: ${props => (props.emailValidFlag ? 'black' : 'red')};
  line-height: 1.5;
`;
const EmailErrorMessageStyled = styled.p`
  position: absolute;
  color: red;
  right: 10px;
  top: -20px;
  margin: 0;
`;

const SubscriptionMobile = ({ translate, newsletterManual }) => {
  const defaultValue = {
    email: '',
    gender: 'Female',
  };
  const [emailValidFlag, setEmailValidFlag] = useState(true);
  const [gender, setGender] = useState(defaultValue.gender);
  const handleChangeGender = e => {
    setGender(e.target.value);
  };
  return (
    <Formik
      initialValues={{
        email: defaultValue.email,
        gender: defaultValue.gender,
      }}
      validate={values => {
        const errors = {};
        if (!values.email) {
          errors.email = translate('newsletter_sign_up.required');
          setEmailValidFlag(false);
        } else if (!validateEmail(values.email)) {
          errors.email = translate('newsletter_sign_up.invalid_email_address');
          setEmailValidFlag(false);
        } else {
          setEmailValidFlag(true);
        }
        return errors;
      }}
      onSubmit={(values, actions) => {
        const { email } = values;
        newsletterManual
          .mutation({
            variables: {
              email: email,
              gender: gender,
            },
          })
          .then(() => {
            alert(translate('newsletter_sign_up.signup_success'));
            actions.setValues({
              email: defaultValue.email,
              gender: defaultValue.gender,
            });
            setEmailValidFlag(true);
          })
          .catch(error => {
            if (
              error.message ===
              'GraphQL error: Your email is already subscribed to our newsletter'
            ) {
              actions.setErrors({
                email: translate('newsletter_sign_up.existed_email_address'),
              });
              setEmailValidFlag(false);
            } else {
              actions.setErrors({
                email: translate('newsletter_sign_up.invalid_email_address'),
              });
              setEmailValidFlag(false);
            }
          });
      }}
    >
      {({ values, errors, handleSubmit, handleChange }) => (
        <LayoutStyled onSubmit={handleSubmit}>
          <TopicStyled>
            {translate('newsletter_sign_up.newsletter_sign_up')}
          </TopicStyled>
          <EmailInputStyled>
            <InputBoxStyled
              name="email"
              type="email"
              placeholder={translate('newsletter_sign_up.your_email_address')}
              onChange={handleChange}
              emailValidFlag={emailValidFlag}
              value={values.email}
            />
            <EmailErrorMessageStyled>{errors.email}</EmailErrorMessageStyled>
          </EmailInputStyled>
          <GenderInputStyled>
            <RatioBox
              label={translate('female')}
              value="Female"
              name="gender"
              handler={handleChangeGender}
              checked={gender === 'Female'}
            />
            <RatioBox
              label={translate('male')}
              value="Male"
              name="gender"
              handler={handleChangeGender}
              checked={gender === 'Male'}
            />
          </GenderInputStyled>
          <SignupStyled>
            <SignupButton
              width={'100%'}
              label={translate('newsletter_sign_up.signup')}
            />
          </SignupStyled>
        </LayoutStyled>
      )}
    </Formik>
  );
};

export default withNewsletter(withLocales(SubscriptionMobile));
