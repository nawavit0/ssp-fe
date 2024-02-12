import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withLocales } from '@central-tech/core-ui';
import { reduxForm } from 'redux-form';
import { RegisterDesktop } from '../../../components/Register';
import styled from 'styled-components';
import s from './DesktopRegister.scss';
import Container from '../../../components/Container/Container';
import RegisterForm from '../../../components/RegisterForm/RegisterForm';
import PersonalRegisterModel from '../../../model/Auth/PersonalRegisterModel';
import Link from '../../../components/Link/Link';
import Checkbox from '../../../components/Checkbox/Checkbox';
import { register } from '../../../reducers/auth/actions';
import { CustomerType } from '../../../model/Auth/CustomerType';
import MiniLogin from '../../../components/MiniLogin/MiniLogin';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const CustomLink = styled(Link)`
  color: #4b8fe1 !important;
  text-decoration: underline !important;
  ${props => (props.display ? `display: ${props.display};` : '')}
`;
const RegisterSubmmit = styled.button`
  width: 100%;
  height: 43px;
  text-transform: uppercase;
  cursor: pointer;
  background-color: #13283f;
  border: none;
  font-weight: bold;
  color: #ffffff;
  font-size: 18px;
  line-height: 0;
  &:disabled {
    opacity: 1 !important;
  }
  &:hover {
    background-color: #13283f;
    transition: 0.3s;
  }

  ${props => (props.disabled ? 'opacity: 0.5;' : '')}
`;
const CheckboxCustom = styled(Checkbox)`
  display: inline-block;
  padding-top: 0 !important;
  margin-right: 16px;
`;
const CheckboxSection = styled.div`
  display: flex;
  color: #7e7e7e;
  font-size: 14px;
  margin-bottom: 23px;
  padding-left: 7px;
  font-weight: 300;
`;
const WarningText = styled.span`
  color: #ed1f1f;
`;
@withLocales
class DesktopRegister extends React.PureComponent {
  state = {
    personalModel: new PersonalRegisterModel(),
    subscribeToNewsLetter: false,
    toggleExclusive: true,
    termCondition: true,
    isSubmitRegister: false,
  };

  componentDidUpdate(prevProps) {
    const { auth } = this.props;
    const { auth: preAuth } = prevProps;
    if (
      preAuth.loadingRegister !== auth.loadingRegister &&
      !auth.loadingRegister
    ) {
      this.setState({ isSubmitRegister: false });
    }
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

  toggleNewLetterSubscription = () =>
    this.setState({ subscribeToNewsLetter: !this.state.subscribeToNewsLetter });

  errorObjectToTranslatedString(error) {
    const { translate } = this.props;

    let { parameters } = error;
    const { message } = error;
    if (!parameters) {
      parameters = {};
    }

    if (message.includes('same email')) {
      return (
        <WarningText>
          {translate('register.form.same_email_exists')}{' '}
          {/* <Link to="/forgot_password">{translate('request_new_password')}</Link> */}
        </WarningText>
      );
    }

    return message
      .replace('%value', parameters.value)
      .replace('%fieldName', translate(parameters.fieldName));
  }

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

  renderLoginForm = () => <MiniLogin isRegister />;
  renderRegisForm = () => {
    const { translate, handleSubmit, auth } = this.props;
    const {
      personalModel,
      termCondition,
      toggleExclusive,
      isSubmitRegister,
    } = this.state;
    return (
      <div>
        <form
          onSubmit={handleSubmit(e => this.handleSubmit(e))}
          id={generateElementId(
            ELEMENT_TYPE.FORM,
            ELEMENT_ACTION.FORM,
            '',
            'Register',
          )}
        >
          <RegisterForm
            model={personalModel}
            onChange={changed => this.setState({ personalModel: changed })}
          />
          <div className={s.formFooter}>
            <CheckboxSection
              onClick={() =>
                this.setState({ toggleExclusive: !this.state.toggleExclusive })
              }
            >
              <CheckboxCustom
                colors="blue"
                checked={toggleExclusive}
                id={generateElementId(
                  ELEMENT_TYPE.CHECKBOX,
                  ELEMENT_ACTION.CHECK,
                  'Exclusive',
                  'Register',
                )}
              />
              {translate('register.accept_receive_exclusive')}
            </CheckboxSection>
            <CheckboxSection
              onClick={() =>
                this.setState({ termCondition: !this.state.termCondition })
              }
            >
              <CheckboxCustom
                colors="blue"
                checked={termCondition}
                id={generateElementId(
                  ELEMENT_TYPE.CHECKBOX,
                  ELEMENT_ACTION.CHECK,
                  'TermsConditions',
                  'Register',
                )}
              />
              <span>
                {translate('register.accept_term_condition')}
                <CustomLink
                  to="#"
                  id={generateElementId(
                    ELEMENT_TYPE.LINK,
                    ELEMENT_ACTION.VIEW,
                    'TermsConditions',
                    'Register',
                  )}
                >
                  {translate('register.terms_conditions')}
                </CustomLink>
                {translate('register.and_text')}
                <CustomLink
                  to="#"
                  id={generateElementId(
                    ELEMENT_TYPE.LINK,
                    ELEMENT_ACTION.VIEW,
                    'PrivacyPolicy',
                    'Register',
                  )}
                  display="inline-block"
                >
                  {translate('register.privacy_policy')}
                </CustomLink>
                {translate('register.accept_term_condition_secound').indexOf(
                  'Wrong translation key',
                ) !== -1
                  ? ''
                  : translate('register.accept_term_condition_secound')}
              </span>
            </CheckboxSection>
            {this.renderAuthError()}
            <label>
              <RegisterSubmmit
                type="submit"
                disabled={auth.loadingRegister || !termCondition}
                id={generateElementId(
                  ELEMENT_TYPE.BUTTON,
                  ELEMENT_ACTION.SAVE,
                  'Form',
                  'Register',
                )}
                onClick={() => this.setState({ isSubmitRegister: true })}
              >
                {auth.loadingRegister && isSubmitRegister
                  ? translate('register.form.register_loading')
                  : translate('register.form.register_button_text')}
              </RegisterSubmmit>
            </label>
          </div>
        </form>
      </div>
    );
  };

  render() {
    const { translate } = this.props;
    return (
      <Container>
        <RegisterDesktop
          translate={translate}
          renderRegisForm={this.renderRegisForm}
          renderLoginForm={this.renderLoginForm}
        />
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
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'register',
  }),
)(DesktopRegister);
