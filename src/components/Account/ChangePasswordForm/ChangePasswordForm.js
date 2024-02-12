import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { Field, reduxForm, reset } from 'redux-form';
import s from './style.scss';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withLocales } from '@central-tech/core-ui';
import FieldInput from '../../Form/FieldInput';
import Row from '../../Row';
import Col from '../../Col';
import { changeCustomerPassword } from '../../../reducers/customer/actions';

const StyledCustom = createGlobalStyle`
  .change-password-form {
    input {
      font-size: ${props => (props.isMobile ? '12px' : '14px')} !important;
    }
    .input-label {
      p {
        font-size: ${props => (props.isMobile ? '12px' : '14px')} !important;
        font-weight: bold;
        color: #393939;
      }
      div {
        font-size: ${props => (props.isMobile ? '12px' : '14px')} !important;
      }
    }
  }
`;
const validate = values => {
  const errors = {};
  const requireData = ['currentPassword', 'newPassword', 'reNewPassword'];
  if (values.newPassword !== values.reNewPassword) {
    errors.reNewPassword = 'change_password.password_not_match';
  }
  requireData.map(data => {
    if (values[data] === '' || values[data] === null) {
      errors[data] = 'change_password.must_fill_field';
    }
  });
  return errors;
};

@withLocales()
@withStyles(s)
class ChangePasswordForm extends Component {
  componentDidMount() {
    this.initialData();
  }

  initialData = () => {
    this.props.initialize({
      currentPassword: '',
      newPassword: '',
      reNewPassword: '',
    });
  };

  render() {
    const { handleSubmit, isMobile, className, translate } = this.props;
    return (
      <div id="change-password-form" className={`${cx(s.root, className)}`}>
        <StyledCustom isMobile={isMobile} />
        <form onSubmit={handleSubmit} className="change-password-form">
          <Row gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={`${s.addressField} custom-label`}
                name="currentPassword"
                type="password"
                showPasswordEye={isMobile}
                component={FieldInput}
                label={translate('change_password.current_password')}
                autoComplete="off"
                msgError={translate}
              />
            </Col>
          </Row>
          <Row gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={`${s.addressField} custom-label`}
                name="newPassword"
                type="password"
                showPasswordEye={isMobile}
                component={FieldInput}
                label={translate('change_password.new_password')}
                autoComplete="off"
                msgError={translate}
              />
            </Col>
          </Row>
          <Row gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={`${s.addressField} custom-label`}
                name="reNewPassword"
                type="password"
                showPasswordEye={isMobile}
                component={FieldInput}
                label={translate('change_password.new_password_again')}
                autoComplete="off"
                msgError={translate}
              />
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

ChangePasswordForm = reduxForm({
  form: 'ChangePasswordForm',
  validate,
  onSubmit: async (state, dispatch) => {
    const isSuccess = await dispatch(
      changeCustomerPassword(state.currentPassword, state.newPassword),
    );
    if (isSuccess) {
      await dispatch(reset('ChangePasswordForm'));
    }
  },
})(ChangePasswordForm);

const mapStateToProps = state => ({
  customer: state.customer.customer,
});

export default connect(mapStateToProps)(ChangePasswordForm);
