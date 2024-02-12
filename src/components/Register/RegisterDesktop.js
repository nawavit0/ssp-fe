import React from 'react';
import { Row, Col } from '@central-tech/core-ui';
import styled from 'styled-components';
import FacebookSection from './FacebookSection';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

const RegisterSection = styled(Row)`
  margin: 46px 0 76px 0;
`;
const Content = styled(Col)`
  text-align: center;
  padding-bottom: 34px;
  ${props =>
    props.lineRight
      ? `
    border-right: 1px solid #ACACAC;
  `
      : ''}
`;
const Section = styled.div`
  width: 100%;
  display: inline-block;
  margin: 0 auto;
  padding: 0 120px;
`;
const Title = styled.p`
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  color: #262626;
  margin: 0 0 15px 0;
`;
const VoucherSection = styled.div`
  display: flex;
  flex-direction: row;
  text-align: left;
  width: 100%;
  margin-bottom: 15px;
  align-items: center;
  min-height: 15px;
  color: #606060;
  font-size: 14px;
  font-weight: 300;
`;
const FormSection = styled.div`
  text-align: left;
  width: 100%;
  display: inline-block;
  margin: 0 auto;
`;
const ImgThe1 = styled.img`
  margin-right: 13px;
`;

const RegisterDesktop = ({ translate, renderRegisForm, renderLoginForm }) => {
  return (
    <RegisterSection>
      <Content md={6} textAlign={'center'} lineRight>
        <Title>{translate('register.create_with_fb')}</Title>
        <Section>
          <FacebookSection
            id={generateElementId(
              ELEMENT_TYPE.BUTTON,
              ELEMENT_ACTION.LOGIN,
              'Facebbook',
              'Register',
            )}
          />
          <VoucherSection>
            <ImgThe1 src="/images/the1.png" width="37" height="36" />
            {translate('register.get_free_voucher')}
          </VoucherSection>
          <FormSection>{renderRegisForm()}</FormSection>
        </Section>
      </Content>
      <Content md={6}>
        <Title>{translate('register.login_to_super_sport_account')}</Title>
        <Section>
          <FacebookSection
            id={generateElementId(
              ELEMENT_TYPE.BUTTON,
              ELEMENT_ACTION.LOGIN,
              'Facebbook',
              'Login',
            )}
          />
          <FormSection>{renderLoginForm()}</FormSection>
        </Section>
      </Content>
    </RegisterSection>
  );
};

export default RegisterDesktop;
