import types from './types';
import service from '../../ApiService';
import { clearStorage } from '../../utils/localStorage';
import { resolveUrl } from '../../utils/url';
import { unsetCookie } from '../../utils/cookie';
import { mergeGuestCartToCustomer } from '../cart/actions';
import languages from '../../constants/languages';
import history from '../../history';

export const register = (customerType, customer, subscribe) => {
  return async dispatch => {
    dispatch(sendRegistration(customerType, customer));

    try {
      const response = await service.post(`/register`, {
        customerType,
        customer,
        subscribe,
      });

      if (response && response.id) {
        dispatch(registerSucceded(customerType, response));
        dispatch(login(customer, 'Register'));
      } else {
        dispatch(registerFailed(response));
      }

      return response;
    } catch (e) {
      dispatch(
        registerFailed({ customerType: customerType, cause: e.response.data }),
      );
      return null;
    }
  };
};

export const logout = (lang, afterLogout = '/logout') => {
  return async () => {
    try {
      clearStorage();
    } catch (e) {}
    let to = afterLogout;
    if (lang === languages.en) {
      to = resolveUrl('/en', to);
    } else if (lang === languages.th) {
      to = resolveUrl('/th', to);
    }
    await service.post('/logout').then(() => (window.location.href = to));
  };
};

export const login = (customer, type, merge) => async (dispatch, getState) => {
  try {
    dispatch(sendLogin());
    await service.post(`/login`, customer);
    unsetCookie('lang');

    await dispatch(mergeGuestCartToCustomer(merge));
    dispatch(loginSucceded());

    if (type === 'Register') {
      const to = '/registerSuccess';
      const { langCode } = getState().locale;
      const url = resolveUrl(langCode, to);

      history.push(url);
    } else {
      window.location.reload();
    }
  } catch (error) {
    dispatch(loginFailed(error));
  }
};

export const forgotPassword = email => {
  return dispatch =>
    service
      .post('/forgot_password', { email })
      .then(response => {
        dispatch(forgotPasswordSucceded());
        return response;
      })
      .catch(() => {
        dispatch(forgotPasswordFailed());
        return null;
      });
};

//data: {id, token, new password, email}
export const resetPassword = data => {
  return async dispatch => {
    dispatch(resetPasswordSend());

    try {
      const response = await service.post('/forgot_password/reset', data);
      if (response.status === 'success') {
        dispatch(resetPasswordSucceded());
        return true;
      }
      dispatch(resetPasswordFailed(response));
      return false;
    } catch (e) {
      dispatch(resetPasswordFailed(e));
      return false;
    }
  };
};

export const sendRegistration = () => ({
  type: types.REGISTER_SEND,
});

const registerSucceded = (customerType, customer) => ({
  type: types.REGISTER_SUCCESS,
  payload: { customerType, customer },
});

const registerFailed = resp => ({
  type: types.REGISTER_FAILED,
  payload: resp,
});

const sendLogin = () => ({
  type: types.LOGIN_SEND,
});

const loginSucceded = () => ({
  type: types.LOGIN_SUCCESS,
});

const loginFailed = () => ({
  type: types.LOGIN_FAILED,
});

export const forgotPasswordStart = () => ({
  type: types.FORGOT_START,
});

const forgotPasswordSucceded = () => ({
  type: types.FORGOT_SUCCESS,
});

const forgotPasswordFailed = () => ({
  type: types.FORGOT_FAILED,
});

const resetPasswordSend = () => ({
  type: types.RESET_PASSWORD_SEND,
});

export const resetPasswordSucceded = () => ({
  type: types.RESET_PASSWORD_SUCCESS,
});

const resetPasswordFailed = resp => ({
  type: types.RESET_PASSWORD_FAILED,
  payload: resp,
});
