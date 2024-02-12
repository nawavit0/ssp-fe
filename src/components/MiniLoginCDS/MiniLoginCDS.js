import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, untouch } from 'redux-form';
import cx from 'classnames';
import pt from 'prop-types';
import { isEmpty } from 'lodash';
import IosRefresh from 'react-ionicons/lib/IosRefresh';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import Link from '../Link';
import FacebookLogin from '../FacebookLogin';
import { login } from '../../reducers/auth/actions';
import t from './translation';
import s from './MiniLogin.scss'; // eslint-disable-line css-modules/no-unused-class

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'email_format';
  } else if (values.email.length < 5 && values.email.length > 30) {
    errors.email = 'email_length';
  }
  if (!values.password) {
    errors.password = 'required';
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
}) => {
  return (
    <div>
      <div className={s.labelTitle}>
        <div className={s.labelTitleLeft}>{label}</div>
        {touched && error && (
          <div className={cx(s.validateAlert, s.labelTitleRight)}>
            {msgError(error)}
          </div>
        )}
      </div>
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        className={touched && error ? s.validateInput : ''}
      />
    </div>
  );
};

@withLocales(t)
@withStyles(s)
class MiniLoginCDS extends React.PureComponent {
  static propTypes = {
    className: pt.string,
    loginActive: pt.bool,
    mergeCart: pt.bool,
  };

  static defaultProps = {
    loginActive: true,
    mergeCart: true,
  };

  state = {
    shouldShowPass: false,
    showIncorrect: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.loginActive !== prevProps.loginActive) {
      this.props.untouch('login', 'email');
      this.props.untouch('login', 'password');
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

  render() {
    const {
      translate,
      className,
      loginLoading,
      handleSubmit,
      loginFailed,
      isRegister,
      forgotLinkCentered,
      mergeCart,
    } = this.props;

    const { shouldShowPass, showIncorrect } = this.state;
    return (
      <div className={cx(s.container, className)}>
        <p className={s.title}>{translate('title')}</p>
        <form
          onSubmit={handleSubmit(this.formSubmit)}
          className={s.formLogin}
          noValidate
        >
          <div className={s.formGroup}>
            <Field
              name="email"
              type="email"
              component={renderField}
              label={translate('email')}
              placeholder={translate('placeholder_email')}
              autoComplete="off"
              msgError={translate}
            />
          </div>
          <div className={s.formGroup}>
            <Field
              name="password"
              type={shouldShowPass ? 'text' : 'password'}
              component={renderField}
              label={translate('password')}
              placeholder={translate('placeholder_password')}
              autoComplete="off"
              msgError={translate}
            />
            <img
              className={s.iconShow}
              src={
                this.state.shouldShowPass
                  ? '/icons/ios-eye.svg'
                  : '/icons/ion-eye-disabled.png'
              }
              title="Show Password"
              onClick={() => this.togglePass(shouldShowPass)}
            />
          </div>
          {loginFailed && showIncorrect && (
            <div className={s.formGroup}>
              <label className={s.validateAlert}>
                {translate('login_incorrect')}
              </label>
            </div>
          )}

          <div
            className={cx(
              s.formGroupLink,
              forgotLinkCentered ? s.textCenter : '',
            )}
          >
            <Link className={s.forgetLink} to="/user/forgot-password" native>
              {translate('forgot_password')}
            </Link>
          </div>
          <div className={s.formGroup}>
            <button className={s.button} type="submit" disabled={loginLoading}>
              {loginLoading ? (
                <IosRefresh
                  icon="ios-refresh"
                  fontSize="18px"
                  color="#ffffff"
                  rotate={loginLoading}
                />
              ) : (
                ''
              )}
              {loginLoading
                ? translate('login_loading')
                : translate('button_login')}
            </button>
          </div>
          <strong className={s.lineThrough}>{translate('label_or')}</strong>
          <div className={s.formGroup}>
            <FacebookLogin
              className={s.facebook}
              iconClass={s.icon}
              mergeCart={mergeCart}
            >
              {translate('button_facebook')}
            </FacebookLogin>
          </div>
          {!isRegister && (
            <div className={s.formGroup}>
              <label className={s.labelRegister}>
                {translate('label_register')}
                <Link className={s.linkRegister} to="/register" native>
                  {translate('register_now')}
                </Link>
              </label>
            </div>
          )}
        </form>
      </div>
    );
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

MiniLoginCDS = connect(mapStateToProps, mapDispatchToProps)(MiniLoginCDS);

export default reduxForm({
  form: 'login',
  validate,
  destroyOnUnmount: false,
})(MiniLoginCDS);
