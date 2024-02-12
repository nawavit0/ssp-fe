import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';

const FormGroupLink = styled.div`
  margin: 8px 0;
  text-align: right;
  &:hover {
    color: #333333;
    transition: 0.3s;
  }
  ${props => props.istextCenter && 'text-align: center;'}
`;

const ForgetPasswordLink = styled(Link)`
  text-decoration: underline !important;
  font-size: ${props => props.fontSize || '13'}px;
  font-weight: 300;
`;
const MiniLoginSection = styled.div`
  color: #333333;
  line-height: 1.8;
  border-radius: 2px;
  box-shadow: 0 4px 20px 0 #393939;
  background-color: #ffffff;
  border: solid 1px #f7f9fb;
  z-index: 6;
  width: 358px;
  position: absolute;
  right: 20px;
  padding: 0 20px 40px 20px;
`;
const RegisterLoginSection = styled.div`
  position: relative;
  width: 100%;
  color: #333333;
  line-height: 1.8;
  background-color: #ffffff;
`;
const CheckboxSection = styled.div`
  display: flex;
  float: left;
  align-items: center;
`;

const TitleMiniLogin = styled.p`
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  text-align: center;
  color: #262626;
  margin: 30px 0 16px 0;
`;
const TitleInput = styled.div`
  font-size: ${props => props.fontSize || '16'}px;
  color: ${props => props.color || '#535252'};
  font-weight: ${props => props.fontWeight || '400'};
  display: inline-block;
`;
const InputForm = styled.input`
  box-sizing: border-box;
  height: 48px;
  border: 1px solid #a5a5a5;
  background-color: #ffffff;
  margin-bottom: 10px;
  &::placeholder {
    color: #b7b7b7;
  }
  ${props =>
    props.isError
      ? `
    border: 1px solid #ed1f1f;
  `
      : ''}
  ${props => props.customStyle || ''}
`;
const LabelInputSection = styled.div`
  display: block;
  position: relative;
  margin: ${props => props.margin || '0'};
  clear: both;
`;
const ErrorSection = styled.div`
  display: inline-block;
  position: absolute;
  right: 0;
  bottom: 0;
  color: #ed1f1f;
  line-height: 1.3;
  font-size: 12px;
  margin-top: 5px;
`;
const IconShowPassword = styled.img`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-1px);
  width: 16px;
  height: 16px;
  ${props =>
    props.isRegister
      ? `
    top: 60%;
    `
      : ''}
`;

const FormLogin = styled.form`
  .formGroup {
    position: relative;
  }
  .formGroup input {
    height: 36px;
    font-size: 14px;
    padding: 0 10px;
    width: 100%;
  }

  .formGroup img {
    width: 24px;
    margin: 3px 0;
  }
  .formGroup > .registerButton {
    width: 100%;
    height: 36px;
    border-radius: 2px;
    background-color: #79e71c;
    color: #06183d;
    font-weight: bold;
    cursor: pointer;
    font-size: 16px;
    text-transform: uppercase;
    &:hover {
      transition: 0.3s;
    }
  }
  .formGroup > .submitButton:disabled {
    opacity: 0.5;
  }
  .formGroup > .iconShow {
    position: absolute;
    right: 10px;
    top: 60%;
    transform: translateY(-1px);
    width: 16px;
    height: 16px;
  }
  .formGroup > .notMemberText {
    color: #393838;
    margin: 15px 0 0 0;
    font-size: 12px;
  }
  .formGroup > .validateAlert {
    color: #ed1f1f;
  }

  .formGroup > .validateInput {
    border: 1px solid #ed1f1f;
  }
  ${props => props.customStyle || ''};
`;

const CustomButton = styled.button`
  width: ${props => (props.width ? props.width : '100%')};
  height: ${props => (props.height ? props.height : '42px')};
  font-size: ${props => (props.fontSize ? props.fontSize : '18')}px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#13283F'};
  border: ${props => (props.border ? props.border : 'none')};
  margin: ${props => (props.margin ? props.margin : '7px 0 0 0')};
  border-radius: 2px;
  color: ${props => (props.color ? props.color : '#FFFFFF')};
  font-weight: bold;
  cursor: pointer;
  &:hover {
    transition: 0.3s;
  }
`;

const Require = styled.span`
  color: #ed1f1f;
`;

export {
  ForgetPasswordLink,
  MiniLoginSection,
  CheckboxSection,
  TitleMiniLogin,
  TitleInput,
  InputForm,
  LabelInputSection,
  ErrorSection,
  IconShowPassword,
  RegisterLoginSection,
  FormLogin,
  FormGroupLink,
  Require,
  CustomButton,
};
