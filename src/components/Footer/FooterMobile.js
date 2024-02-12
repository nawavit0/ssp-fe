import React, { memo } from 'react';
import styled from 'styled-components';
import LazyLoad from 'react-lazyload';
import { withLocales } from '@central-tech/core-ui';
import { Cms } from '../CMSGrapesjsView';
import { SubscriptionMobile } from '../Subscription';

const FooterStyled = styled.div`
  background-color: #fff;
  width: 100%;
`;
const FooterContentStyled = styled.div`
  max-width: ${props => props.theme.container.maxWidth}px;
  width: 100%;
  margin: 0 auto;
`;

const FooterMobile = ({ lang }) => {
  return (
    <FooterStyled>
      <FooterContentStyled>
        <LazyLoad height={67} once>
          <SubscriptionMobile />
          <Cms
            identifier="mobileWeb|FOOTER_CONDITION"
            ssr={false}
            customStyleObject={{ style: 'width: 100%' }}
            hasRenderJs={false}
            replaceHtml={[
              {
                searchValue: 'href="[:changeLanguage:]"',
                newValue: `onclick="handleChangeLanguage('${lang}')"`,
              },
            ]}
          />
          <Cms
            identifier="mobileWeb|FOOTER_SOCIAL"
            ssr={false}
            hasRenderJs={false}
          />
          <Cms
            identifier="mobileWeb|FOOTER_DOWNLOAD"
            ssr={false}
            hasRenderJs={false}
          />
          <Cms
            identifier="mobileWeb|FOOTER_COPY_RIGHT"
            ssr={false}
            hasRenderJs={false}
          />
        </LazyLoad>
      </FooterContentStyled>
    </FooterStyled>
  );
};

export default memo(withLocales(FooterMobile));
