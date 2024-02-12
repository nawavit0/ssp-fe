import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Container.scss';

@withStyles(s)
class Container extends React.PureComponent {
  static propTypes = {
    wrapperClassName: pt.string,
    className: pt.string,
    padding: pt.oneOf(['none', 'small', 'medium', 'large']),
    noDesktopPadding: pt.bool,
    noMobilePadding: pt.bool,
    children: pt.node,
    fullScreen: pt.bool,
    isBaseWidth: pt.bool,
    onMouseEnter: pt.func,
    onMouseLeave: pt.func,
  };

  static defaultProps = {
    padding: 'medium',
    noDesktopPadding: false,
    noMobilePadding: false,
    fullScreen: true,
    isBaseWidth: true,
  };

  render() {
    const {
      wrapperClassName,
      className,
      padding,
      noDesktopPadding,
      noMobilePadding,
      fullScreen,
      children,
      isBaseWidth,
      ...props
    } = this.props;
    return (
      <div
        className={cx(s.wrapper, wrapperClassName, {
          [s.fullScreen]: fullScreen,
          [s.notFullScreen]: !fullScreen,
          [s.noDesktopPadding]: noDesktopPadding,
          [s.noMobilePadding]: noMobilePadding,
        })}
      >
        <div
          className={cx(
            { [s.root]: isBaseWidth },
            className,
            s[`padding-${padding}`],
            {
              [s.fullScreen]: fullScreen,
            },
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
}

export default Container;
