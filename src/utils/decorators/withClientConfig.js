import React from 'react';
import { get } from 'lodash';
import { clientConfig } from '../../config/client';

const withClientConfig = WrappedComponent => {
  class HOC extends React.PureComponent {
    render() {
      let config;

      if (typeof window !== 'undefined' && get(window, 'ClientConfig')) {
        config = get(window, 'ClientConfig');
      } else {
        config = clientConfig;
      }

      return <WrappedComponent {...this.props} clientConfig={config} />;
    }
  }

  return HOC;
};

export default withClientConfig;
