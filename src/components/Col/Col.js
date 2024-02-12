import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Col.scss';
import pt from 'prop-types';

class Col extends React.PureComponent {
  static propTypes = {
    lg: pt.number,
    md: pt.number,
    sm: pt.number,
    padding: pt.oneOfType([pt.number, pt.string]),
    className: pt.string,
    children: pt.node,
    width: pt.string,
  };

  static defaultProps = {
    padding: '0px',
  };

  render() {
    const { lg, md, sm, padding, children, className, width } = this.props;
    let paddingToUse;
    if (typeof padding === 'number') {
      paddingToUse = `${padding}px`;
    } else {
      paddingToUse = padding;
    }
    const style = {
      paddingLeft: paddingToUse,
      paddingRight: paddingToUse,
      width,
    };

    return (
      <div
        className={cx(
          s.col,
          className,
          s[`sm${sm}`],
          s[`md${md}`],
          s[`lg${lg}`],
        )}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default withStyles(s)(Col);
