import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withLocales, Link } from '@central-tech/core-ui';
import s from './ForgotPassword.scss';
import Container from '../../components/Container';
import Row from '../../components/Row';
import Col from '../../components/Col';
import {
  forgotPassword,
  forgotPasswordStart,
} from '../../reducers/auth/actions';

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'forgot_password.email_required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'forgot_password.email_format';
  }
  return errors;
};

const renderField = ({
  input,
  type,
  value,
  placeholder,
  msgError,
  forgotPasswordSent,
  id,
  meta: { touched, error },
}) => {
  let className = '';
  if (touched && error && s.validateInput) {
    className = touched && error && s.validateInput;
  }
  return (
    <div className={s.boxValidateAlert}>
      {touched && error ? (
        <div className={s.validateAlert}>{msgError(error)}</div>
      ) : forgotPasswordSent === false ? (
        <div className={s.validateAlert}>
          {msgError('forgot_password.forgot_incorrect')}
        </div>
      ) : (
        <div className={s.lineError} />
      )}
      <div className={s.inputContainer}>
        <input
          {...input}
          value={value}
          placeholder={placeholder}
          type={type}
          id={id}
          className={className}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

@withLocales
@withStyles(s)
class ForgotPassword extends React.PureComponent {
  state = {
    emailSend: false,
  };

  componentDidMount() {
    // this.props.setPageType(gtmType.OTHER);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.forgotPasswordSent &&
      this.props.forgotPasswordSent !== prevProps.forgotPasswordSent
    ) {
      if (this.props.forgotPasswordSent) {
        this.setState({
          emailSend: true,
        });
      }
    }
  }
  formSubmit = () => {
    const { forgotPassword, forgotForm } = this.props;
    if (!isEmpty(forgotForm.values)) {
      forgotPassword(forgotForm.values.email);
    }
  };

  render() {
    const { translate, forgotPasswordSent, handleSubmit } = this.props;
    const { emailSend } = this.state;

    return (
      <Container className={s.forgotPassword}>
        <Row>
          <Col md={12} lg={12}>
            {!emailSend ? (
              <div>
                <img
                  src="/static/icons/NeedHelp-01.svg"
                  className={s.logo}
                  title={translate('forgot_password.title')}
                />
                <h1 className={s.titleEnterEmail}>
                  {translate('forgot_password.title')}
                </h1>
                <p className={s.subtitleEnterEmail}>
                  {translate('forgot_password.subTitle')}
                </p>
                <form onSubmit={handleSubmit(this.formSubmit)}>
                  <div className={s.formGroupDesktop}>
                    <div className={s.formInput}>
                      <p className={s.emailLabel}>
                        Email <span className={s.mandatoryFieldSymbol}>*</span>
                      </p>
                      <div className={s.formInputEmailApplyNow}>
                        <Field
                          name="email"
                          type="email"
                          component={renderField}
                          label={translate('forgot_password.email')}
                          id="txt-formForgotPassword-email"
                          autoComplete="off"
                          forgotPasswordSent={forgotPasswordSent}
                          msgError={translate}
                          className={s.formInputEmail}
                          placeholder={translate(
                            'forgot_password.enterYourEmail',
                          )}
                        />
                        <div className={s.lineRegister}>
                          <div className={s.lineRegisterDesktop}>
                            {`${translate('forgot_password.no_member')}  `}
                            <Link
                              id="lnk-viewRegister"
                              to="/register"
                              className={s.registerNowLink}
                            >
                              {translate('forgot_password.register')}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <button id="btn-forgotPassword" className={s.btnInput}>
                        {translate('forgot_password.submit')}
                      </button>
                    </div>
                  </div>
                  <div className={s.formGroupMobile}>
                    <div className={s.formInput}>
                      <p className={s.emailLabel}>
                        {`${translate('forgot_password.email')} `}
                        <span className={s.mandatoryFieldSymbol}>*</span>
                      </p>
                      <Field
                        name="email"
                        type="email"
                        component={renderField}
                        label={translate('forgot_password.email')}
                        id="txt-formForgotPassword-email"
                        autoComplete="off"
                        forgotPasswordSent={forgotPasswordSent}
                        msgError={translate}
                        className={s.formInputEmail}
                        placeholder={translate(
                          'forgot_password.enterYourEmail',
                        )}
                      />
                      <button id="btn-forgotPassword" className={s.btnInput}>
                        {translate('forgot_password.submit')}
                      </button>
                      <div className={s.lineRegister}>
                        <div className={s.lineRegisterTablet}>
                          <div className={s.registerNowButtonLabel}>
                            {`${translate('forgot_password.no_member')}`}
                          </div>
                          <Link to="/register">
                            <button
                              id="btn-forgotPassword"
                              type="button"
                              className={s.registerNowButton}
                            >
                              {translate('forgot_password.register')}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <img
                  src="/static/icons/NeedHelp-01.svg"
                  className={s.logo}
                  title={translate('forgot_password.title')}
                />
                <h1 className={s.titleSentSuccess}>
                  {translate('forgot_password.title_success')}
                </h1>
                <p className={s.subtitleSentSuccess}>
                  {translate('forgot_password.subTitle_success')}
                </p>
                <p className={s.lineRegister}>
                  {`${translate('forgot_password.notreceiveTitle_success')}  `}
                  <Link
                    id="lnk-viewForgotPassword"
                    className={s.resend}
                    onClick={() => this.formSubmit()}
                  >
                    {translate('forgot_password.resendTitle_success')}
                  </Link>
                </p>
                <div>
                  <Link id="lnk-viewLogin" to="/login">
                    <button
                      className={s.btnBackToHome}
                      id="btn-viewLogin"
                      type="button"
                    >
                      {translate('forgot_password.back_to_login')}
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  forgotPasswordSent: state.auth.forgotPasswordSent,
  forgotForm: state.form.forgot_password,
});

const mapDispatchToProps = dispatch => ({
  forgotPassword: email => dispatch(forgotPassword(email)),
  forgotPasswordStart: () => dispatch(forgotPasswordStart()),
});

ForgotPassword = connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

export default reduxForm({
  form: 'forgot_password',
  validate,
  destroyOnUnmount: false,
})(ForgotPassword);
