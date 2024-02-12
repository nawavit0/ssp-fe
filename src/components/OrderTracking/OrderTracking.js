import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import cx from 'classnames';
import { isEmpty, map } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import withRoutes from '../../utils/decorators/withRoutes';
import {
  fetchTrackingOrder,
  fetchOrderHistoryLatest,
} from '../../reducers/order/actions';
import { resolveUrl } from '../../utils/url';
import Link from '../Link';
import Image from '../Image';
import t from './translation';
import s from './OrderTracking.scss';

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'email_format';
  } else if (values.email.length < 5 && values.email.length > 30) {
    errors.email = 'email_length';
  }
  if (!values.orderNumber) {
    errors.orderNumber = 'required';
  } else if (!/^[A-Z0-9]+$/i.test(values.orderNumber)) {
    errors.orderNumber = 'order_number_format';
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
    <Fragment>
      <div className={s.labelTitle}>{label}</div>
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        className={touched && error ? s.validateInput : ''}
      />
      {touched && error && (
        <div className={s.validateAlert}>{msgError(error)}</div>
      )}
    </Fragment>
  );
};

@withLocales(t)
@withStyles(s)
@withRoutes
class OrderTracking extends React.PureComponent {
  state = {
    customerEmail: null,
    current_page: 1,
    limit: 2,
    filters: 'customer_id',
    sort: 'entity_id desc',
  };

  componentDidMount() {
    const { customer } = this.props;
    const { current_page, limit, filters, sort } = this.state;

    if (!isEmpty(customer)) {
      this.props.fetchOrderHistoryLatest(current_page, limit, filters, sort);
    }
  }

  guestFormSubmit = () => {
    const { fetchTrackingOrder, trackingForm } = this.props;
    const { customerEmail } = this.state;

    if (!isEmpty(trackingForm.values)) {
      const { email } = trackingForm.values;

      if (!email && customerEmail) {
        trackingForm.values.email = customerEmail;
      }

      fetchTrackingOrder(trackingForm.values).then(order => {
        if (!isEmpty(order)) {
          this.historyPushGuestTracking(`/orders/tracking`, {
            increment_id: order.increment_id,
            customer_email: trackingForm.values.email,
          });
        }
      });
    }
  };

  customerFormSubmit = () => {
    const { fetchTrackingOrder, trackingForm, customerEmail } = this.props;

    if (!isEmpty(trackingForm.values)) {
      trackingForm.values.email = customerEmail;

      fetchTrackingOrder(trackingForm.values).then(order => {
        if (!isEmpty(order)) {
          const url = resolveUrl(
            this.props.langCode,
            `/account/orders/${order.increment_id}`,
          );
          window.location.replace(url);
        }
      });
    }
  };

  historyPushGuestTracking = (url, param) => {
    const { location, langCode } = this.props;
    const path = resolveUrl(langCode, url);
    location.push(path, param);
  };
  redirectTo = param => {
    const url = resolveUrl(this.props.langCode, param);
    window.location.replace(url);
  };

  renderGuestForm() {
    const {
      translate,
      handleSubmit,
      orderFetchFailed,
      orderHistory,
      trackingForm,
    } = this.props;
    return (
      <form
        onSubmit={handleSubmit(this.guestFormSubmit)}
        className={s.formTracking}
        noValidate
      >
        <div className={s.formGroup}>
          {!isEmpty(orderHistory) ? (
            <Fragment>
              <label>{translate('your_latest_orders')}</label>
              {map(orderHistory, order => (
                <Link
                  className={s.orderHistoryItem}
                  onClick={() =>
                    this.historyPushGuestTracking(`/orders/tracking`, {
                      increment_id: order.increment_id,
                      customer_email: trackingForm.values.email,
                    })
                  }
                >
                  {' '}
                  {order.created_at.split(' ')[0]} {order.increment_id}
                  <Image
                    className={s.arrow}
                    src="/icons/ios-arrow-right.svg"
                    width="16"
                  />
                </Link>
              ))}
            </Fragment>
          ) : (
            <Field
              name="email"
              type="email"
              component={renderField}
              label={translate('your_email_address')}
              placeholder={translate('placeholder_email')}
              autoComplete="off"
              msgError={translate}
            />
          )}
          <Field
            name="orderNumber"
            type="text"
            component={renderField}
            label={translate('my_order_number')}
            placeholder={translate('placeholder_order_number')}
            autoComplete="off"
            msgError={translate}
          />
          {orderFetchFailed && (
            <label className={s.validateAlert}>
              {translate('tracking_incorrect')}
            </label>
          )}
          <button className={s.button} type="submit">
            {translate('track_order')}
          </button>
        </div>
      </form>
    );
  }

  renderCustomerForm() {
    const {
      translate,
      handleSubmit,
      orderFetchFailed,
      orderHistory,
    } = this.props;
    return (
      <form
        onSubmit={handleSubmit(this.customerFormSubmit)}
        className={s.formTracking}
        noValidate
      >
        <div className={s.formGroup}>
          {!isEmpty(orderHistory) ? (
            <Fragment>
              <label>{translate('your_latest_orders')}</label>
              {map(orderHistory, (order, index) => (
                <Link
                  key={index}
                  className={s.orderHistoryItem}
                  onClick={() =>
                    this.redirectTo(`/account/orders/${order.increment_id}`)
                  }
                >
                  {' '}
                  {order.created_at.split(' ')[0]} {order.increment_id}
                  <Image
                    className={s.arrow}
                    src="/icons/ios-arrow-right.svg"
                    width="16"
                  />
                </Link>
              ))}
            </Fragment>
          ) : (
            ''
          )}
          <Field
            name="orderNumber"
            type="text"
            component={renderField}
            label={translate('my_order_number')}
            placeholder={translate('placeholder_order_number')}
            autoComplete="off"
            msgError={translate}
          />
          {orderFetchFailed && (
            <label className={s.validateAlert}>
              {translate('tracking_incorrect')}
            </label>
          )}
          <button className={s.button} type="submit">
            {translate('track_order')}
          </button>
        </div>
      </form>
    );
  }

  render() {
    const { className, customerEmail } = this.props;

    return (
      <div className={cx(s.container, className)}>
        {isEmpty(customerEmail)
          ? this.renderGuestForm()
          : this.renderCustomerForm()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  trackingForm: state.form.tracking,
  orderFetchFailed: state.order.orderFetchFailed,
  orderHistory: state.order.orderHistoryLatest,
  customerEmail: state.customer.customer.email,
  langCode: state.locale.langCode,
  customer: state.customer.customer,
});

const mapDispatchToProps = dispatch => ({
  fetchTrackingOrder: (form, field) =>
    dispatch(fetchTrackingOrder(form, field)),
  fetchOrderHistoryLatest: (...args) =>
    dispatch(fetchOrderHistoryLatest(...args)),
});

OrderTracking = connect(mapStateToProps, mapDispatchToProps)(OrderTracking);

export default reduxForm({
  form: 'tracking',
  validate,
  destroyOnUnmount: false,
})(OrderTracking);
