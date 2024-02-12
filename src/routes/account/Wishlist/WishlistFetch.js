import React from 'react';
import { useWishlist } from './useWishlist';
import WishlistContainer from './wishlistContainer';

const WishlistFetch = ({ isMobile }) => {
  const data = useWishlist();
  const loading = data?.loading || false;
  const wishlistGroupItems = data?.items?.[0]?.items || [];
  const wishlistGroupId = data?.items?.[0]?.wishlist_id || null;
  const wishlistTotal = wishlistGroupItems.length;
  return (
    <WishlistContainer
      loading={loading}
      isMobile={isMobile}
      items={wishlistGroupItems}
      wishlistTotal={wishlistTotal}
      wishlistGroupId={wishlistGroupId}
    />
  );
};

export default WishlistFetch;
