import { useEffect } from 'react';

const DesktopLogin = () => {
  useEffect(() => (window.location.href = '/'), []);
  return null;
};

export default DesktopLogin;
