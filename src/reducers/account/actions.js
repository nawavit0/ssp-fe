import types from './types';
import service from '../../ApiService';
import { fetchCustomer } from '../customer/actions';

export const updateProfile = profile => async dispatch => {
  dispatch(updateProfileStart());

  try {
    const response = await service.put(
      `/account/profile/${profile.customer_id}`,
      {
        profile: profile,
      },
    );

    await dispatch(fetchCustomer(null));
    dispatch(updateProfileEnd());
    return response;
  } catch (e) {
    if (e.response) {
      const error = e.response.data.message;
      dispatch(updateProfileEnd(error));
    }

    return false;
  }
};

export const updateProfileStart = () => ({
  type: types.UPDATE_PROFILE_START,
});

export const updateProfileEnd = (error = '') => ({
  type: types.UPDATE_PROFILE_END,
  payload: {
    error: error,
  },
});
