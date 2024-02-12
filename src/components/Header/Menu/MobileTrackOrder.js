import React, { useState } from 'react';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';
import styled from 'styled-components';
import moment from 'moment';
import { Link, withLocales, withRoutes } from '@central-tech/core-ui';
import { useOrders, useOrdersLazy, useOrderByEmailLazy } from '../useOrder';

import ImageV2 from '../../Image/ImageV2';
import { Formik, ErrorMessage } from 'formik';
import { validateEmail } from '../../Subscription/utils';
import propTypes from 'prop-types';
import { get as prop } from 'lodash';

const MobileTrackBoxStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: #fff;
  transform: translate3d(-100%, 0, 0);
  transition: all 300ms ease-in;
  &.active {
    transform: translate3d(0, 0, 0);
  }
`;

const MenuBlockStyled = styled(Link)`
  border-bottom: 1px solid #e6e6e6;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 18px;
  padding-right: 16px;
  font-weight: 400;
  font-size: 14px;
  ${props => (props.justifyContent ? 'justify-content: start;' : '')}
  ${props => (props.color ? `color:${props.color};` : '')}
`;
const ArrowLeftIconStyled = styled(ImageV2)`
  overflow: hidden;
  transform: translateX(-7px);
`;
const BackLabelStyled = styled.div`
  color: #474747;
`;
const TrackingBoxStyled = styled.div`
  padding: 16px;
`;
const TrackInputStyled = styled.div`
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
  margin-bottom: 8px;
`;
const TrackLabelStyled = styled.div`
  color: #7a7979;
  margin-bottom: 8px;
  font-size: 14px;
`;
const TrackButtonStyled = styled.input`
  height: 38px;
  width: 100%;
  background-color: #13283f;
  color: #fff;
  text-align: center;
  line-height: 38px;
  margin-top: 16px;
`;
const TextInputErrorStyled = styled.div`
  display: none;
  margin-bottom: 8px;
  color: red;
  display: none;
  &.invalid-text {
    display: block;
  }
`;
const TrackLinkStyled = styled(Link)`
  display: block;
  margin: 16px 0;
  font-size: 14px;
  color: #7a7979;
  > span {
    color: #00b8e6;
    text-decoration: underline;
  }
`;

const MobileTrackOrder = (props, { customer }) => {
  const {
    translate,
    onToggleMenu,
    isOpenTrackOrder,
    setOpenTrackOrder,
    lang,
  } = props;

  const defaultValue = {
    email: '',
    incrementId: '',
  };

  const isGuest = !prop(customer, 'id', false);

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

  const handleClose = (setValues, resetForm) => {
    setValues(defaultValue);
    resetForm();
    setFetchOrderFail(false);
    setOpenTrackOrder(false);
  };

  const handleCloseMenu = (setValues, resetForm) => {
    handleClose(setValues, resetForm);
    onToggleMenu(false);
  };

  const handleRedirect = url => {
    setFetchOrderFail(false);
    setOpenTrackOrder(false);
    onToggleMenu(false);
    window.location.replace(url);
  };

  const [orderByEmailLazy, resultOrderByEmail] = useOrderByEmailLazy(); //for guest
  const [ordersLazy, resultOrders] = useOrdersLazy(); //for customer

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
        setValues,
        resetForm,
      }) => (
        <MobileTrackBoxStyled
          className={isOpenTrackOrder ? `active` : `inactive`}
        >
          <MenuBlockStyled
            onClick={() => handleClose(setValues, resetForm)}
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              `BackParentCategory`,
              'MobileHeaderMenu',
            )}
            justifyContent="start"
          >
            <ArrowLeftIconStyled src="/static/icons/ArrowLeft.svg" width="24" />
            <BackLabelStyled>{translate('back')}</BackLabelStyled>
          </MenuBlockStyled>
          <TrackingBoxStyled as="form" onSubmit={e => handleSubmit(e)}>
            {isGuest && (
              <>
                <TrackLabelStyled>
                  {translate('track_order.my_email_address')}
                </TrackLabelStyled>
                <TrackInputStyled
                  className={errors.email && touched.email && `invalid`}
                >
                  <input
                    placeholder={`abc@domain.coms`}
                    name={`email`}
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </TrackInputStyled>
                <ErrorMessage name="email">
                  {message => (
                    <TextInputErrorStyled className={`invalid-text`}>
                      {message}
                    </TextInputErrorStyled>
                  )}
                </ErrorMessage>
              </>
            )}
            {!isGuest && latestOrders.length > 0 && (
              <>
                <TrackLabelStyled>
                  {translate('track_order.my_latest_order')}
                </TrackLabelStyled>
                {latestOrders.map(item => (
                  <TrackLinkStyled
                    onClick={() => handleCloseMenu(setValues, resetForm)}
                    to={`/account/orders/${item.increment_id}`}
                    native
                  >
                    <span>{item.name}</span> >
                  </TrackLinkStyled>
                ))}
              </>
            )}
            <TrackLabelStyled>
              {translate('track_order.my_order_number')}
            </TrackLabelStyled>
            <TrackInputStyled
              className={errors.incrementId && touched.incrementId && `invalid`}
            >
              <input
                name={`incrementId`}
                type={`text`}
                placeholder={`eg.123456789`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.incrementId}
              />
            </TrackInputStyled>
            <ErrorMessage name="incrementId">
              {message => (
                <TextInputErrorStyled className={`invalid-text`}>
                  {message}
                </TextInputErrorStyled>
              )}
            </ErrorMessage>
            <TextInputErrorStyled className={fetchOrderFail && `invalid-text`}>
              {isGuest
                ? translate('track_order.tracking_incorrect_guest')
                : translate('track_order.tracking_incorrect_customer')}
            </TextInputErrorStyled>
            <TrackButtonStyled
              type={`submit`}
              value={`${translate('track_order.track_order')}`}
            ></TrackButtonStyled>
          </TrackingBoxStyled>
        </MobileTrackBoxStyled>
      )}
    </Formik>
  );
};

MobileTrackOrder.contextTypes = {
  customer: propTypes.object,
};

export default withLocales(withRoutes(MobileTrackOrder));
