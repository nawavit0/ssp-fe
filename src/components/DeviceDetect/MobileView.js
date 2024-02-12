import propTypes from 'prop-types';

const MobileView = ({ children }, { deviceDetect: { isMobile } }) => {
  return isMobile ? children : null;
};

MobileView.contextTypes = {
  deviceDetect: propTypes.object,
};

export default MobileView;
