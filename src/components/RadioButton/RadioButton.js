import React from 'react';
import styled from 'styled-components';

const LabelRadio = styled.label`
  display: inline-block;
  color: #535252;
  font-size: 16px;
  font-weight: 400;
  line-height: 0;
  position: relative;
  ${props => (props.customLabel ? props.customLabel : '')}
`;
const RadioInput = styled.input`
  opacity: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
`;
const RadioCycle = styled.div`
  border-radius: 100%;
  margin-right: 19px;
  width: 19px;
  height: 19px;
  line-height: 15px;
  display: inline-block;
  vertical-align: middle;
  text-align: center;

  ${props =>
    props.isChecked
      ? `
    border: 2px solid #828282;
    background-color: #DDDDDD;
    &:after {
      content: ' ';
      display: inline-block;
      width: 9px;
      height: 9px;
      background-color: #555555;
      border-radius: 100%;
    }
   `
      : `
    border: 1px solid #CCCCCC;
    background-color: #F1F1F1;
   `}
`;

const RadioButton = ({
  input: { name, value = 'male', ...input },
  id,
  label = '',
  customLabel,
  ...rest
}) => {
  const { checked } = { ...rest };
  return (
    <LabelRadio htmlFor={id} customLabel={customLabel}>
      <RadioCycle isChecked={!!checked} />
      <RadioInput
        type="radio"
        value={value || ''}
        name={name}
        id={id}
        {...input}
        {...rest}
      />
      {label}
    </LabelRadio>
  );
};

RadioButton.defaultProps = {
  id: '',
  input: {
    name: 'name_testing',
    msgError: '',
    value: '',
  },
};

export default RadioButton;
