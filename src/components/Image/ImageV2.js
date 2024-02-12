import React from 'react';
import proptypes from 'prop-types';
import { Image } from '@central-tech/core-ui';
import styled from 'styled-components';

const ImageStyled = styled(Image)`
  max-width: 100%;
  ${props => (props.width ? `width: ${props.width};` : '')};
  ${props => (props.height ? `height: ${props.height};` : '')};
  ${props => props.customStyle || ''}
`;
const ImageV2 = ({
  className = '',
  srcLazyLoad,
  src,
  lazyload = false,
  width,
  height,
  id,
  customStyle,
  onClick,
}) => {
  const customClassName = className ? `${className} ` : '';
  return (
    <ImageStyled
      defaultImage={`/static/images/DefaultImage.jpg`}
      className={`${customClassName}imageV2`}
      src={src}
      data-flickity-lazyload={srcLazyLoad}
      lazyload={lazyload}
      width={width}
      height={height}
      id={id}
      customStyle={customStyle}
      onClick={onClick}
    />
  );
};

ImageV2.proptypes = {
  width: proptypes.string,
  height: proptypes.string,
};
ImageV2.defaultProps = {
  src: '/static/images/DefaultImage.jpg',
  width: '',
  height: '',
  customStyle: '',
  id: '',
  onClick: () => null,
};

export default ImageV2;
