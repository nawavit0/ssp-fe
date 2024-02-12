import React from 'react';
import styled from 'styled-components';
import { setPopupLoginDesktopOpen } from '../../../../../reactReducers/actions';
import { useStore } from '../../../../../reactReducers/store';

const HeartIconStyled = styled.img`
  height: 69px;
  width: 100%;
  padding: 10px;
  border: 1px solid #b7b7b7;
  cursor: pointer;
`;

const WishlistProductDesktop = ({
  isGuest,
  isWishlist,
  handleWishlistModal,
}) => {
  const [, dispatch] = useStore();

  if (isGuest) {
    return (
      <HeartIconStyled
        onClick={() => dispatch(setPopupLoginDesktopOpen())}
        src="/static/icons/HeartGray-01.svg"
      />
    );
  }
  if (isWishlist) {
    return (
      <HeartIconStyled
        onClick={() => handleWishlistModal()}
        src="/static/icons/HeartRed.svg"
      />
    );
  }
  return (
    <HeartIconStyled
      onClick={() => handleWishlistModal()}
      src="/static/icons/HeartGray-01.svg"
    />
  );
};

export default WishlistProductDesktop;
