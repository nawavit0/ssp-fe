import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import IosRefresh from 'react-ionicons/lib/IosRefresh';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import s from './Register.scss';
import t from './translation.json';
import cx from 'classnames';
import Container from '../../components/Container';
import Row from '../../components/Row';
import Col from '../../components/Col';
import RegisterForm from '../../components/RegisterForm';
import PersonalRegisterModel from '../../model/Auth/PersonalRegisterModel';
import Link from '../../components/Link';
import Checkbox from '../../components/Checkbox';
import { register } from '../../reducers/auth/actions';
import { CustomerType } from '../../model/Auth/CustomerType';
import MiniLogin from '../../components/MiniLogin';
import FacebookLogin from '../../components/FacebookLogin';
import Button from '../../components/Button/Button';
// import { setPageType } from '../../reducers/googleTag/actions';
// import gtmType from '../../constants/gtmType';

class Register extends React.PureComponent {
  state = {
    personalModel: new PersonalRegisterModel(),
    subscribeToNewsLetter: true,
    isHidden: false,
  };

  componentDidMount() {
    // this.props.setPageType(gtmType.REGISTER);
  }

  handleSubmit() {
    const { personalModel, subscribeToNewsLetter } = this.state;

    personalModel.custom_attributes = [];
    personalModel.custom_attributes.push({
      attribute_code: 'language',
      name: 'language',
      value: this.props.locale.langCode,
    });

    this.props.register(
      CustomerType.PERSONAL,
      personalModel,
      subscribeToNewsLetter,
    );
  }

  toggleNewLetterSubscription = () => {
    this.setState({
      subscribeToNewsLetter: !this.state.subscribeToNewsLetter,
    });
  };

  errorObjectToTranslatedString(error) {
    const { translate } = this.props;

    let { parameters } = error;
    const { message } = error;
    if (!parameters) {
      parameters = {};
    }

    if (message.includes('same email')) {
      return (
        <Fragment>
          {translate('same_email_exists')}{' '}
          {/* <Link to="/forgot_password">{translate('request_new_password')}</Link> */}
        </Fragment>
      );
    }

    return message
      .replace('%value', parameters.value)
      .replace('%fieldName', translate(parameters.fieldName));
  }

  handleShowFormClick = () => {
    this.setState({
      isHidden: true,
    });
  };

  renderAuthError() {
    const { auth } = this.props;
    const error = auth.registrationErrorCause;

    return (
      <Fragment>
        {error && error.message && (
          <div className={s.errorContainer}>
            <span>{this.errorObjectToTranslatedString(error)}</span>
            {error.errors && (
              <ul>
                {error.errors.map(x => (
                  <li>{this.errorObjectToTranslatedString(x)}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Fragment>
    );
  }

  renderfirstColumnBlock() {
    const { translate, handleSubmit, auth } = this.props;
    const { personalModel } = this.state;

    return (
      <div>
        <div className={s.promoSection}>
          {translate('promo_registration_text')}
        </div>
        <form onSubmit={handleSubmit(e => this.handleSubmit(e))}>
          <RegisterForm
            model={personalModel}
            onChange={changed => this.setState({ personalModel: changed })}
          />
          <div className={s.formFooter}>
            <div
              className={s.subscriptionCheckboxWrapper}
              onClick={this.toggleNewLetterSubscription}
            >
              <Checkbox
                className={s.chkSubscribe}
                colors="blue"
                checked={this.state.subscribeToNewsLetter}
              />
              <div className={s.checkboxText}>
                {translate('accept_receive_promotions')}
              </div>
            </div>
            {this.renderAuthError()}
            <label>
              <br />
              <button
                className={s.registerButton}
                type="submit"
                disabled={auth.loadingRegister}
              >
                {auth.loadingRegister ? (
                  <IosRefresh
                    icon="ios-refresh"
                    fontSize="18px"
                    color="#ffffff"
                    rotate={auth.loadingRegister}
                  />
                ) : (
                  ''
                )}
                {auth.loadingRegister
                  ? translate('register_loading')
                  : translate('register_button_text')}
              </button>
            </label>
            <p className={s.terms}>
              {translate('agree_with_terms_conditions')}
              <Link to="#">{translate('terms_conditions_link')}</Link>
              <span>{translate('and')}</span>
              <Link to="#">{translate('privacy_policy_link')}</Link>
            </p>
          </div>
        </form>
      </div>
    );
  }

  rendersecondColumnBlock() {
    const { translate } = this.props;
    const { isHidden } = this.state;
    return (
      <Fragment>
        <div className={s.facebookLogin}>
          <div className={cx(s.subTitle, s.divider)}>
            <span>{translate('registered_customer_login')}</span>
          </div>
          <MiniLogin
            className={cx(s.miniLogin, isHidden ? s.showForm : '')}
            isRegister
            forgotLinkCentered
          />
          <div className={cx(s.mobileOnly, isHidden ? s.hidden : '')}>
            <Button
              className={s.loginButton}
              text={translate('login')}
              onClick={this.handleShowFormClick}
            />
            <strong className={s.lineThrough}>{translate('or')}</strong>
            <FacebookLogin className={s.facebookButton} iconClass={s.icon} />
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const { translate } = this.props;
    return (
      <Container>
        <h1 className={s.title}>{translate('title')}</h1>
        <Row className={s.registerWrapping}>
          <Col
            sm={12}
            lg={6}
            padding={'0 28px 0 0'}
            wrapperClassName={s.col}
            className={s.colFirst}
          >
            <p className={cx(s.subTitle, s.divider)}>
              <span>{translate('subtitle')}</span>
            </p>
            {this.renderfirstColumnBlock()}
          </Col>
          <Col sm={12} lg={6} wrapperClassName={s.col} className={s.colSecond}>
            {this.rendersecondColumnBlock()}
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  customer: state.customer.customer,
  locale: state.locale,
});

const mapDispatchToProps = dispatch => ({
  register: (type, customer, subscribe) =>
    dispatch(register(type, customer, subscribe)),
  // setPageType: pageType => dispatch(setPageType(pageType)),
});

export default compose(
  withStyles(s),
  withLocales(t),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  reduxForm({
    form: 'register',
  }),
)(Register);
