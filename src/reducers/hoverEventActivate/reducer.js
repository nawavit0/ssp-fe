import types from './types';

const initialState = {
  isHoverActive: false,
};

export default function layout(state = initialState, action) {
  switch (action.type) {
    case types.IS_ACTIVE_HOVER:
      return { ...state, isHoverActive: !!action.isActive };
    default:
      return state;
  }
}
