import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Row.scss';
import pt from 'prop-types';

class Row extends React.PureComponent {
  static propTypes = {
    className: pt.string,
    children: pt.node,
    gutter: pt.number,
  };

  static defaultProps = {
    gutter: 0,
  };

  render() {
    const { children, className, gutter } = this.props;
    const style = {
      marginLeft: -gutter,
      marginRight: -gutter,
    };
    const childrenWithProps = React.Children.map(children, child => {
      if (child !== null) {
        return React.cloneElement(child, { padding: gutter });
      }
    });
    return (
      <div className={cx(s.row, className)} style={style}>
        {childrenWithProps}
      </div>
    );
  }
}

export default withStyles(s)(Row);
