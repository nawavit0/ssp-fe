import React, { PureComponent } from 'react';
import pt from 'prop-types';

const withDeviceDetect = WrapperComponent => {
  return class HoC extends PureComponent {
    static contextTypes = {
      deviceDetect: pt.object,
    };

    render() {
      return (
        <WrapperComponent
          {...this.props}
          isMobile={this.context.deviceDetect.isMobile}
        />
      );
    }
  };
};

export default withDeviceDetect;
