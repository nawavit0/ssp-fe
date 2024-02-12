import React from 'react';
import pt from 'prop-types';
import { compose } from 'redux';
// import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorPage.scss';
// import { setPageType } from '../../reducers/googleTag/actions';
// import gtmType from '../../constants/gtmType';

class ErrorPage extends React.PureComponent {
  static propTypes = {
    error: pt.shape({
      name: pt.string.isRequired,
      message: pt.string.isRequired,
      stack: pt.string.isRequired,
    }),
  };

  static defaultProps = {
    error: null,
  };

  componentDidMount() {
    // this.props.setPageType(gtmType.OTHER);
  }

  render() {
    if (__DEV__ && this.props.error) {
      return (
        <div>
          <h1>{this.props.error.name}</h1>
          <pre>{this.props.error.stack}</pre>
        </div>
      );
    }

    return (
      <div>
        <h1>Error</h1>
        <p>Sorry, a critical error occurred on this page.</p>
      </div>
    );
  }
}

export { ErrorPage as ErrorPageWithoutStyle };

export default compose(withStyles(s))(ErrorPage);
