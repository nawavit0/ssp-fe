import axios from 'axios';
import { find } from 'lodash';
import types from './types';

export const setActiveConfig = locale => async (dispatch, getState) => {
  const state = getState();
  const activeConfig = find(
    state.storeConfig.storeConfigs,
    config => config.locale === locale,
  );

  axios.defaults.headers.common['x-store-code'] = activeConfig.code;
  dispatch(setActiveConfigCompleted(activeConfig));
};

export const setActiveStoreConfig = activeConfig => async dispatch => {
  axios.defaults.headers.common['x-store-code'] = activeConfig.code;

  dispatch(setActiveConfigCompleted(activeConfig));
};

export function setActiveConfigCompleted(activeConfig) {
  return {
    type: types.SET_ACTIVE_CONFIG_COMPLETED,
    payload: { activeConfig },
  };
}

export function loadStoreConfigsCompleted(storeConfigs) {
  return {
    type: types.LOAD_STORECONFIG,
    payload: {
      storeConfigs,
    },
  };
}
