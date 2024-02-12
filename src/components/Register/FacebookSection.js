import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';
import FacebookLogin from '../FacebookLogin/FacebookLoginButton';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;
const BreakSection = styled.div`
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: normal;
  color: #535252;
  margin: 28px 0 10px 0;
  ${props => props.customBreakSection || ''};
`;
const Line = styled.div`
  border-bottom: 1px solid #aaaaaa;
  display: inline-block;
  opacity: 0.9;
  width: 100%;
  height: 1px;
  ${props => (props.margin ? `margin: ${props.margin};` : '')}
  margin-top: 8px;
  ${props => props.customBreakLine || ''};
`;
const FBButton = styled(FacebookLogin)`
  margin: 0 auto;
  font-weight: bold;
  ${props => props.customStyle || ''};
`;

const FacebookSection = ({
  translate,
  id,
  customStyle,
  customBreakSection,
  customBreakLine,
  ...rest
}) => {
  return (
    <Section>
      <FBButton id={id} customStyle={customStyle} {...rest}>
        {translate('register.button_facebook')}
      </FBButton>
      <BreakSection customBreakSection={customBreakSection}>
        <Line margin="0 41px 0 0" customBreakLine={customBreakLine} />
        {translate('register.label_or') &&
          translate('register.label_or').toUpperCase()}
        <Line margin="0 0 0 41px" />
      </BreakSection>
    </Section>
  );
};

FacebookSection.defaultProps = {
  translate: () => {},
  customStyle: '',
  customBreakSection: '',
  customBreakLine: '',
};

export default withLocales(FacebookSection);
