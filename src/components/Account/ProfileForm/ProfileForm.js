import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form';
import { map, isEmpty } from 'lodash';
import FieldInput from '../../Form/FieldInput';
import ProfileModel from '../../../model/Address/Profile';
import Row from '../../Row';
import Col from '../../Col';
import { explode } from '../../../utils/customAttributes';
import { updateProfile } from '../../../reducers/account/actions';
import { withLocales } from '@central-tech/core-ui';
import { transformDate } from '../../../utils/date';
import CheckBoxV2 from '../../../components/CheckBoxV2/CheckBoxV2';
import RadioButtonV2 from '../../../components/RadioButtonV2/RadioButtonV2';

const FormStyled = styled.form`
  input {
    font-size: ${props => (props.isMobile ? '12px' : '14px')} !important;
    ::placeholder {
      color: #afafaf;
    }
  }
  .input-label {
    p {
      font-size: ${props => (props.isMobile ? '11px' : '14px')} !important;
      font-weight: bold;
      color: #333232 !important;
    }
    div {
      font-size: ${props => (props.isMobile ? '11px' : '14px')} !important;
    }
  }
  input.input-box {
    font-size: ${props => (props.isMobile ? '13px' : '15px')} !important;
    color: #101010;
    font-weight: bold;
  }
  .input-radio {
    display: block;
    width: 10px;
    height: 10px;
  }
  .input-ratio-label {
    font-size: ${props => (props.isMobile ? '13px' : '14px')} !important;
    font-weight: bold;
    color: #333232 !important;
  }
  .input-checkbox-label {
    font-size: ${props => (props.isMobile ? '13px' : '14px')} !important;
    color: #3e3e3e !important;
  }
`;
const FieldTitleStyled = styled.h3`
  font-size: ${props => (props.isMobile ? '13px' : '14px')};
  font-weight: bold;
  color: #333232;
  margin-bottom: 15px;
`;
const LanguageTitleStyled = styled(FieldTitleStyled)`
  margin-top: ${props => (props.isMobile ? '20px' : '0')};
`;
const SubscriptionTitleStyled = styled(FieldTitleStyled)`
  margin-top: 20px;
  font-size: ${props => (props.isMobile ? '13px' : '14px')};
`;
const FieldStyled = styled(Field)`
  margin-bottom: 20px !important;
`;
const validate = values => {
  const errors = {};
  const requireData = ['firstname', 'lastname', 'email', 'phone', 'dob'];
  map(requireData, data => {
    if (isEmpty(values[data]) && values[data] !== 'phone') {
      errors[data] = 'profile_form.required';
    } else if (data === 'phone') {
      if (isNaN(Number(values[data]))) {
        errors[data] = 'profile_form.number_format';
      } else if (values[data].length < 9 || values[data].length > 10) {
        errors[data] = 'profile_form.phone_number_format';
      } else if (values[data].length > 0) {
        if (values[data].substring(0, 1) !== '0') {
          errors[data] = 'profile_form.number_format';
        }
      }
    } else if (data === 'dob') {
      const isValid = values[data].match(
        /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
      );
      if (!isValid) {
        errors[data] = 'profile_form.birthday_format';
      }
    }
  });
  return errors;
};

@withLocales()
class ProfileForm extends Component {
  state = {
    gender: '1',
    language: 'en',
    subscribe: true,
  };
  componentDidMount() {
    this.initialData();
    this.initialState();
  }
  initialData = () => {
    const { customer } = this.props;
    customer.dob = transformDate(customer.dob, '-', '/');
    const explodeAddress = explode(customer);
    const initialData = new ProfileModel(explodeAddress);
    this.props.initialize({
      ...initialData,
      subscribe: explodeAddress.extension_attributes.is_subscribed,
      dob: explodeAddress.dob,
      customer_id: customer.id,
      phone: customer?.custom_attributes?.phone || '',
    });
  };
  initialState() {
    const language =
      this.props?.customer?.custom_attributes?.language || this.state.language;
    const gender = this.props?.customer?.gender || this.state.gender;
    const subscribe =
      this.props?.customer?.extension_attributes?.is_subscribed || false;
    this.props.change('subscribe', subscribe);
    this.props.change('language', language);
    this.props.change('gender', gender);
    this.setState({
      subscribe,
      gender,
      language,
    });
  }
  render() {
    const {
      handleSubmit,
      isMobile,
      className,
      customer,
      translate,
    } = this.props;
    return (
      <div id="profile-form" className={className}>
        <FormStyled onSubmit={handleSubmit} isMobile={isMobile}>
          <Row gutter={15}>
            <Col lg={6} sm={12}>
              <FieldStyled
                name="firstname"
                type="text"
                component={FieldInput}
                label={translate('profile_form.firstname')}
                placeholder={translate('profile_form.firstname_placholder')}
                autoComplete="off"
                maxLength={80}
                value={customer.firstname}
                msgError={translate}
              />
            </Col>
            <Col lg={6} sm={12}>
              <FieldStyled
                name="lastname"
                type="text"
                component={FieldInput}
                label={translate('profile_form.lastname')}
                placeholder={translate('profile_form.lastname_placholder')}
                autoComplete="off"
                maxLength={100}
                value={customer.firstname}
                msgError={translate}
              />
            </Col>
          </Row>
          <Row gutter={15}>
            <Col lg={6} sm={12}>
              <FieldStyled
                name="email"
                type="text"
                component={FieldInput}
                label={translate('profile_form.email')}
                placeholder={translate('profile_form.email_placholder')}
                autoComplete="off"
                maxLength={10}
                msgError={translate}
                disabled
              />
            </Col>
            <Col lg={6} sm={12}>
              <FieldStyled
                name="phone"
                type="text"
                component={FieldInput}
                label={translate('profile_form.phone')}
                placeholder={translate('profile_form.phone_placholder')}
                autoComplete="off"
                maxLength={10}
                msgError={translate}
              />
            </Col>
          </Row>
          <Row gutter={15}>
            <Col lg={6} sm={12}>
              <FieldStyled
                name="dob"
                type="text"
                component={FieldInput}
                label={translate('profile_form.birthday')}
                placeholder={translate('profile_form.birthday_placholder')}
                autoComplete="off"
                maxLength={200}
                msgError={translate}
              />
            </Col>
            <Col lg={6} sm={12}>
              <Row gutter={15}>
                <Col lg={12} sm={12}>
                  <FieldTitleStyled isMobile={isMobile}>
                    {translate('profile_form.gender')}
                  </FieldTitleStyled>
                </Col>
                <Col lg={5} sm={5}>
                  <Field
                    name="gender"
                    type="radio"
                    component={RadioButtonV2}
                    label={translate('profile_form.male')}
                    value="1"
                    checked={this.state.gender === '1'}
                    onClick={() => {
                      const newGender = '1';
                      this.props.change('gender', newGender);
                      this.setState({ gender: newGender });
                    }}
                    msgError={translate}
                    isMobile={isMobile}
                  />
                </Col>
                <Col lg={5} sm={5}>
                  <Field
                    name="gender"
                    type="radio"
                    component={RadioButtonV2}
                    label={translate('profile_form.female')}
                    value="2"
                    checked={this.state.gender === '2'}
                    onClick={() => {
                      const newGender = '2';
                      this.props.change('gender', newGender);
                      this.setState({ gender: newGender });
                    }}
                    msgError={translate}
                    isMobile={isMobile}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={15}>
            <Col lg={12} sm={12}>
              <LanguageTitleStyled isMobile={isMobile}>
                {translate('profile_form.language_txt')}
              </LanguageTitleStyled>
            </Col>
            <Col lg={3} sm={6}>
              <Field
                name="language"
                type="radio"
                component={RadioButtonV2}
                autoComplete="off"
                label={translate('profile_form.english')}
                checked={this.state.language === 'en'}
                value="en"
                onClick={() => {
                  const newLanguage = 'en';
                  this.props.change('language', newLanguage);
                  this.setState({ language: newLanguage });
                }}
                msgError={translate}
                isMobile={isMobile}
              />
            </Col>
            <Col lg={3} sm={6}>
              <Field
                name="language"
                type="radio"
                component={RadioButtonV2}
                autoComplete="off"
                label={translate('profile_form.thai')}
                checked={this.state.language === 'th'}
                value="th"
                onClick={() => {
                  const newLanguage = 'th';
                  this.props.change('language', newLanguage);
                  this.setState({ language: newLanguage });
                }}
                msgError={translate}
                isMobile={isMobile}
              />
            </Col>
          </Row>
          <Row gutter={15}>
            <Col lg={12} sm={12}>
              <SubscriptionTitleStyled isMobile={isMobile}>
                {translate('profile_form.subscrib_txt')}
              </SubscriptionTitleStyled>
              <Field
                name="subscribe"
                type="checkbox"
                component={CheckBoxV2}
                label={translate('profile_form.subscrib')}
                checked={this.state.subscribe}
                onClick={() => {
                  const newSubscribe = !this.state.subscribe;
                  this.props.change('subscribe', newSubscribe);
                  this.setState({ subscribe: newSubscribe });
                }}
                msgError={translate}
                isMobile={isMobile}
              />
            </Col>
          </Row>
        </FormStyled>
      </div>
    );
  }
}

ProfileForm = reduxForm({
  form: 'profileForm',
  validate,
  onSubmit: async (state, dispatch) => {
    const params = { is_subscribed: state.subscribe, ...state };
    params.dob = transformDate(params.dob, '/', '-');
    await dispatch(updateProfile(params));
  },
})(ProfileForm);

const mapStateToProps = state => {
  return {
    customer: state.customer.customer,
  };
};

export default connect(mapStateToProps)(ProfileForm);
