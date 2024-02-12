import React, { useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import s from './FieldInput.scss'; // eslint-disable-line css-modules/no-unused-class
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const ShowPasswordStyled = styled.img`
  position: absolute;
  right: 10px;
  top: 34px;
  width: 20px;
`;
const FieldInput = ({
  input,
  label,
  subLabel,
  type,
  className,
  staticError,
  msgError,
  showPasswordEye = false,
  meta: { touched, error },
  isRequire,
  ...rest
}) => {
  const [showPasswordFlag, setShowPasswordFlag] = useState(true);
  const handleShowPasswordClick = () => {
    setShowPasswordFlag(!showPasswordFlag);
  };
  let convertedType = type;
  if (type === 'password') {
    convertedType = showPasswordFlag ? type : 'text';
  }
  switch (type) {
    case 'radio':
      return (
        <div className={cx(s.root, s.checkbox, className)}>
          <label>
            <input {...input} type={type} className={`input-radio`} {...rest} />
            <div
              className={`${cx(s.label, {
                [s.disabled]: rest.disabled,
              })} input-ratio-label`}
            >
              {label}{' '}
              {subLabel && <span className={s.subLabel}>{subLabel}</span>}
            </div>
          </label>
          {touched && error && (
            <div className={cx(s.validateAlert)}>{msgError(error)}</div>
          )}
        </div>
      );
      break;
    case 'checkbox':
      return (
        <div className={cx(s.root, s.checkbox, className)}>
          <label>
            <input
              {...input}
              type={type}
              className={cx(s.inputField, {
                [s.validatedInput]: touched && error,
                [s.disabled]: rest.disabled,
              })}
              {...rest}
            />
            <div
              className={`${cx(s.label, {
                [s.disabled]: rest.disabled,
              })} input-checkbox-label`}
            >
              {label}{' '}
              {subLabel && <span className={s.subLabel}>{subLabel}</span>}
            </div>
          </label>
          {touched && error && (
            <div className={cx(s.validateAlert)}>{msgError(error)}</div>
          )}
        </div>
      );
      break;
    case 'textarea':
      return (
        <div className={cx(s.root)}>
          <div className={s.label}>
            {label} {subLabel && <span className={s.subLabel}>{subLabel}</span>}
          </div>
          <textarea
            {...input}
            className={cx(s.inputField, s.textAreaField, className, {
              [s.validatedInput]: touched && error,
              [s.disabled]: rest.disabled,
            })}
            {...rest}
          >
            {input.value}
          </textarea>
          {touched && error && (
            <div className={cx(s.validateAlert)}>{msgError(error)}</div>
          )}
        </div>
      );
      break;
    default:
      return (
        <div className={`${cx(s.root, className)}`}>
          <div className={`${s.label} input-label`}>
            <p>
              {label} {isRequire && <span className={s.requireField}>*</span>}{' '}
              {subLabel && <span className={s.subLabel}>{subLabel}</span>}
            </p>
            {touched && error && (
              <div className={cx(s.validateAlert)}>{msgError(error)}</div>
            )}
          </div>
          <input
            {...input}
            type={convertedType}
            className={`${cx(s.inputField, {
              [s.validatedInput]: touched && (error || staticError),
              [s.disabled]: rest.disabled,
            })} input-box`}
            {...rest}
          />
          {showPasswordEye ? (
            <ShowPasswordStyled
              type="button"
              onClick={() => handleShowPasswordClick()}
              src={
                showPasswordFlag
                  ? '/icons/ion-eye-disabled.png'
                  : '/icons/ios-eye.svg'
              }
            />
          ) : null}
          {staticError && (
            <div className={cx(s.validateAlert)}>{staticError}</div>
          )}
        </div>
      );
      break;
  }
};

export default withStyles(s)(FieldInput);
