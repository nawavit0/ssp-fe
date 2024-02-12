import types from './types';
import service from '../../ApiService';
import { isEmpty, get as prop, head } from 'lodash';
import { fetchCart } from '../cart/actions';

export const fetchPayment = () => async dispatch => {
  dispatch(startFetchPaymentMethod());
  try {
    const timeStamp = new Date().getTime();
    const { payment, status } = await service.get(`/payment?date=${timeStamp}`);
    if (status === 'error') {
      return;
    }

    await dispatch(fetchPaymentCompleted(payment));
    dispatch(endFetchPaymentMethod());
  } catch (e) {
    dispatch(endFetchPaymentMethod());
  }
};

export const setPaymentInfo = (paymentMethod, paymentCode) => async (
  dispatch,
  getState,
) => {
  dispatch(startSetOntop());
  try {
    let email;
    if (!isEmpty(prop(getState().cart.cart, 'extension_attributes', {}))) {
      const extension = getState().cart.cart.extension_attributes;
      if (!isEmpty(extension.shipping_assignments)) {
        email = prop(
          getState().cart.cart.extension_attributes.shipping_assignments[0],
          'shipping.address.email',
          '',
        );
      }
    }

    const param = {
      paymentMethod: paymentMethod,
      email: email,
    };

    if (paymentMethod === 'p2c2p_ipp') {
      param.extension_attributes = {
        installmentplan_id: paymentCode,
      };
    }

    const { status } = await service.post('/payment/setPaymentInfo', param);

    if (status === 'error') {
      return dispatch(stopSetOntop());
    }

    if (!isEmpty(paymentCode) && paymentMethod !== 'p2c2p_ipp') {
      await dispatch(setPaymentEwalletMethod(paymentMethod, paymentCode));
    } else {
      await dispatch(setPaymentMethod(paymentMethod));
    }

    await dispatch(fetchCart());
    dispatch(stopSetOntop());
  } catch (e) {
    dispatch(stopSetOntop());
    return null;
  }
};

export const applyPromoCreditCardOntop = (promoId, noRefresh) => async (
  dispatch,
  getState,
) => {
  dispatch(startSetOntop());
  try {
    let email;
    if (!isEmpty(getState().cart.cart.extension_attributes)) {
      const extension = getState().cart.cart.extension_attributes;
      if (!isEmpty(extension.shipping_assignments)) {
        email = prop(
          getState().cart.cart.extension_attributes.shipping_assignments[0],
          'shipping.address.email',
          '',
        );
      }
    }
    if (!email) {
      return null;
    }
    // if (getState().payment.paymentMethod) {
    const { status } = await service.post('/payment/applyCreditCardOntop', {
      paymentMethod: !isEmpty(getState().payment.paymentMethod)
        ? getState().payment.paymentMethod
        : head(getState().payment.payment.payment_methods).code,
      promoId: promoId,
      cartId: getState().cart.cart.id,
      ippPlanId: '',
      email: email,
    });

    if (status === 'error') {
      return dispatch(stopSetOntop());
    }
    // }

    await dispatch(setOntop(promoId));
    if (!noRefresh) {
      await dispatch(fetchCart());
    }
    dispatch(stopSetOntop());
  } catch (e) {
    if (!noRefresh) {
      await dispatch(fetchCart());
      dispatch(stopSetOntop());
    }
    return null;
  }
};

export const setPaymentMethod = paymentMethod => ({
  type: types.SET_PAYMENT_METHOD,
  payload: {
    paymentMethod,
  },
});

export const setPaymentEwalletMethod = (paymentMethod, extension) => ({
  type: types.SET_PAYMENT_EWALLET_METHOD,
  payload: {
    paymentMethod,
    extension,
  },
});

export const setPay123 = extension => ({
  type: types.SET_PAY_123,
  payload: {
    extension,
  },
});

export const setIPP = extension => ({
  type: types.SET_PAY_IPP,
  payload: {
    extension,
  },
});

export function fetchPaymentCompleted(payment) {
  return {
    type: types.FETCH_PAYMENT,
    payload: {
      payment,
    },
  };
}

export function setOntop(extension) {
  return {
    type: types.SET_ONTOP_CREDITCARD,
    payload: {
      extension,
    },
  };
}

export function startSetOntop() {
  return {
    type: types.START_ONTOP_CREDITCARD,
  };
}

export function stopSetOntop() {
  return {
    type: types.STOP_ONTOP_CREDITCARD,
  };
}

export function startFetchPaymentMethod() {
  return {
    type: types.START_FETCH_PAYMENT_METHOD,
  };
}

export function endFetchPaymentMethod() {
  return {
    type: types.END_FETCH_PAYMENT_METHOD,
  };
}

export function clearAllExtension() {
  return {
    type: types.CLEAR_EXTENSION,
  };
}
