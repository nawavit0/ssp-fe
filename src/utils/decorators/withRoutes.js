import React from 'react';
import history from '../../history';
import { createUrl, parseQueryParams } from '../../utils/url';

const withRoutes = WrappedComponent => {
  class Component extends React.PureComponent {
    state = {};

    set = false;

    UNSAFE_componentWillMount() {
      if (!history) {
        return;
      }
      this.setLocation();
      this.unlisten = history.listen(this.setLocation);
      this.set = true;
    }

    componentDidMount() {
      if (!this.set) {
        this.setLocation();
        this.unlisten = history.listen(this.setLocation);
      }
    }

    componentWillUnmount() {
      this.unlisten();
    }

    setLocation = (update = true) => {
      const { location } = history;

      const state = {
        location: {
          url: `${location.pathname}${location.search}`,
          pathname: location.pathname,
          search: location.search,
          queryParams: parseQueryParams(location.search),
          push: (pathname, queryParams) =>
            history.push(createUrl(pathname, queryParams)),
        },
      };

      if (update) {
        this.setState(state);
      } else {
        this.state = state;
      }
    };

    render() {
      const { children, ...props } = this.props;

      return (
        <WrappedComponent {...props} location={this.state.location}>
          {children}
        </WrappedComponent>
      );
    }
  }

  return Component;
};

export default withRoutes;
