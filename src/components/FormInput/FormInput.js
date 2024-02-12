import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import pt from 'prop-types';
import s from './FormInput.scss';

class FormInput extends React.PureComponent {
  static propTypes = {
    name: pt.string.isRequired,
    onChange: pt.func.isRequired,
    className: pt.string,
    maxLength: pt.number,
  };

  static defaultProps = {
    className: '',
  };
  state = {
    shouldShowPass: false,
  };

  render() {
    const { shouldShowPass } = this.state;
    const {
      label,
      required,
      type,
      name,
      maxLength,
      placeholder,
      errorClass,
      successClass,
      wrapperClass,
      info,
      value,
      onChange,
      className,
    } = this.props;

    if (type === 'checkbox') {
      return this.renderCheckBox();
    }

    return (
      <label
        className={cx(successClass, errorClass, wrapperClass, s.formInput)}
      >
        {label || name}
        {required && <span className={s.inputRequired}>*</span>}
        <input
          type={shouldShowPass ? 'text' : type}
          name={name}
          value={value}
          maxLength={maxLength}
          required={required}
          placeholder={placeholder}
          onChange={e => onChange(e)}
          className={cx(className)}
        />
        {type === 'password' && (
          <img
            className={s.icon}
            data-anchor="login-to-member-icon"
            src={
              this.state.shouldShowPass
                ? '/icons/ios-eye.svg'
                : '/icons/ion-eye-disabled.png'
            }
            title="Show Password"
            onClick={() => this.togglePass(shouldShowPass)}
            width="16"
          />
        )}
        {info && (
          <div className={s.showInfo}>
            <img src="/icons/ios-info.svg" className={s.icon} />
            <p>{info}</p>
          </div>
        )}
      </label>
    );
  }

  togglePass(show) {
    this.setState({ shouldShowPass: !show });
  }

  renderCheckBox() {
    const {
      label,
      required,
      name,
      errorClass,
      successClass,
      wrapperClass,
      info,
      value,
      onChange,
    } = this.props;
    return (
      <label
        className={cx(successClass, errorClass, wrapperClass, s.formInput)}
      >
        <input
          type="checkbox"
          name={name}
          checked={value}
          required={required}
          onChange={e => onChange(e)}
        />
        {label || name}
        {required && '*'}
        {info && (
          <div className={s.showInfo}>
            <img src="/icons/ios-info.svg" className={s.icon} />
            <p>{info}</p>
          </div>
        )}
      </label>
    );
  }
}

export default withStyles(s)(FormInput);
