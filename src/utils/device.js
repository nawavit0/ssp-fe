import { isMobileOnly as _isMobile } from 'react-device-detect';

export const isMobile = () => {
  return _isMobile;
};
