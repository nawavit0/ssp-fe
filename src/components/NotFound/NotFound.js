import React from 'react';
import pt from 'prop-types';

class NotFound extends React.PureComponent {
  static propTypes = {
    title: pt.string.isRequired,
  };

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>Sorry, the page you were trying to view does not exist.</p>
      </div>
    );
  }
}

export default NotFound;
