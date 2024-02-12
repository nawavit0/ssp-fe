import React, { useState } from 'react';
import proptypes from 'prop-types';
import styled from 'styled-components';
import 'lazysizes';

function handleImageLoaded(setIsLoaded) {
  setIsLoaded(1);
}

function handleImageErrored(setIsLoaded) {
  setIsLoaded(-1);
}

const Image = props => {
  const {
    dataSrc,
    isLoaded,
    setIsLoaded,
    defaultImage,
    className,
    srcLazyLoad,
  } = props;
  if (srcLazyLoad) {
    return (
      <img
        data-flickity-lazyload={srcLazyLoad}
        className={`lazyload ${className}`}
        onLoad={handleImageLoaded.bind(this, setIsLoaded)}
        onError={handleImageErrored.bind(this, setIsLoaded)}
      />
    );
  }
  let src = dataSrc;
  if (isLoaded === -1) {
    src = defaultImage;
  }
  return (
    <img
      data-src={src}
      className={`lazyload ${className}`}
      onLoad={handleImageLoaded.bind(this, setIsLoaded)}
      onError={handleImageErrored.bind(this, setIsLoaded)}
    />
  );
};

const ImageStyled = styled(Image)`
  max-width: 100%;
  opacity: 0;
  transition: opacity 450ms ease;
  ${props => (props.isLoaded ? `opacity: 1;` : '')};
  ${props => (props.width ? `width: ${props.width};` : '')};
  ${props => (props.height ? `height: ${props.height};` : '')};
  ${props => props.customStyle || ''}
`;
const ImageLazy = ({
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
  const [isLoaded, setIsLoaded] = useState(0);
  const customClassName = className ? `${className} ` : '';
  return (
    <ImageStyled
      defaultImage={`/static/images/DefaultImage.jpg`}
      className={`${customClassName}imageV2`}
      dataSrc={src}
      srcLazyLoad={srcLazyLoad}
      lazyload={lazyload}
      setIsLoaded={setIsLoaded}
      isLoaded={isLoaded}
      width={width}
      height={height}
      id={id}
      customStyle={customStyle}
      onClick={onClick}
    />
  );
};

ImageLazy.proptypes = {
  width: proptypes.string,
  height: proptypes.string,
};
ImageLazy.defaultProps = {
  src: '/static/images/DefaultImage.jpg',
  width: '',
  height: '',
  customStyle: '',
  id: '',
  onClick: () => null,
};

export default ImageLazy;
