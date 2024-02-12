import propTypes from 'prop-types';

const DesktopView = ({ children }, { deviceDetect: { isMobile } }) => {
  return !isMobile ? children : null;
};

DesktopView.contextTypes = {
  deviceDetect: propTypes.object,
};

export default DesktopView;
