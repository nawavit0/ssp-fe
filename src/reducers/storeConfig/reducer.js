import types from './types';

const initialState = {
  storeConfigs: [],
  activeConfig: {},
};

export default function storeConfig(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_STORECONFIG:
      return {
        ...state,
        storeConfigs: action.payload.storeConfigs,
      };
    case types.SET_ACTIVE_CONFIG_COMPLETED:
      return {
        ...state,
        activeConfig: action.payload.activeConfig,
      };
    default:
      return state;
  }
}
