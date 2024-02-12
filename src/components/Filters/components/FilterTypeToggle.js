import React, { useState, memo } from 'react';
import propsType from 'prop-types';
import { Collaspe } from '@central-tech/core-ui';
import styled from 'styled-components';

const WrapperStyled = styled.div`
  position: relative;
  ${props => props.isHideBorder || 'border-bottom: 1px solid #B7B7B7;'}
  ${props => props.isToggle && 'padding-bottom: 16px;'}
`;
const ToggleSectionStyled = styled.div`
  width: 100%;
  padding: 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #1a1b1a;
  position: relative;
  cursor: pointer;
  ${props => props.customStyle || ''}
`;
const ArrowStyled = styled.i`
  border: solid #282828;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  width: 8px;
  height: 8px;
  ${props =>
    props.direction === 'up'
      ? `
      transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);`
      : `
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
    `}
`;
const SelectedResultStyled = styled.div`
  font-size: 13px;
  color: #817e7e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 1024px) {
    padding: 0 15px;
  }
`;
const ClearBtnStyled = styled.button.attrs({ type: 'button' })`
  color: #a9a9a9;
  font-size: 12px;
  position: absolute;
  top: 16px;
  right: 22px;
  z-index: 1;
  border: 0;
  background: none;
`;
const TopStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 1024px) {
    padding: 0 15px;
  }
`;
const CustomContentStyled = styled.div`
  @media (max-width: 1024px) {
    padding: 0 15px;
  }
`;
const FilterTypeToggle = ({
  type,
  children,
  isHideBorder,
  titleList,
  titleText,
  disable,
  onReset,
  customStyle,
  id,
  btnClearId,
}) => {
  const [isToggle, setToggle] = useState(false);
  const titleListDecode =
    titleList && titleList.length
      ? titleList.map(list => decodeURIComponent(list))
      : [];
  const titleTextDecode = titleText ? decodeURIComponent(titleText) : '';

  return disable ? (
    <WrapperStyled isHideBorder={isHideBorder}>
      <ToggleSectionStyled disable={disable} customStyle={customStyle} id={id}>
        <TopStyled>
          {type}
          {children}
        </TopStyled>
        {titleListDecode.length || titleTextDecode ? (
          <SelectedResultStyled>
            {titleTextDecode ? titleTextDecode : titleListDecode.join(', ')}
          </SelectedResultStyled>
        ) : null}
      </ToggleSectionStyled>
    </WrapperStyled>
  ) : (
    <WrapperStyled
      isHideBorder={isHideBorder}
      isToggle={isToggle}
      customStyle={customStyle}
    >
      {isToggle && (
        <ClearBtnStyled id={btnClearId} onClick={onReset}>
          Clear
        </ClearBtnStyled>
      )}
      <ToggleSectionStyled onClick={() => setToggle(!isToggle)} id={id}>
        <TopStyled>
          {type}
          {isToggle ? (
            <ArrowStyled direction="up" />
          ) : (
            <ArrowStyled direction="down" />
          )}
        </TopStyled>
        {(titleListDecode.length || titleTextDecode) && !isToggle ? (
          <SelectedResultStyled>
            {titleTextDecode ? titleTextDecode : titleListDecode.join(', ')}
          </SelectedResultStyled>
        ) : null}
      </ToggleSectionStyled>
      <Collaspe visible={isToggle}>
        <CustomContentStyled>{children}</CustomContentStyled>
      </Collaspe>
    </WrapperStyled>
  );
};

FilterTypeToggle.PropsType = {
  type: propsType.string.isRequired,
  customStyle: propsType.string,
  titleList: propsType.array,
  titleText: propsType.string,
  onReset: propsType.func,
  id: propsType.string,
};
FilterTypeToggle.defaultProps = {
  customStyle: '',
  titleList: [],
  titleText: '',
  onReset: () => null,
  id: '',
  btnClearId: '',
};

export default memo(FilterTypeToggle);
