import React, { memo } from 'react';
import styled from 'styled-components';
import pt from 'prop-types';

const CheckBoxSection = styled.div`
  display: flex;
  align-items: flex-start;
  cursor: pointer;
`;

const Content = styled.span`
  ${props =>
    props.isContent
      ? `
    color: #535252;
    font-size: 16px;
    margin-left: 9px;
    font-weight: 300;
  `
      : ''}
  ${props => props.customStyle || ''}
`;
const IconWrapper = styled.div`
  flex: 0 0 ${props => props.height || '23px'};
  justify-content: flex-start;
  img {
    display: block;
    border-radius: 3px;
  }
`;
const CheckedEl = styled.div`
  width: ${props => props.width || '23'}px;
  height: ${props => props.height || '23'}px;
  border: 1px solid #9b9b9b;
  flex-basis: ${props => props.height || '23'}px;
  border-radius: 3px;
  ${props =>
    props.checked
      ? ` background-position: center;
      background-size: 100%;
      background: url('/icons/ic-check-red.png') no-repeat;
      ${
        props.color === 'blue'
          ? `
        background: url('/icons/ic-check-blue.svg') no-repeat;
        border: none;
        background-size: 100%; `
          : ''
      }
      ${
        props.color === 'red'
          ? `
        background: url('/icons/ic-check-red.png') no-repeat; `
          : ''
      }
      ${
        props.color === 'black'
          ? `
        background: url('/icons/ic-check-black.png') no-repeat;`
          : ''
      } 

  `
      : ''}
  ${props => props.customStyle || ''}
`;

const Checkbox = ({
  checked,
  className,
  onClick,
  content,
  colors,
  customStyle,
  customContentStyle,
  width,
  height,
  id,
  ...rest
}) => {
  return (
    <CheckBoxSection className={className} onClick={onClick} {...rest}>
      <IconWrapper height={height}>
        <CheckedEl
          checked={checked}
          color={colors}
          id={id}
          width={width}
          height={height}
          customStyle={customStyle || ''}
        />
      </IconWrapper>
      <Content isContent={!!content} customStyle={customContentStyle}>
        {content}
      </Content>
    </CheckBoxSection>
  );
};

Checkbox.propTypes = {
  checked: pt.bool.isRequired,
  onClick: pt.func,
  className: pt.string,
  colors: pt.string,
  content: pt.oneOfType([pt.string, pt.node]),
  customStyle: pt.string,
  customContentStyle: pt.string,
};

Checkbox.defautProps = {
  customContentStyle: '',
  customStyle: '',
  content: '',
  onClick: () => {},
};

export default memo(Checkbox);
