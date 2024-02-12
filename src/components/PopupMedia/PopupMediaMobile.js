import React from 'react';
import styled from 'styled-components';
import ImageV2 from '../Image/ImageV2';

const PopupMediaMobile = ({ className, src, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={className} onClick={() => onClose?.()}>
      <button className="close" onClick={() => onClose?.()}>
        <ImageV2
          src="/static/icons/CloseIconMobile.svg"
          height="20"
          width="20"
        />
      </button>
      <div className="media">
        <iframe src={src} allow="autoplay; encrypted-media;" frameborder="0" />
      </div>
    </div>
  );
};

const PopupMediaMobileStyled = styled(PopupMediaMobile)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;

  z-index: 8000;
  background: hsla(0, 0%, 0%, 0.5);

  > .close {
    position: absolute;
    top: 0;
    right: 0;

    border: 0;
    padding: 10px;

    z-index: 8001;
    background-color: transparent;
  }

  > .media {
    margin: auto;
    width: 100%;
    height: 50%;
    min-height: 300px;
    z-index: 8001;

    > iframe {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 100%;
      max-width: 100%;

      object-fit: cover;
      object-position: center;
    }
  }
`;

const MemoPopupMediaMobile = React.memo(PopupMediaMobileStyled);

export {
  MemoPopupMediaMobile as PopupMediaMobile,
  MemoPopupMediaMobile as default,
};
