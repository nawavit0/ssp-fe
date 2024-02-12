import types from './types';

const initialState = {
  customer: {},
  customerType: '',
  loginFailed: false,
  registrationErrorCause: null,
  loading: false,
  loadingRegister: false,
  forgotPasswordSent: null,
  resetPasswordSent: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    //register
    case types.REGISTER_SEND: {
      return {
        ...state,
        loadingRegister: true,
        registrationErrorCause: null,
      };
    }

    case types.REGISTER_FAILED: {
      return {
        ...state,
        customer: {},
        customerType: action.payload.customerType,
        registrationErrorCause: action.payload.cause,
        loadingRegister: false,
      };
    }

    case types.REGISTER_SUCCESS: {
      return {
        ...state,
        registrationErrorCause: { registrationSuccess: true },
        loadingRegister: false,
      };
    }

    case types.LOGIN_SEND: {
      return {
        ...state,
        loginFailed: false,
        loading: true,
      };
    }

    case types.LOGIN_FAILED: {
      return {
        ...state,
        customer: {},
        customerType: '',
        loginFailed: true,
        loading: false,
      };
    }

    case types.LOGIN_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }

    //forgot password

    case types.FORGOT_START: {
      return {
        ...state,
        forgotPasswordSent: false,
      };
    }
    case types.FORGOT_SUCCESS: {
      return {
        ...state,
        forgotPasswordSent: true,
      };
    }

    case types.FORGOT_FAILED: {
      return {
        ...state,
        forgotPasswordSent: false,
      };
    }
    //reset password
    case types.RESET_PASSWORD_SEND: {
      return {
        ...state,
        resetPasswordSent: true,
        resetPasswordSucceeded: false,
      };
    }

    case types.RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        resetPasswordSent: false,
        resetPasswordSucceeded: true,
        resetPasswordErrorCause: null,
      };
    }

    case types.RESET_PASSWORD_FAILED: {
      return {
        ...state,
        resetPasswordSent: false,
        resetPasswordFailed: true,
        resetPasswordSucceeded: false,
        resetPasswordErrorCause: action.payload.response.data.message,
      };
    }

    default:
      return state;
  }
};
