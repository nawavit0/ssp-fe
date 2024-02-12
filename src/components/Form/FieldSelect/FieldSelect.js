import React from 'react';
import cx from 'classnames';
import s from './FieldSelect.scss'; // eslint-disable-line css-modules/no-unused-class
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IosArrowDown from 'react-ionicons/lib/IosArrowDown';

const FieldSelect = ({
  input,
  label,
  subLabel,
  className,
  children,
  msgError,
  meta: { touched, error },
  isRequire,
  ...rest
}) => {
  return (
    <div className={cx(s.root, className)}>
      <div className={s.label}>
        <p>
          {label} {isRequire && <span className={s.requireField}>*</span>}{' '}
          {subLabel && <span className={s.subLabel}>{subLabel}</span>}
        </p>
        {touched && error && (
          <div className={cx(s.validateAlert)}>{msgError(error)}</div>
        )}
      </div>
      <div className={s.selectContainer}>
        <select
          {...input}
          className={cx(s.inputField, {
            [s.validatedInput]: touched && error,
            [s.disabled]: rest.disabled,
          })}
          {...rest}
        >
          {rest.placeholder && <option value="">{rest.placeholder}</option>}
          {children}
        </select>

        <span className={s.arrowRight}>
          <IosArrowDown icon="ios-arrow-down" fontSize="16px" color="#333333" />
        </span>
      </div>
    </div>
  );
};

export default withStyles(s)(FieldSelect);
