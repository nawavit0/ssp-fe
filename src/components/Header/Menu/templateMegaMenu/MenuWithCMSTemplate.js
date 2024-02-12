import React from 'react';
import { Link, withLocales } from '@central-tech/core-ui';
import { array, string, number } from 'prop-types';
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
  padding: 20px 40px 20px 40px;
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
`;
const ColStyled = styled.div`
  width: 100%;
  display: inline-block;
`;
const CmsStyled = styled.div`
  width: ${props => props.width};
  line-height: normal;
  margin-left: 30px;
`;
const CustomLinkStyled = styled(Link)`
  color: #191919;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 10px;
`;

function MenuWithCMSTemplate({
  leftColumnWidth,
  rightColumntWidth,
  menuList,
  column,
  cmsIdentifier,
  translate,
  type,
  urlPath,
  name,
}) {
  return (
    <ContentStyled>
      <MenuSectionStyled width={leftColumnWidth}>
        <CustomLinkStyled
          to={`/${urlPath || ''}`}
          id={generateElementId(
            ELEMENT_TYPE.LINK,
            ELEMENT_ACTION.VIEW,
            `All${type}`,
            'MegaMenu',
          )}
        >
          {`${translate('mega_menu.view_all')} ${name?.toUpperCase()}`}
        </CustomLinkStyled>
        <MenuListStyled column={column}>
          {menuList.length
            ? menuList.map((menu, index) => (
                <ColStyled key={index}>
                  <MenuList list={menu} />
                </ColStyled>
              ))
            : null}
        </MenuListStyled>
      </MenuSectionStyled>
      <CmsStyled width={rightColumntWidth}>
        <Cms identifier={cmsIdentifier} ssr={false} />
      </CmsStyled>
    </ContentStyled>
  );
}
MenuWithCMSTemplate.defaultProps = {
  menuList: [],
  column: 1,
  leftColumnWidth: '30%',
  rightColumntWidth: '70%',
  cmsIdentifier: '',
  type: '',
  name: '',
};
MenuWithCMSTemplate.propTypes = {
  menuList: array,
  leftColumnWidth: string,
  rightColumntWidth: string,
  column: number,
  cmsIdentifier: string,
  type: string,
  name: string,
};

export default withLocales(MenuWithCMSTemplate);
