import React from 'react';
import { Link } from '@central-tech/core-ui';
import styled from 'styled-components';
import ImageLazy from '../../Image/ImageLazy';
import RenderMiniWishlistQty from '../WishlistQty';
import propTypes from 'prop-types';
import { get } from 'lodash';

const WishlistStyled = styled.div`
  margin: 1px 50px 0px 0px;
  position: relative;
`;
const DesktopOpenWishlist = ({}, { customer }) => {
  const isGuest = !get(customer, 'id', false);
  const guestCartId = get(customer, 'guest.cartId', '');
  if (!isGuest) {
    return (
      <WishlistStyled>
        <Link to={`/account/wishlist`}>
          <RenderMiniWishlistQty
            isGuest={isGuest}
            guestCartId={guestCartId}
            isMobile={false}
          />
          <ImageLazy
            src={'/static/icons/Wishlist.svg'}
            width="35px"
            height="35px"
          />
        </Link>
      </WishlistStyled>
    );
  }
  return (
    <WishlistStyled>
      <Link>
        <ImageLazy
          src={'/static/icons/Wishlist.svg'}
          width="35px"
          height="35px"
        />
      </Link>
    </WishlistStyled>
  );
};

DesktopOpenWishlist.contextTypes = {
  customer: propTypes.object,
};

export default DesktopOpenWishlist;
