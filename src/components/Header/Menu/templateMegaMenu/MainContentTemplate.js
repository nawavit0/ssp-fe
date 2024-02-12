import React from 'react';
import MenuWithCMSTemplate from './MenuWithCMSTemplate';
import MenuSegmentWithCMSTemplate from './MenuSegmentWithCMSTemplate';
import { Cms } from '../../../CMSGrapesjsView';
import { getMenuListBySegment } from '../../../../utils/categories';
import styled from 'styled-components';

const FullCmsStyled = styled.div`
  padding: 20px 40px 20px 40px;
`;

function MainContentTemplate({ type, urlPath, name, menuList, groupSegment }) {
  const cmsType = type ? type.toUpperCase() : '';

  if (type === 'men' || type === 'women') {
    return (
      <MenuWithCMSTemplate
        menuList={menuList}
        column={2}
        leftColumnWidth="30%"
        rightColumntWidth="70%"
        cmsIdentifier={`MEGA_MENU_${cmsType}`}
        type={type}
        urlPath={urlPath}
        name={name}
        isBorder
      />
    );
  } else if (type === 'football') {
    return (
      <MenuWithCMSTemplate
        menuList={menuList}
        column={4}
        leftColumnWidth="70%"
        rightColumntWidth="30%"
        type={type}
        urlPath={urlPath}
        name={name}
        cmsIdentifier={`MEGA_MENU_${cmsType}`}
      />
    );
  } else if (type === 'sports') {
    return (
      <FullCmsStyled>
        <Cms identifier={`MEGA_MENU_${cmsType}`} ssr={false} />
      </FullCmsStyled>
    );
  } else if (type === 'running') {
    const segments = getMenuListBySegment(groupSegment, menuList);
    return (
      <MenuSegmentWithCMSTemplate
        segments={segments}
        type={type}
        urlPath={urlPath}
        name={name}
        cmsIdentifier={`MEGA_MENU_${cmsType}`}
      />
    );
  } else if (type === 'kids') {
    return (
      <MenuWithCMSTemplate
        menuList={menuList}
        column={2}
        leftColumnWidth="50%"
        rightColumntWidth="50%"
        type={type}
        urlPath={urlPath}
        name={name}
        cmsIdentifier={`MEGA_MENU_${cmsType}`}
      />
    );
  } else if (type === 'brands') {
    return (
      <FullCmsStyled>
        <Cms identifier={`MEGA_MENU_BRANDS`} ssr={false} />
      </FullCmsStyled>
    );
  }

  return null;
}

export default MainContentTemplate;
