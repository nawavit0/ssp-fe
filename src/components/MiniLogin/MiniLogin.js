import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withLocales, withRoutes, Link } from '@central-tech/core-ui';
import { Field, reduxForm, untouch } from 'redux-form';
import pt from 'prop-types';
import { isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { login } from '../../reducers/auth/actions';
import Checkbox from '../../components/Checkbox/Checkbox';

import {
  ForgetPasswordLink,
  MiniLoginSection,
  RegisterLoginSection,
  CheckboxSection,
  TitleMiniLogin,
  TitleInput,
  InputForm,
  LabelInputSection,
  ErrorSection,
  // IconShowPassword,
  FormLogin,
  FormGroupLink,
  Require,
  CustomButton,
} from './MiniLoginStyled';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';
import { FacebookSection } from '../Register';

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'register.form.required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'register.form.email_format';
  } else if (values.email.length < 5 && values.email.length > 30) {
    errors.email = 'register.form.email_length';
  }
  if (!values.password) {
    errors.password = 'register.form.required';
  }
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  placeholder,
  msgError,
  autoComplete,
  meta: { touched, error },
  isRegister = false,
  isRequire,
  ...rest
}) => {
  if (isRegister) {
    return (
      <div>
        <LabelInputSection>
          <TitleInput>{label}</TitleInput>
          {isRequire && <Require> *</Require>}
          {touched && error && <ErrorSection>{msgError(error)}</ErrorSection>}
        </LabelInputSection>
        <InputForm
          {...input}
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
          isError={!!(touched && error)}
          {...rest}
        />
      </div>
    );
  }

  return (
    <div>
      <LabelInputSection margin={label === 'Email' ? '0' : '7px 0 0 0'}>
        <TitleInput fontSize={12} color="#373535" fontWeight={400}>
          {label}
          {isRequire && <Require> *</Require>}
        </TitleInput>
        {touched && error && <ErrorSection>{msgError(error)}</ErrorSection>}
      </LabelInputSection>
      <InputForm
        {...input}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        isError={!!(touched && error)}
        customStyle={`
          &::placeholder {
            font-weight: 300;
            color: #B7B7B7;
            font-size: 12px;
          }
        `}
        {...rest}
      />
    </div>
  );
};

@withRoutes
@withLocales
@withStyles()
class MiniLogin extends React.PureComponent {
  static propTypes = {
    className: pt.string,
    loginActive: pt.bool,
    mergeCart: pt.bool,
    isRegister: pt.bool,
  };

  static defaultProps = {
    loginActive: true,
    mergeCart: true,
    isRegister: false,
  };

  state = {
    shouldShowPass: false,
    showIncorrect: false,
    toggleRememberme: true,
    isSubmitLogin: false,
  };

  componentDidUpdate(prevProps) {
    const { loginLoading } = this.props;
    const { loginLoading: preLoding } = prevProps;

    if (this.props.loginActive !== prevProps.loginActive) {
      this.props.untouch('login', 'email');
      this.props.untouch('login', 'password');
    }
    if (loginLoading !== preLoding && !loginLoading) {
      this.setState({ isSubmitLogin: false });
    }
  }

  togglePass(show) {
    this.setState({ shouldShowPass: !show });
  }

  formSubmit = () => {
    const { login, loginForm, mergeCart } = this.props;

    if (!isEmpty(loginForm.values)) {
      login(loginForm.values, mergeCart);
      this.setState({
        showIncorrect: true,
      });
    }
  };
  onRenderSubmitForm = position => {
    const { translate, loginLoading, isRegister } = this.props;
    const { isSubmitLogin } = this.state;
    return (
      <Fragment>
        <div className="formGroup">
          <CustomButton
            type="submit"
            disabled={loginLoading}
            id={generateElementId(
              ELEMENT_TYPE.BUTTON,
              ELEMENT_ACTION.LOGIN,
              'Member',
              position,
            )}
            fontSize={isRegister ? '18' : '14'}
            width="100%"
            height={isRegister ? '46px' : '36px'}
            border="solid 1px #0b233d"
            margin="12px 0 0 0"
            onClick={() => this.setState({ isSubmitLogin: true })}
          >
            {loginLoading && isSubmitLogin
              ? translate('register.login_loading')
              : translate('register.button_login')}
          </CustomButton>
        </div>
        {!isRegister ? (
          <div className="formGroup">
            <p className={'notMemberText'}>
              {translate('register.label_register')}
            </p>
            <Link to="/register">
              <CustomButton
                type="button"
                fontSize={14}
                width="100%"
                height="36px"
                backgroundColor="#79E71C"
                margin="0"
                color="#06183D"
                id={generateElementId(
                  ELEMENT_TYPE.BUTTON,
                  ELEMENT_ACTION.VIEW,
                  'Register',
                  position,
                )}
              >
                {translate('register.now')}
              </CustomButton>
            </Link>
          </div>
        ) : null}
      </Fragment>
    );
  };

  onRenderForgotPassword = position => {
    const { translate, forgotLinkCentered, isRegister, lang } = this.props;
    const { toggleRememberme } = this.state;
    let checkboxSize = {};
    let checkboxContentStyle = '';

    if (!isRegister) {
      checkboxSize = { width: 18, height: 18 };
      checkboxContentStyle = `
        font-size: 12px; 
        margin-left: 5px;
        font-weight: 400;
        `;
    }

    return (
      <FormGroupLink
        className={`formGroupLink ${forgotLinkCentered && 'textCenter'}`}
        istextCenter={!!forgotLinkCentered}
      >
        <CheckboxSection
          onClick={() =>
            this.setState({ toggleRememberme: !this.state.toggleRememberme })
          }
        >
          <Checkbox
            colors="blue"
            checked={toggleRememberme}
            id={generateElementId(
              ELEMENT_TYPE.CHECKBOX,
              ELEMENT_ACTION.CHECK,
              'RememberMe',
              position,
            )}
            customContentStyle={checkboxContentStyle}
            content={translate('register.remember_me')}
            {...checkboxSize}
          />
        </CheckboxSection>
        <ForgetPasswordLink
          to={`/${lang}/user/forgot-password`}
          id={generateElementId(
            ELEMENT_TYPE.LINK,
            ELEMENT_ACTION.VIEW,
            'ForgotPassword',
            position,
          )}
          fontSize={isRegister ? 16 : undefined}
          color={'#535252'}
          native
        >
          {translate('register.forgot_password')}
        </ForgetPasswordLink>
      </FormGroupLink>
    );
  };

  onRenderLoginFailed = () => {
    const { translate, loginFailed } = this.props;
    const { showIncorrect } = this.state;
    return (
      <Fragment>
        {loginFailed && showIncorrect && (
          <div className="formGroup">
            <label className={'validateAlert'}>
              {translate('register.login_incorrect')}
            </label>
          </div>
        )}
      </Fragment>
    );
  };
  onRenderInputField = position => {
    const { translate, isRegister } = this.props;
    const { shouldShowPass } = this.state;
    return (
      <Fragment>
        <div className="formGroup">
          <Field
            name="email"
            type="email"
            component={renderField}
            label={translate('register.form.email')}
            placeholder={translate('register.form.enter_email')}
            autoComplete="off"
            msgError={translate}
            isRegister={isRegister}
            id={generateElementId(
              ELEMENT_TYPE.TEXT,
              ELEMENT_ACTION.EDIT,
              'Email',
              position,
            )}
            isRequire
          />
        </div>
        <div className="formGroup">
          <Field
            name="password"
            type={shouldShowPass ? 'text' : 'password'}
            component={renderField}
            label={translate('register.form.password')}
            placeholder={translate('register.form.enter_password')}
            autoComplete="off"
            msgError={translate}
            isRegister={isRegister}
            id={generateElementId(
              ELEMENT_TYPE.TEXT,
              ELEMENT_ACTION.EDIT,
              'Password',
              position,
            )}
            isRequire
          />
          {/* Icon toggle display Password */}
          {/* <IconShowPassword
            className='iconShow'
            src={
              this.state.shouldShowPass
                ? '/icons/ios-eye.svg'
                : '/icons/ion-eye-disabled.png'
            }
            title="Show Password"
            onClick={() => this.togglePass(shouldShowPass)}
            isRegister={isRegister}
          /> */}
        </div>
      </Fragment>
    );
  };

  renderRegisterFormLogin = () => {
    const { handleSubmit, ...rest } = this.props;
    const positionCons = 'Register';
    return (
      <RegisterLoginSection {...rest}>
        <FormLogin
          onSubmit={handleSubmit(this.formSubmit)}
          className={'formLogin'}
          id={generateElementId(
            ELEMENT_TYPE.FORM,
            ELEMENT_ACTION.FORM,
            'Login',
            'Register',
          )}
          isRegister
          noValidate
        >
          {this.onRenderInputField(positionCons)}
          {this.onRenderLoginFailed()}
          {this.onRenderForgotPassword(positionCons)}
          {this.onRenderSubmitForm(positionCons)}
        </FormLogin>
      </RegisterLoginSection>
    );
  };

  renderMiniFormLogin = () => {
    const { translate, handleSubmit, ...rest } = this.props;
    const positionCons = 'MiniLogin';
    return (
      <MiniLoginSection {...rest}>
        <TitleMiniLogin>
          {translate('register.mini_login.title')}
        </TitleMiniLogin>
        <FacebookSection
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.LOGIN,
            'Facebbook',
            'MiniLogin',
          )}
          customStyle={`
            font-size: 12px;
            height: 35px;
            line-height: 35px;
            font-weight: normal;
          `}
          customBreakSection={`
            font-size: 12px;
            margin: 15px 0 0 0;
          `}
        />
        <FormLogin
          onSubmit={handleSubmit(this.formSubmit)}
          className="formLogin"
          id={generateElementId(
            ELEMENT_TYPE.FORM,
            ELEMENT_ACTION.FORM,
            'Login',
            'MiniLogin',
          )}
          customStyle={`
            margin: 0;
            .formGroup {
              margin: 0;
            }
          `}
          noValidate
        >
          {this.onRenderInputField(positionCons)}
          {this.onRenderLoginFailed()}
          {this.onRenderForgotPassword(positionCons)}
          {this.onRenderSubmitForm(positionCons)}
        </FormLogin>
      </MiniLoginSection>
    );
  };
  render() {
    const { isRegister } = this.props;
    if (isRegister) {
      return this.renderRegisterFormLogin();
    }
    return this.renderMiniFormLogin();
  }
}

const mapStateToProps = state => ({
  loginLoading: state.auth.loading,
  loginForm: state.form.login,
  loginFailed: state.auth.loginFailed,
});

const mapDispatchToProps = dispatch => ({
  login: (customer, merge) => dispatch(login(customer, '', merge)),
  untouch: (form, field) => dispatch(untouch(form, field)),
});

MiniLogin = connect(mapStateToProps, mapDispatchToProps)(MiniLogin);

export default reduxForm({
  form: 'login',
  validate,
  destroyOnUnmount: false,
})(MiniLogin);
