import React from 'react';
import styled from 'styled-components';

const WishlistProductMobile = ({
  className,
  translate,
  isGuest,
  isWishlist,
  handleWishlistModal,
  addToWishListStatus,
}) => {
  if (isGuest) {
    return (
      <div className={className}>
        <label onClick={() => handleWishlistModal()}>
          <img className="heart-icon" src="/static/icons/HeartGray-01.svg" />
          <span>
            {addToWishListStatus || translate('product_detail.add_to_wishlist')}
          </span>
        </label>
      </div>
    );
  }
  if (
    isWishlist ||
    addToWishListStatus === translate('product_detail.added_to_wishlist')
  ) {
    return (
      <div className={className}>
        <label onClick={() => handleWishlistModal()}>
          <img className="heart-icon" src="/static/icons/HeartRed.svg" />
          <span>
            {addToWishListStatus ||
              translate('product_detail.added_to_wishlist')}
          </span>
        </label>
      </div>
    );
  }
  return (
    <div className={className}>
      <label onClick={() => handleWishlistModal()}>
        <img className="heart-icon" src="/static/icons/HeartGray-01.svg" />
        <span>
          {addToWishListStatus || translate('product_detail.add_to_wishlist')}
        </span>
      </label>
    </div>
  );
};

const StyledWishlistProductMobile = styled(WishlistProductMobile)`
  border-bottom: 1px solid #e3e1e1;
  display: flex;
  padding: 10px 14px 8px 14px;
  span {
    font-size: 10px;
    font-weight: bold;
    color: #787878;
    line-height: normal;
    align-self: center;
  }
  .heart-icon {
    width: 24px;
    height: 21px;
    cursor: pointer;
    margin-right: 8px;
  }
`;

const MemoWishlistProductMobile = React.memo(StyledWishlistProductMobile);

export {
  MemoWishlistProductMobile as WishlistProductMobile,
  MemoWishlistProductMobile as default,
};
