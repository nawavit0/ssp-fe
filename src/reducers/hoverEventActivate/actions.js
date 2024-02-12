import types from './types';

export function setHoverActiate(isActive) {
  return {
    type: types.IS_ACTIVE_HOVER,
    isActive,
  };
}
