import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { Field, reduxForm } from 'redux-form';
import { setCookie, getCookie } from '../../../utils/cookie';
import { normalizePhone } from '../../../utils/inputFormat';
import Row from '../../Row';
import Col from '../../Col';
import s from './style.scss';
import t from './translation.json';

export const formName = 'guestInfoForm';

const validate = values => {
  const requiredData = [
    'firstname',
    'lastname',
    'telephone',
    'email',
    'the1no',
  ];
  const errors = requiredData.reduce((e, data) => {
    if (!values[data] && data !== 'the1no') {
      e[data] = 'required';
    } else if (
      data === 'email' &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[data])
    ) {
      e[data] = 'email_format';
    } else if (data === 'telephone' && isNaN(Number(values[data]))) {
      e[data] = 'phone_format';
    } else if (values[data] && data === 'the1no') {
      if (
        isNaN(Number(values[data])) ||
        (values[data].length !== 10 && values[data].length !== 16) ||
        !/^[1-9][0-9]+$/.test(values[data])
      ) {
        e[data] = 'text_error_t1c';
      }
    }
    return e;
  }, {});
  return errors;
};

const renderField = ({
  input,
  label,
  type,
  placeholder,
  msgError,
  autoComplete,
  maxLength,
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
        maxLength={maxLength}
      />
    </div>
  );
};

@withStyles(s)
@withLocales(t)
@reduxForm({
  form: formName,
  validate,
})
class CustomerInfoForm extends React.PureComponent {
  static propTypes = {
    className: pt.string,
    disabled: pt.bool,
    shippingAddress: pt.object,
  };

  componentDidMount() {
    this.handleInitialForm();
  }

  componentDidUpdate(prevProps) {
    if (this.props.shippingAddress !== prevProps.shippingAddress) {
      this.handleInitialForm();
    }
  }

  handleInitialForm() {
    const { shippingAddress, initialize } = this.props;
    const isAddressValid =
      shippingAddress &&
      shippingAddress.firstname &&
      shippingAddress.lastname &&
      shippingAddress.telephone &&
      shippingAddress.email;
    const t1pCardNumber = getCookie('earn_no');
    if (isAddressValid) {
      initialize({
        firstname: shippingAddress.firstname,
        lastname: shippingAddress.lastname,
        telephone: shippingAddress.telephone,
        email: shippingAddress.email,
        the1no: t1pCardNumber,
      });
    }
  }

  handleChangeT1 = e => {
    setCookie('earn_no', e.target.value);
  };

  render() {
    const { className, disabled, handleSubmit, translate } = this.props;

    return (
      <div className={cx(s.root, className)}>
        <form onSubmit={handleSubmit}>
          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="firstname"
                type="text"
                component={renderField}
                label={translate('firstname')}
                placeholder={translate('firstname')}
                autoComplete="off"
                maxLength={100}
                disabled={disabled}
                msgError={translate}
              />
            </Col>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="lastname"
                type="text"
                component={renderField}
                label={translate('lastname')}
                placeholder={translate('lastname')}
                autoComplete="off"
                maxLength={100}
                disabled={disabled}
                msgError={translate}
              />
            </Col>
          </Row>

          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="email"
                type="text"
                component={renderField}
                label={translate('email')}
                placeholder={translate('enterEmail')}
                autoComplete="off"
                maxLength={100}
                disabled={disabled}
                msgError={translate}
              />
            </Col>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="telephone"
                type="text"
                component={renderField}
                label={translate('phone')}
                placeholder={translate('enterPhone')}
                autoComplete="off"
                maxLength={10}
                disabled={disabled}
                msgError={translate}
                msgErrorPosition="top-right"
                normalize={normalizePhone}
              />
            </Col>
          </Row>
          <Row className={s.addressGroup} gutter={15}>
            <Col lg={6} sm={12}>
              <Field
                className={s.addressField}
                name="the1no"
                type="text"
                component={renderField}
                label={translate('t1cNumber')}
                placeholder={translate('enterT1C')}
                onChange={this.handleChangeT1}
                autoComplete="off"
                maxLength={16}
                disabled={disabled}
                msgError={translate}
              />
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

export default CustomerInfoForm;
