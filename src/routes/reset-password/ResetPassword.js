import React from 'react';
import s from './ResetPassword.scss';
import t from './translation.json';
import { isEmpty, isUndefined } from 'lodash';
import withLocales from '../../utils/decorators/withLocales';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Container from '../../components/Container/Container';
import Row from '../../components/Row/Row';
import Col from '../../components/Col/Col';
import Link from '../../components/Link';
import queryString from 'query-string';
import { connect } from 'react-redux';
import FormInput from '../../components/FormInput/FormInput';
import { resetPassword } from '../../reducers/auth/actions';
// import { setPageType } from '../../reducers/googleTag/actions';
// import gtmType from '../../constants/gtmType';
import cx from 'classnames';

@withLocales(t)
@withStyles(s)
class ResetPassword extends React.PureComponent {
  state = {
    email: '',
    rpToken: '',
    model: {
      // new_password: '',
      // confirm_new_password: '',
    },
    isPasswordMatch: false,
    errorMessage: '',
    showNoticPass: false,
    // emailSend: false
  };

  isPasswordMatch = (p1, p2) => {
    return p1 === p2;
  };

  validatePassword = password => {
    this.setState({
      showNoticPass: false,
    });
    if (isEmpty(password)) {
      return this.props.translate('required');
    } else if (
      !isEmpty(password) &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/.test(password)
    ) {
      this.setState({
        showNoticPass: true,
      });
      return ''; //this.props.translate('notic_pass');
    }

    return '';
  };

  componentDidMount() {
    const search = queryString.parse(window.location.search);

    // this.props.setPageType(gtmType.OTHER);

    if (!isEmpty(search)) {
      this.setState({
        email: search.email,
        rpToken: search.rptoken,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.model !== this.state.model) {
      this.setState({
        isPasswordMatch: this.isPasswordMatch(
          this.state.model.new_password,
          this.state.model.confirm_new_password,
        ),
        errorMessage: this.validatePassword(this.state.model.new_password),
      });
    }
  }

  handleSubmit = () => {
    if (isEmpty(this.state.model.new_password)) {
      this.setState({
        errorMessage: this.validatePassword(this.state.model.new_password),
      });
      return;
    }

    if (!isEmpty(this.state.errorMessage) || !this.state.isPasswordMatch) {
      this.setState({
        errorMessage: this.validatePassword(this.state.model.new_password),
      });
      return;
    }

    const resetPasswordModel = {
      email: this.state.email,
      resetToken: this.state.rpToken,
      newPassword: this.state.model.new_password,
    };

    this.props.resetPassword(resetPasswordModel);
  };

  handleBackHome = () => {
    window.location.href = '/';
  };

  inputChanged = e => {
    const {
      target: { name, value },
    } = e;
    const val = value;

    this.setState({
      model: { ...this.state.model, [name]: val },
    });
  };

  render() {
    const {
      translate,
      resetPasswordSucceeded,
      resetPasswordErrorCause,
    } = this.props;
    const { model, isPasswordMatch, errorMessage } = this.state;

    return (
      <Container>
        {!resetPasswordSucceeded ? (
          <div className={s.resetPasswordForm}>
            <Row>
              <Col className={s.head}>
                <img
                  className={s.ic_password}
                  src="/icons/ic-password.png"
                  title={translate('title')}
                />
                <span className={s.title}>{translate('title')}</span>
                <span className={s.subTitle}>{translate('sub_title')}</span>
              </Col>
            </Row>
            <Row>
              <Col className={s.form}>
                <div className={s.row}>
                  <FormInput
                    label={translate('new_password')}
                    required
                    type="password"
                    name="new_password"
                    placeholder={translate('new_password_placeholder')}
                    value={model.new_password}
                    onChange={e => this.inputChanged(e)}
                  />
                  {errorMessage && (
                    <p className={s.errorMessage}>{errorMessage}</p>
                  )}
                </div>

                <div className={s.row}>
                  <FormInput
                    label={translate('confirm_new_password')}
                    required
                    type="password"
                    name="confirm_new_password"
                    placeholder={translate('confirm_new_password_placeholder')}
                    value={model.confirm_new_password}
                    onChange={e => this.inputChanged(e)}
                  />

                  {model.new_password !== '' &&
                  !isUndefined(model.confirm_new_password) &&
                  isPasswordMatch === false &&
                  (resetPasswordErrorCause || this.state.showNoticPass) ? (
                    <p className={s.errorMessage}>
                      {translate('password_not_matched')}
                    </p>
                  ) : (
                    <p />
                  )}
                </div>

                {this.state.showNoticPass && (
                  <p className={s.noticPassword}>{translate('notic_pass')} </p>
                )}

                {!isEmpty(resetPasswordErrorCause) && (
                  <p className={cx(s.noticPassword, s.alignCenter)}>
                    {translate('reset_pass_expired')}
                    <br />
                    {translate('reset_pass_text')}{' '}
                    <Link to="/user/forgot-password" className={s.forgotLink}>
                      {translate('reset_pass_link')}
                    </Link>
                  </p>
                )}

                <input
                  type="button"
                  value={translate('reset_submit_text')}
                  className={s.resetButton}
                  onClick={this.handleSubmit}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <div className={s.resetPasswordFormSuccess}>
            <Row>
              <Col className={s.head}>
                <img
                  className={s.icon}
                  src="/icons/ic-done.svg"
                  title={translate('title_success')}
                />
                <span className={s.title_success}>
                  {translate('title_success')}
                </span>
                <span className={s.subTitle_success}>
                  {translate('subTitle_success')}
                </span>
              </Col>
            </Row>

            <Row>
              <Col className={s.form}>
                <Link id="lnk-viewLogin" to="/register">
                  <button
                    className={s.btnBackToHome}
                    id="btn-viewLogin"
                    type="buttom"
                  >
                    {translate('go_to_login')}
                  </button>
                </Link>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  resetPasswordSucceeded: state.auth.resetPasswordSucceeded,
  resetPasswordErrorCause: state.auth.resetPasswordErrorCause,
});

const mapDispatchToProps = dispatch => ({
  resetPassword: data => dispatch(resetPassword(data)),
  // setPageType: pageType => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
