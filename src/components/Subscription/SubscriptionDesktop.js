import React, { useState } from 'react';
import { Formik } from 'formik';
import { withLocales, withNewsletter } from '@central-tech/core-ui';
import styled from 'styled-components';

import RatioBox from './components/RatioBox';
import SignupButton from './components/SignupButton';
import { validateEmail } from './utils';

const LayoutStyled = styled.form`
  background-color: #13283f;
  padding: 20px 0;
  margin-bottom: 30px;

  display: grid;
  grid-template-columns: 1fr max-content minmax(30%, 500px) max-content max-content 1fr;
  grid-gap: 3%;

  input[type='radio'] {
    -webkit-appearance: radio;
  }
`;
const TopicStyled = styled.p`
  color: #fefefe;
  font-size: 14px;
  text-align: center;

  grid-column: 2 / 3;
`;
const InputBoxStyled = styled.input`
  border: none;
  font-size: 12px;
  padding: 0 10px;
  width: 100%;
  height: 100%;
  color: ${props => (props.emailValidFlag ? 'black' : 'red')};
`;
const GenderInputStyled = styled.div`
  display: inline-flex;
  height: 100%;
`;
const SignupStyled = styled.div`
  grid-column: 5 / 6;
  width: 117px;
`;
const EmailInputStyled = styled.div`
  grid-column: 3 / 4;

  position: relative;
`;
const EmailErrorMessageStyled = styled.p`
  position: absolute;
  color: red;
  right: 0;
  top: -31px;
`;

const SubscriptionDesktop = ({ translate, newsletterManual }) => {
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
        <LayoutStyled onSubmit={e => handleSubmit(e)}>
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
            <SignupButton label={translate('newsletter_sign_up.signup')} />
          </SignupStyled>
        </LayoutStyled>
      )}
    </Formik>
  );
};

export default withNewsletter(withLocales(SubscriptionDesktop));
