import React from 'react';
import styled from 'styled-components';

const CheckBoxStyled = styled.label`
  font-size: 14px;
  color: #7e7e7e;
  display: flex;
  margin-bottom: 20px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  ${props => props.customCheckboxStyle || ''}
`;
const CheckBoxButtonStyled = styled.input`
  width: ${props => props.width};
  height: ${props => props.height};
  outline: 1px solid ${props => (props.disabled ? '#e6e6e6' : '#4A90E2')};
  display: inline-block;
  transform: translateY(0px);
  background: #fff;
  border: none;
  &:checked {
    background: none;
  }
`;
const IconStyled = styled.svg`
  position: absolute;
  fill: none;
  stroke: #4a90e2;
  stroke-width: 3px;
  width: ${props => props.width};
  height: ${props => props.height};
  margin-left: 3px;
  margin-top: 3px;
  flex: 1;
  display: ${props => (props.checked ? 'block' : 'none')};
  ${props => props.customIconStyle || ''}
`;
const LabelStyled = styled.p`
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  display: inline-block;
  flex: 1;
  margin-top: 3px;
  color: #3e3e3e;
  font-weight: bold;
  font-size: ${props => (props.isMobile ? '13px' : '14px')};
  margin-left: 10px;
  ${props => props.customLabelStyles || ''}
`;
const CheckBoxV2 = ({
  label,
  isMobile,
  customLabelStyles = '',
  width = '16px',
  height = '16px',
  disabled,
  input,
  customIconStyle,
  customCheckboxStyle,
  ...rest
}) => {
  return (
    <CheckBoxStyled
      disabled={disabled}
      customCheckboxStyle={customCheckboxStyle}
    >
      <IconStyled
        disabled={disabled}
        viewBox="0 0 24 24"
        width={width}
        height={height}
        checked={input?.checked}
        customIconStyle={customIconStyle}
      >
        <polyline points="20 6 9 17 4 12" />
      </IconStyled>
      <CheckBoxButtonStyled
        type="checkbox"
        isMobile={isMobile}
        width={width}
        height={height}
        disabled={disabled ? 'disabled' : ''}
        readOnly
        {...input}
        {...rest}
      />
      <LabelStyled
        customLabelStyles={customLabelStyles}
        isMobile={isMobile}
        disabled={disabled}
      >
        {label}
      </LabelStyled>
    </CheckBoxStyled>
  );
};

export default CheckBoxV2;
