import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { map } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import cx from 'classnames';
import FieldInput from '../../Form/FieldInput';
import Row from '../../Row';
import Col from '../../Col';
import s from './GuestRegisterForm.scss';
import t from './translation.json';
import { register } from '../../../reducers/auth/actions';
import CheckBoxV2 from '../../CheckBoxV2/CheckBoxV2';

const validate = values => {
  const errors = {};
  const requireData = ['firstname', 'lastname', 'email', 'password'];

  map(requireData, data => {
    if (values[data] === '' || values[data] === null) {
      errors[data] = 'required';
    } else if (
      data === 'email' &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[data])
    ) {
      errors[data] = 'email_format';
    }
  });

  if (!values['agree']) {
    errors.agree = 'agree';
  }

  return errors;
};

@withLocales(t)
@withStyles(s)
class GuestRegisterForm extends Component {
  state = {
    shouldShowPass: false,
  };

  componentDidMount() {
    this.initialData();
  }

  togglePass = () => {
    this.setState({
      shouldShowPass: !this.state.shouldShowPass,
    });
  };

  initialData = () => {
    const { firstname, lastname, email, initialize } = this.props;

    initialize({
      firstName: firstname,
      lastName: lastname,
      email: email,
      is_subscript: true,
      agree: true,
      password: null,
    });
  };

  render() {
    const { handleSubmit, className, translate } = this.props;

    return (
      <div id="address-form" className={cx(s.root, className)}>
        <form onSubmit={handleSubmit}>
          <Row gutter={15}>
            <Col lg={5} sm={12}>
              <Field
                className={s.input}
                name="email"
                type="text"
                component={FieldInput}
                label="Email"
                placeholder="Enter email"
                autoComplete="off"
                msgError={translate}
              />
            </Col>
            <Col lg={5} sm={12}>
              <div className={s.passwordMaskup}>
                <Field
                  className={s.input}
                  name="password"
                  type={this.state.shouldShowPass ? 'text' : 'password'}
                  component={FieldInput}
                  label="Password"
                  placeholder="Enter password"
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
                  onClick={() => this.togglePass()}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Field
                className={s.checkbox}
                name="is_subscript"
                type="checkbox"
                component={CheckBoxV2}
                label="Subscribe to Supersports.co.th newsletters"
                autoComplete="off"
                msgError={translate}
                customIconStyle={`margin: 0;`}
                customCheckboxStyle={`align-items: center;`}
                customLabelStyles={`font-weight: normal;`}
              />
            </Col>
            <Col lg={12}>
              <Field
                className={s.checkbox}
                name="agree"
                type="checkbox"
                component={CheckBoxV2}
                label="I agree to Supersports.co.th Terms of Service and Privacy Policy"
                autoComplete="off"
                msgError={translate}
                customIconStyle={`margin: 0;`}
                customCheckboxStyle={`align-items: center;`}
                customLabelStyles={`font-weight: normal;`}
              />
            </Col>
          </Row>
          <div className={s.hiddenField}>
            <Field
              name="firstname"
              type="hidden"
              component={FieldInput}
              autoComplete="off"
              msgError={translate}
            />
            <Field
              name="lastname"
              type="hidden"
              component={FieldInput}
              autoComplete="off"
              msgError={translate}
            />
          </div>
        </form>
      </div>
    );
  }
}

GuestRegisterForm = reduxForm({
  form: 'guestRegisterForm',
  validate,
  onSubmit: async (state, dispatch) =>
    await dispatch(register('personal', state, state.is_subscript)),
})(GuestRegisterForm);

const mapStateToProps = state => ({
  guestRegisterForm: state.form.guestRegisterForm,
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field, value) =>
    dispatch(change('guestRegisterForm', field, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GuestRegisterForm);
