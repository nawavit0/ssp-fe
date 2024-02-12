import React, { useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Formik, ErrorMessage } from 'formik';
import propTypes from 'prop-types';
import { Link, withLocales, withRoutes } from '@central-tech/core-ui';
import { useOrders, useOrdersLazy, useOrderByEmailLazy } from '../useOrder';
import { validateEmail } from '../../Subscription/utils';

const DesktopTrackOrder = (
  { className, translate, lang, handleCloseTrackOrder = () => {} },
  { customer },
) => {
  const isGuest = !(customer?.id || false);

  const defaultValue = {
    email: '',
    incrementId: '',
  };
  const filter = {
    filterGroups: [],
    sortOrders: [{ field: 'created_at', direction: 'DESC' }],
    size: 2,
  };
  const { orders = {} } = useOrders(filter, isGuest);
  const latestOrders = isGuest
    ? []
    : orders?.items?.map(item => {
        const date = moment(item.created_at).format('YYYY-MM-DD');
        return {
          increment_id: item.increment_id,
          name: `${date} ${item.increment_id}`,
        };
      }) || [];

  const [fetchOrderFail, setFetchOrderFail] = useState(false);
  const [calledOrder, setCalledOrder] = useState(false);

  const [orderByEmailLazy, resultOrderByEmail] = useOrderByEmailLazy(); //for guest
  const [ordersLazy, resultOrders] = useOrdersLazy(); //for customer

  const handleRedirect = url => {
    handleCloseTrackOrder();
    setFetchOrderFail(false);
    window.location.replace(url);
  };

  if (calledOrder && !(resultOrderByEmail?.loading || resultOrders?.loading)) {
    if (
      isGuest &&
      !fetchOrderFail &&
      resultOrderByEmail?.called &&
      !resultOrderByEmail?.data
    ) {
      setFetchOrderFail(true);
    }

    if (
      !isGuest &&
      !fetchOrderFail &&
      resultOrders.called &&
      !resultOrders?.data
    ) {
      setFetchOrderFail(true);
    }

    const order = isGuest
      ? resultOrderByEmail?.data?.orderByEmail
      : resultOrders?.data?.orders?.items[0];
    if (order) {
      const url = isGuest
        ? `/${lang}/orders/tracking?increment_id=${order.increment_id}&customer_email=${order.customer_email}`
        : `/${lang}/account/orders/${order.increment_id}`;
      handleRedirect(url);
    } else {
      setFetchOrderFail(true);
    }

    setCalledOrder(false);
  }

  return (
    <Formik
      initialValues={{
        email: defaultValue.email,
        incrementId: defaultValue.incrementId,
      }}
      validate={values => {
        const errors = {};
        if (isGuest) {
          if (!values.email) {
            errors.email = translate('newsletter_sign_up.required');
          } else if (!validateEmail(values.email)) {
            errors.email = translate(
              'newsletter_sign_up.invalid_email_address',
            );
          }
        }
        if (!values.incrementId) {
          errors.incrementId = translate('newsletter_sign_up.required');
        }
        return errors;
      }}
      onSubmit={values => {
        if (isGuest) {
          orderByEmailLazy({
            email: values.email,
            incrementId: values.incrementId,
          });
        } else {
          const filter = {
            filterGroups: {
              filters: [
                {
                  field: 'increment_id',
                  value: values.incrementId,
                  conditionType: 'eq',
                },
              ],
            },
          };
          ordersLazy(filter);
        }
        setCalledOrder(true);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur,
      }) => (
        <form className={className} onSubmit={e => handleSubmit(e)}>
          {isGuest && (
            <>
              <div className="label">
                {translate('track_order.my_email_address')}
              </div>
              <div
                className={`input-validate ${
                  errors.email && touched.email ? 'invalid' : ''
                }`}
              >
                <input
                  name={`email`}
                  type="email"
                  placeholder={`abc@domain.coms`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
              </div>
              <ErrorMessage name="email">
                {message => (
                  <div className={`input-error invalid`}>{message}</div>
                )}
              </ErrorMessage>
            </>
          )}
          {!isGuest && latestOrders.length > 0 && (
            <>
              <div className="label">
                {translate('track_order.my_latest_order')}
              </div>
              {latestOrders.map(item => (
                <Link
                  className="latest-link"
                  onClick={() => {}}
                  to={`/account/orders/${item.increment_id}`}
                  native
                >
                  <span>{item.name}</span> >
                </Link>
              ))}
            </>
          )}
          <div className="label">
            {translate('track_order.my_order_number')}
          </div>
          <div
            className={`input-validate ${
              errors.incrementId && touched.incrementId ? 'invalid' : ''
            }`}
          >
            <input
              name={`incrementId`}
              type={`text`}
              placeholder={`eg.123456789`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.incrementId}
            />
          </div>
          <ErrorMessage name="incrementId">
            {message => <div className={`input-error invalid`}>{message}</div>}
          </ErrorMessage>
          <div className={`input-error ${fetchOrderFail ? 'invalid' : ''}`}>
            {isGuest
              ? translate('track_order.tracking_incorrect_guest')
              : translate('track_order.tracking_incorrect_customer')}
          </div>
          <input
            className="submit-button"
            type={`submit`}
            value={`${translate('track_order.track_order')}`}
          />
        </form>
      )}
    </Formik>
  );
};

DesktopTrackOrder.contextTypes = {
  customer: propTypes.object,
};

const StyledDesktopTrackOrder = styled(DesktopTrackOrder)`
  padding: 10px 16px;
  width: 323px;
  border-radius: 2px;

  > .label {
    color: #7a7979;
    margin-bottom: 5px;
    font-size: 12px;
    line-height: 1.8;
  }

  > .input-validate {
    height: 38px;
    border: 1px solid #ccc;
    &.invalid {
      border: 1px solid red;
    }
    > input {
      -webkit-appearance: input;
      height: 36px;
      font-size: 14px;
      width: 100%;
      padding: 0 12px;
      border: none;
    }
    margin-bottom: 5px;
  }

  > .input-error {
    display: none;
    color: red;
    line-height: 1.8;
    &.invalid {
      display: block;
    }
  }

  > .latest-link {
    display: block;
    margin: 16px 0;
    font-size: 14px;
    color: #7a7979;
    > span {
      color: #00b8e6;
      text-decoration: underline;
    }
  }

  > .submit-button {
    cursor: pointer;
    height: 38px;
    width: 100%;
    background-color: #13283f;
    color: #fff;
    text-align: center;
    line-height: 38px;
    margin: 10px 0 15px 0;
  }
`;

const MemoDesktopTrackOrder = React.memo(
  withLocales(withRoutes(StyledDesktopTrackOrder)),
);

export {
  MemoDesktopTrackOrder as DesktopTrackOrder,
  MemoDesktopTrackOrder as default,
};
