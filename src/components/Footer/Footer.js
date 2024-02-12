import React, { memo } from 'react';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';
import { Cms } from '../CMSGrapesjsView';
import { SubscriptionDesktop } from '../Subscription';

const FooterStyled = styled.div`
  background-color: #fff;
  width: 100%;
  @media print {
    display: none;
  }
`;
const FooterContentStyled = styled.div`
  max-width: ${props => props.theme.container.maxWidth}px;
  width: 100%;
  margin: 0 auto;
  a.text-link {
    min-width: 10px !important;
  }
  h4,
  a.text-link {
    text-decoration: none;
    position: relative;
    display: inline-block;
    &:after {
      content: '';
      position: absolute;
      left: 0;
      display: inline-block;
      height: 1em;
      width: 100%;
      border-bottom: 1px solid;
      margin-top: 7px;
      opacity: 0;
      -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
      transition: opacity 0.35s, transform 0.35s;
      -webkit-transform: scale(0, 1);
      transform: scale(0, 1);
    }
    &:hover {
      color: #888888 !important;
      &:after {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1);
        color: ${props => props.theme.color.defaultSsp};
      }
    }
  }
`;
const FooterConditionStyled = styled.div`
  margin: 40px 0 0 0;
  display: flex;
`;
const FooterCopyrightStyled = styled.div`
  display: flex;
`;

const Footer = () => {
  return (
    <FooterStyled>
      <FooterContentStyled>
        <LazyLoad height={67} once>
          <SubscriptionDesktop />
          <Cms identifier="FOOTER_WHY_US" ssr={false} />
          <FooterConditionStyled>
            <Cms
              identifier="FOOTER_CONDITION"
              ssr={false}
              customStyleObject={{ style: 'width: 85%' }}
            />
            <Cms
              identifier="FOOTER_DOWNLOAD"
              ssr={false}
              customStyleObject={{ style: 'width: 15%' }}
            />
          </FooterConditionStyled>
          <FooterCopyrightStyled>
            <Cms
              identifier="FOOTER_COPY_RIGHT"
              ssr={false}
              customStyleObject={{ style: 'width: 70%' }}
            />
            <Cms
              identifier="FOOTER_SOCIAL"
              ssr={false}
              customStyleObject={{ style: 'width: 30%' }}
            />
          </FooterCopyrightStyled>
        </LazyLoad>
      </FooterContentStyled>
    </FooterStyled>
  );
};

export default memo(Footer);
