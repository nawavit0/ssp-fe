import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import { noop } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Button.scss';

class Button extends React.PureComponent {
  static propTypes = {
    id: pt.string,
    className: pt.string,
    text: pt.string,
    children: pt.node,
    onClick: pt.func,
    color: pt.oneOf(['custom', 'blue', 'red']), // use 'custom' to avoid default value 'blue'
    size: pt.oneOf(['small']),
    outline: pt.bool,
    disable: pt.bool,
    stepCheckout: pt.number,
    optionCheckout: pt.string,
  };

  static defaultProps = {
    id: null,
    color: 'red',
    onClick: noop,
    outline: false,
    disable: false,
  };

  render() {
    const {
      id,
      className,
      text,
      children,
      onClick,
      color,
      size,
      outline,
      disable,
      stepCheckout,
      optionCheckout,
      style,
    } = this.props;
    return (
      <div
        id={id}
        style={style}
        className={cx(s.root, s[color], s[size], className, {
          [s.outline]: outline,
          [s.disableButton]: disable,
        })}
        onClick={disable ? () => {} : onClick}
        data-checkout-step={stepCheckout}
        data-checkout-option={optionCheckout}
      >
        {text || children}
      </div>
    );
  }
}

export default withStyles(s)(Button);
