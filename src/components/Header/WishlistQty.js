import { DesktopWishlistQty } from './styled';
import React from 'react';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';
import { useWishlistNotProduct } from '../../routes/account/Wishlist/useWishlist';

const RenderMiniWishlistQty = props => {
  const { isMobile } = props;
  const fetchWishlist = useWishlistNotProduct;
  const wishlistData = fetchWishlist();
  const qty = wishlistData?.items?.[0]?.items?.length || 0;
  if (qty !== 0) {
    return !isMobile ? (
      <DesktopWishlistQty>
        <div
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.VIEW,
            'Wishlist',
            'MainHeader',
          )}
        >
          {qty}
        </div>
      </DesktopWishlistQty>
    ) : null;
  }
  return null;
};

export default RenderMiniWishlistQty;
