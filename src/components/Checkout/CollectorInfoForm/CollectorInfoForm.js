import React, { PureComponent } from 'react';
import pt from 'prop-types';
// import Checkit from 'checkit';
import { Field, reduxForm } from 'redux-form';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import cx from 'classnames';
import s from './style.scss';
import t from './translation.json';
import Row from '../../Row';
import Col from '../../Col';
import FieldInput from '../../Form/FieldInput';
import ToggleSwitch from '../../Form/ToggleSwitch';

const formName = 'collectorInfoForm';

// const rules = new Checkit({
//   first_name: { rule: 'required', label: 'first name' },
//   last_name: { rule: 'required', label: 'last name' },
//   email: ['required', 'email'],
//   telephone: [
//     { rule: 'required', label: 'phone number' },
//     { rule: 'minLength:9', label: 'phone number' },
//   ],
// });

// const validate = values => {
//   const [err] = rules.runSync(values);
//   return err
//     ? err.reduce((values, error) => {
//         values[error.key] = error.message;
//         return values;
//       }, {})
//     : undefined;
// };

const validate = values => {
  const requiredData = ['first_name', 'last_name', 'email', 'telephone'];
  const errors = requiredData.reduce((e, data) => {
    if (!values[data]) {
      e[data] = 'required';
    } else if (
      data === 'email' &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[data])
    ) {
      e[data] = 'email_format';
    } else if (data === 'telephone' && isNaN(Number(values[data]))) {
      e[data] = 'number_format';
    }
    return e;
  }, {});
  return errors;
};

@withStyles(s)
@withLocales(t)
@reduxForm({
  form: formName,
  validate,
  destroyOnUnmount: false,
})
class CollectorInfoForm extends PureComponent {
  static propTypes = {
    checked: pt.bool,
    disabled: pt.bool,
    onCheckedChange: pt.func,
  };

  render() {
    const { checked, disabled, onCheckedChange, translate } = this.props;
    return (
      <div className={s.root}>
        <label className={s.toggle}>
          <span className={s.label}>{translate('self_pickup')}</span>
          <div className={s.right}>
            <ToggleSwitch checked={checked} onChange={onCheckedChange} />
          </div>
        </label>
        <form
          className={cx(s.form, s.accordion, { [s.active]: !checked })}
          onSubmit={this.props.handleSubmit}
        >
          <p>{translate('how_to')}</p>
          <h3>{translate('collector_info')}</h3>
          <Row>
            <Col lg={6} sm={12}>
              <Field
                className={s.field}
                name="first_name"
                type="text"
                component={FieldInput}
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
                className={s.field}
                name="last_name"
                type="text"
                component={FieldInput}
                label={translate('lastname')}
                placeholder={translate('lastname')}
                autoComplete="off"
                maxLength={100}
                disabled={disabled}
                msgError={translate}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6} sm={12}>
              <Field
                className={s.field}
                name="email"
                type="text"
                component={FieldInput}
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
                className={s.field}
                name="telephone"
                type="text"
                component={FieldInput}
                label={translate('phone')}
                placeholder={translate('enterPhone')}
                autoComplete="off"
                maxLength={10}
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

export default CollectorInfoForm;
