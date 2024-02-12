import React from 'react';
import { Link, withLocales } from '@central-tech/core-ui';
import { string, number } from 'prop-types';
import styled from 'styled-components';
import { Cms } from '../../../CMSGrapesjsView';
import MenuList from './MenuList';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const ContentStyled = styled.div`
  display: flex;
  padding: 20px 40px 0px 40px;
`;
const MenuSectionStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width};
`;
const MenuListStyled = styled.div`
  flex-direction: column;
  column-count: ${props => props.column};
  align-items: flex-start;
  ${props => (props.height ? `height:${props.height}` : '')};
`;
const ColStyled = styled.div`
  width: 100%;
  display: inline-block;
`;
const CmsStyled = styled.div`
  width: 20%;
  line-height: normal;
  margin-left: 30px;
`;
const CustomLinkStyled = styled(Link)`
  color: #191919;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
`;

function MenuSegmentWithCMSTemplate({
  segments,
  column,
  cmsIdentifier,
  translate,
  type,
  urlPath,
  name,
}) {
  return (
    <>
      <ContentStyled>
        <MenuSectionStyled width={'40%'}>
          <CustomLinkStyled
            to={`/${urlPath || ''}`}
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              `All${type}`,
              'MegaMenu',
            )}
          >
            {`${translate('mega_menu.view_all_key_women', {
              category: name?.toUpperCase(),
            })}`}
          </CustomLinkStyled>
          <MenuListStyled column={column}>
            {segments?.women?.length
              ? segments.women.map((menu, index) => (
                  <ColStyled key={index}>
                    <MenuList list={menu} />
                  </ColStyled>
                ))
              : null}
          </MenuListStyled>
        </MenuSectionStyled>
        <MenuSectionStyled width={'40%'}>
          <CustomLinkStyled
            to={`/${urlPath || ''}`}
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              `All${type}`,
              'MegaMenu',
            )}
          >
            {`${translate('mega_menu.view_all_key_men', {
              category: name?.toUpperCase(),
            })}`}
          </CustomLinkStyled>
          <MenuListStyled column={column}>
            {segments?.men?.length
              ? segments.men.map((menu, index) => (
                  <ColStyled key={index}>
                    <MenuList list={menu} />
                  </ColStyled>
                ))
              : null}
          </MenuListStyled>
        </MenuSectionStyled>
        <CmsStyled>
          <Cms identifier={cmsIdentifier} ssr={false} />
        </CmsStyled>
      </ContentStyled>
      {segments?.unisex?.length && (
        <ContentStyled style={{ paddingBottom: '20px' }}>
          <MenuSectionStyled width={'100%'}>
            <CustomLinkStyled
              to={`/${urlPath || ''}`}
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                `All${type}`,
                'MegaMenu',
              )}
            >
              {`${translate('mega_menu.view_all_key', {
                category: name?.toUpperCase(),
                segment: 'UNISEX',
              })}`}
            </CustomLinkStyled>
            <MenuListStyled column={6} height={'215px'}>
              {segments?.unisex?.length
                ? segments.unisex.map((menu, index) => (
                    <ColStyled key={index}>
                      <MenuList list={menu} />
                    </ColStyled>
                  ))
                : null}
            </MenuListStyled>
          </MenuSectionStyled>
        </ContentStyled>
      )}
    </>
  );
}

MenuSegmentWithCMSTemplate.defaultProps = {
  column: 2,
  cmsIdentifier: '',
  type: '',
  name: '',
};
MenuSegmentWithCMSTemplate.propTypes = {
  column: number,
  cmsIdentifier: string,
  type: string,
  name: string,
};

export default withLocales(MenuSegmentWithCMSTemplate);
