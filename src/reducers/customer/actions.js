import types from './types';

import service from '../../ApiService';

export const fetchCustomer = (
  userToken,
  params = {},
  graphqLCustomerData,
) => async dispatch => {
  let response;
  const currentDevice = params?.currentDevice || '';
  if (graphqLCustomerData) {
    response = {
      customer: graphqLCustomerData,
      type: 'personal',
      shouldShowPopup: false,
    };
  } else {
    response = await service.get('/customer', {
      userToken: userToken,
    });
  }

  const {
    customer,
    status,
    type,
    shouldShowPopup,
    isAdmin,
    company,
  } = response;
  const device = currentDevice || '';

  if (status === 'error') {
    return;
  }

  await dispatch(
    fetchCustomerCompleted(
      customer,
      type,
      shouldShowPopup,
      company,
      isAdmin,
      device,
    ),
  );
};

export const changeCustomerPassword = (
  currentPassword,
  newPassword,
) => async dispatch => {
  dispatch(toggleLoading());

  const passwordObject = {
    currentPassword,
    newPassword,
  };
  const response = await service.put('/customer/password', passwordObject);
  let message;

  let isSuccess = false;
  switch (response.message.substring(0, 18)) {
    case `The password doesn`:
      message = 'incorrectPassword';
      break;
    case 'success':
      message = 'success';
      isSuccess = true;
      break;
    default:
      message = 'somethingWrong';
      break;
  }

  dispatch(setPasswordChangeMessage(message));
  dispatch(toggleLoading());
  return isSuccess;
};

export const setPasswordChangeMessage = message => ({
  type: types.SET_PASSWORD_CHANGE_MESSAGE,
  payload: {
    message,
  },
});

const toggleLoading = () => ({
  type: types.TOGGLE_LOADING,
});

export function fetchCustomerCompleted(
  customer,
  type,
  shouldShowPopup,
  company,
  isAdmin,
  device,
) {
  return {
    type: types.FETCH_CUSTOMER,
    payload: {
      customer,
      type,
      shouldShowPopup,
      company,
      isAdmin,
      device,
    },
  };
}
