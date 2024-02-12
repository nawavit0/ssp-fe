import React from 'react';
import pt from 'prop-types';
import { compose } from 'redux';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';
import { connect } from 'react-redux';
import { get as prop } from 'lodash';
import { Field, reduxForm } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RegisterForm.scss';
import Row from '../Row/Row';
import Col from '../Col/Col';
import PersonalRegisterModel from '../../model/Auth/PersonalRegisterModel';
import { RadioButton } from '../../components/RadioButton';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 15px 0 13px 0;
`;
const RadioSection = styled.div`
  width: 50%;
  ${props => (props.customStyle ? props.customStyle : '')};
`;
const PasswordCondition = styled.div`
  white-space: pre-wrap;
  font-size: 14px;
  color: #7e7e7e;
  margin-bottom: 17px;
  font-weight: 300;
`;
const TitleInput = styled.div`
  font-size: 16px;
  color: #535252;
  font-weight: 400;
  display: inline-block;
`;
const InputForm = styled.input`
  box-sizing: border-box;
  height: 48px;
  border: 1px solid #a5a5a5;
  background-color: #ffffff;
  &::placeholder {
    color: #b7b7b7;
  }
  ${props => (props.isError ? `border: 1px solid #ed1f1f` : '')}
`;
const LabelInputSection = styled.div`
  display: block;
  position: relative;
  margin-bottom: 3px;
  clear: both;
`;

const ErrorSection = styled.div`
  display: inline-block;
  float: right;
  position: absolute;
  right: 0;
  bottom: -2px;
  color: #ed1f1f;
  line-height: 1.3;
  font-size: 12px;
  margin-top: 5px;
`;
const RelativeEl = styled.div`
  position: relative;
`;
const EyeImage = styled.img`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
`;

const validate = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'register.form.required';
  }
  if (!values.lastName) {
    errors.lastName = 'register.form.required';
  }
  if (!values.email) {
    errors.email = 'register.form.required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'register.form.email_format';
  } else if (values.email.length < 5 && values.email.length > 30) {
    errors.email = 'register.form.email_length';
  }
  if (!values.password) {
    errors.password = 'register.form.required';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/.test(
      values.password,
    )
  ) {
    errors.password = 'register.form.password_format';
  }
  return errors;
};

@withLocales
class RegisterForm extends React.PureComponent {
  static propTypes = {
    onChange: pt.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.inputChanged = this.inputChanged.bind(this);
    this.props.initialize({ gender: 'male' });
  }

  state = {
    shouldShowPass: false,
  };

  renderField = ({
    input,
    label,
    type,
    placeholder,
    msgError,
    autoComplete,
    meta: { touched, error },
    renderIcon,
    ...rest
  }) => {
    return (
      <div>
        <LabelInputSection>
          <TitleInput>{label}</TitleInput>
          {touched && (error && <ErrorSection>{msgError(error)}</ErrorSection>)}
        </LabelInputSection>
        <RelativeEl>
          <InputForm
            {...input}
            placeholder={placeholder}
            type={type}
            autoComplete={autoComplete}
            isError={!!(touched && error)}
            {...rest}
          />
          {renderIcon ? renderIcon() : null}
        </RelativeEl>
      </div>
    );
  };

  togglePass(show) {
    this.setState({ shouldShowPass: !show });
  }

  inputChanged(e) {
    const {
      target: { name, checked, value, type },
    } = e;
    const val = type === 'checkbox' ? checked : value;

    this.props.onChange(
      new PersonalRegisterModel({ ...this.props.model, [name]: val }),
    );
  }

  render() {
    const { translate, model } = this.props;
    const { shouldShowPass } = this.state;
    return (
      <div className={s.formRegister}>
        <Row>
          <Col sm={12} md={12} lg={12} padding="0 28px 0 0">
            <div className={s.formGroup}>
              <Field
                name="firstName"
                type="text"
                component={this.renderField}
                label={translate('register.form.name')}
                placeholder={translate('register.form.enter_first_name')}
                autoComplete="off"
                msgError={translate}
                value={model.firstName}
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.EDIT,
                  'FirstName',
                  'RegisterForm',
                )}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} padding="0 28px 0 0">
            <div className={s.formGroup}>
              <Field
                name="lastName"
                type="text"
                component={this.renderField}
                label={translate('register.form.last_name')}
                placeholder={translate('register.form.enter_last_name')}
                autoComplete="off"
                msgError={translate}
                value={model.lastName}
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.EDIT,
                  'LastName',
                  'RegisterForm',
                )}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} padding="0 28px 0 0">
            <div className={s.formGroup}>
              <Field
                name="email"
                type="text"
                component={this.renderField}
                label={translate('register.form.email')}
                placeholder={translate('register.form.enter_email')}
                autoComplete="off"
                msgError={translate}
                value={model.email}
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.EDIT,
                  'Email',
                  'RegisterForm',
                )}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} padding="0 28px 0 0">
            <Content>
              <RadioSection customStyle="width: 40%;">
                <Field
                  name="gender"
                  type="radio"
                  component={RadioButton}
                  autoComplete="off"
                  msgError={translate}
                  value="male"
                  label={translate('register.form.male')}
                  checked={model.gender === 'male'}
                  id={generateElementId(
                    ELEMENT_TYPE.RADIO,
                    ELEMENT_ACTION.CHECK,
                    'MaleGender',
                    'RegisterForm',
                  )}
                />
              </RadioSection>
              <RadioSection customStyle="width: 60%;">
                <Field
                  name="gender"
                  type="radio"
                  component={RadioButton}
                  autoComplete="off"
                  msgError={translate}
                  value="female"
                  label={translate('register.form.female')}
                  id={generateElementId(
                    ELEMENT_TYPE.RADIO,
                    ELEMENT_ACTION.CHECK,
                    'FemaleGender',
                    'RegisterForm',
                  )}
                  checked={model.gender === 'female'}
                />
              </RadioSection>
            </Content>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} padding="0 28px 0 0">
            <div className={s.formGroup}>
              <Field
                name="password"
                type={shouldShowPass ? 'text' : 'password'}
                component={this.renderField}
                label={translate('register.form.password')}
                placeholder={translate('register.form.enter_password')}
                autoComplete="off"
                msgError={translate}
                value={model.password}
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.EDIT,
                  'Password',
                  'RegisterForm',
                )}
                renderIcon={() => (
                  <EyeImage
                    src={
                      this.state.shouldShowPass
                        ? '/icons/ios-eye.svg'
                        : '/icons/ion-eye-disabled.png'
                    }
                    title="Show Password"
                    onClick={() => this.togglePass(shouldShowPass)}
                  />
                )}
              />
            </div>
            <PasswordCondition>
              {translate('register.form.password_length')}
            </PasswordCondition>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formValues: prop(state, 'form.regisForm.values', {}),
});

export default compose(
  withStyles(s),
  connect(mapStateToProps),
  reduxForm({
    form: 'register',
    validate,
  }),
)(RegisterForm);
