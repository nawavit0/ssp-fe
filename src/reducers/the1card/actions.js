import types from './types';
import service from '../../ApiService';
import { isEmpty, get as prop, head } from 'lodash';
import { setStorage } from '../../utils/localStorage';
import { fetchCartPayment } from '../cart/actions';
import { setPaymentInfo } from '../payment/actions';

export const the1cardLogin = (email, password) => async (
  dispatch,
  getState,
) => {
  dispatch(startLoginThe1CardLoading());
  const { cart } = getState().cart;
  const cartId = !isEmpty(cart) && cart.id;

  try {
    const { the1card, status } = await service.post('/t1c/login', {
      email,
      password,
      cartId,
    });

    if (status === 'error') {
      dispatch(stopLoginThe1CardLoading());
      return;
    }

    setStorage('t1c-email', email);

    dispatch(fetchThe1CardCompleted(the1card));

    return the1card;
  } catch (e) {
    dispatch(stopLoginThe1CardLoading());
    return null;
  }
};

export const the1cardRedeemPoint = points => async (dispatch, getState) => {
  dispatch(startLoadingRedeemT1());
  try {
    const { cart } = getState().cart;

    const { status } = await service.put('/t1c/redeem', {
      cartId: cart.id,
      points,
    });

    if (status === 'error') {
      return status;
    }

    await dispatch(fetchCartPayment());

    const { payment } = getState().payment;
    const paymentMethod = head(prop(payment, 'payment_methods'));

    if (!isEmpty(paymentMethod) && paymentMethod.code === 'free') {
      dispatch(setPaymentInfo(paymentMethod.code));
    }

    dispatch(stopLoadingRedeemT1());

    return status;
  } catch (e) {
    dispatch(stopLoadingRedeemT1());
    return null;
  }
};

export const the1CardRemovePoint = noRefresh => async (dispatch, getState) => {
  dispatch(startLoadingRedeemT1());
  try {
    const { cart } = getState().cart;
    const { status } = await service.delete('/t1c/delete', {
      cartId: cart.id,
    });

    if (status === 'error') {
      return status;
    }
    if (!noRefresh) {
      await dispatch(fetchCartPayment());
    }
    dispatch(stopLoadingRemoveRedeemT1());

    return status;
  } catch (e) {
    dispatch(stopLoadingRedeemT1());
    return null;
  }
};

export function fetchThe1CardCompleted(the1card) {
  return {
    type: types.FETCH_THE1CARD,
    payload: {
      the1card,
    },
  };
}

export const startLoginThe1CardLoading = () => {
  return {
    type: types.START_LOGIN_T1C_LOADING,
  };
};

export const stopLoginThe1CardLoading = () => {
  return {
    type: types.STOP_LOGIN_T1C_LOADING,
  };
};

export function startLoadingRedeemT1() {
  return {
    type: types.START_LOADING_REDEEM_T1,
  };
}

export function stopLoadingRedeemT1() {
  return {
    type: types.STOP_LOADING_REDEEM_T1,
  };
}

export function stopLoadingRemoveRedeemT1() {
  return {
    type: types.STOP_LOADING_REMOVE_REDEEM_T1,
  };
}
