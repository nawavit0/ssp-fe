import React from 'react';
import styled from 'styled-components';
import FacebookSection from './FacebookSection';

const RegisterSection = styled.div`
  border: 1px solid #000;
  min-height: 50px;
`;

const RegisterMobile = () => {
  return (
    <RegisterSection>
      <FacebookSection />
    </RegisterSection>
  );
};

export default RegisterMobile;
