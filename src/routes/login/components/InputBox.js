import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';

const InputInfoStyled = styled.div`
  display: grid;
  grid-template-column: repeat(2, 1fr);
`;
const LabelStyled = styled.p`
  margin-bottom: 5px;
  grid-column: 1 / 2;
  color: #535252;
`;
const LabelRedStyled = styled.span`
  color: #ff4242;
`;
const ErrorMessageStyled = styled.div`
  grid-column: 2 / 3;
  text-align: right;
  color: red;
  margin: 16px 0 5px;
`;
const InputAreaStyled = styled.div`
  position: relative;
`;
const InputStyled = styled.input`
  width: 100%;
  font-size: 16px;
  padding: 10px;
  border-style: solid;
  border-color: ${props => props.borderColor || 'b8b8b8'};
  border-width: 1px;
  font-weight: 300;
  line-height: 1.5;

  &::placeholder {
    color: #b7b7b7;
  }
`;
const ShowPasswordStyled = styled.img`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
`;

const InputBox = ({
  id,
  type,
  label,
  placeholder,
  translate,
  handleInputChange,
  errorMessage,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(type === 'password');
  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };
  const generateInputBoxType = () => {
    if (type === 'password') {
      return !showPassword ? 'text' : 'password';
    }
    return type;
  };
  return (
    <Fragment>
      <InputInfoStyled>
        <LabelStyled>
          {label} <LabelRedStyled>*</LabelRedStyled>
        </LabelStyled>
        <ErrorMessageStyled>{'' || errorMessage}</ErrorMessageStyled>
      </InputInfoStyled>
      <InputAreaStyled>
        {type === 'password' ? (
          <ShowPasswordStyled
            type="button"
            onClick={() => handleShowPasswordClick()}
            src={
              showPassword
                ? '/icons/ion-eye-disabled.png'
                : '/icons/ios-eye.svg'
            }
          />
        ) : null}
        <InputStyled
          type={generateInputBoxType()}
          placeholder={placeholder}
          onChange={e => handleInputChange(e, translate, id)}
          borderColor={!errorMessage ? 'f8f8f8' : 'red'}
          value={value || ''}
        />
      </InputAreaStyled>
    </Fragment>
  );
};

export default withLocales(InputBox);
