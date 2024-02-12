import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { noop } from 'lodash';
import s from './Input.scss';

class Input extends React.PureComponent {
  static propTypes = {
    wrapperClassName: pt.string,
    className: pt.string,
    inputWrapperClassName: pt.string,
    size: pt.oneOf(['custom', 'medium', 'large']),
    borderRadius: pt.oneOf(['custom', 'small', 'large']),
    before: pt.node,
    after: pt.node,
    placeholder: pt.string,
    value: pt.string,
    maxLength: pt.number,
    onChange: pt.func,
    onPressEnter: pt.func,
    onFocus: pt.func,
    error: pt.bool,
    readonly: pt.bool,
    onRef: pt.func,
    type: pt.string,
    onBlur: pt.func,
    name: pt.string,
    onBlurPressEnter: pt.bool,
    id: pt.string,
  };

  static defaultProps = {
    size: 'medium',
    borderRadius: 'small',
    onPressEnter: noop,
    onFocus: () => {},
    error: false,
    readonly: false,
    onChange: () => {},
    type: 'text',
    value: '',
    onBlur: () => {},
    onBlurPressEnter: false,
    name: '',
    id: '',
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.onPressEnter();
    }
  };

  handleBlurPressEnter = () => {
    if (
      document.documentElement.clientWidth <= 768 &&
      this.props.onBlurPressEnter
    ) {
      this.props.onPressEnter();
    }
  };

  render() {
    const {
      before,
      after,
      wrapperClassName,
      className,
      inputWrapperClassName,
      size,
      borderRadius,
      placeholder,
      value,
      maxLength,
      onChange,
      error,
      readonly,
      lowerContent,
      onRef,
      onFocus,
      type,
      name,
      onBlur,
      isMobile,
      id,
    } = this.props;

    const style = isMobile ? { fontSize: '18px' } : {};

    return (
      <div
        className={cx(s.wrapper, wrapperClassName, {
          [s[size]]: size !== 'custom',
          [s[`borderRadius-${borderRadius}`]]: borderRadius !== 'custom',
          [s.error]: error,
        })}
      >
        <div className={cx(s.inputWrapper, inputWrapperClassName)}>
          {before}
          <input
            style={style}
            ref={onRef}
            className={cx(s.input, s[size], className, {
              [s.error]: error,
            })}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onKeyPress={this.handleKeyPress}
            // onBlurPressEnter={this.handleBlurPressEnter}
            onBlur={onBlur && this.handleBlurPressEnter}
            maxLength={maxLength}
            readOnly={readonly}
            name={name}
            id={id}
          />
          {after}
        </div>
        {lowerContent}
      </div>
    );
  }
}

export default withStyles(s)(Input);
