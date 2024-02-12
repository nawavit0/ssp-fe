import React from 'react';
import propTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import ControlGlobalState from './ControlGlobalState';
import { DeviceProvider } from './../context/DeviceContext';

const ContextType = {
  insertCss: propTypes.func.isRequired,
  pathname: propTypes.string.isRequired,
  query: propTypes.object,
  ...ReduxProvider.childContextTypes,
  client: propTypes.object.isRequired,
  deviceDetect: propTypes.object,
  customer: propTypes.object,
  cms: propTypes.object,
};

class App extends React.PureComponent {
  static propTypes = {
    context: propTypes.shape(ContextType).isRequired,
    children: propTypes.element.isRequired,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    return this.props.context;
  }

  render() {
    const deviceDetect = this.props.context?.deviceDetect;

    return (
      <ControlGlobalState>
        <DeviceProvider device={deviceDetect}>
          {React.Children.only(this.props.children)}
        </DeviceProvider>
      </ControlGlobalState>
    );
  }
}

export default App;
