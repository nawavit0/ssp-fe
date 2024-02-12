import React from 'react';
import styled from 'styled-components';
import { withLocales, Link } from '@central-tech/core-ui';
import WishlistItemMobile from './components/WishlistItemMobile';
import ImageV2 from '../../../../../components/Image/ImageV2';

import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../../utils/generateElementId';

const WishlistMobile = ({
  className,
  items,
  wishlistTotal,
  imageUrl,
  handleAddToCart,
  handleAddAllToCart,
  handleDeleteFromWishlist,
  addedWishlistStatus,
  addedAllWishlistStatus,
  translate,
}) => {
  const itemSalable = items.filter(
    item => item?.product?.extension_attributes?.salable,
  );
  const canAddAll = itemSalable.length > 0;
  return (
    <div className={className}>
      <div
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'TotalQty',
          'WishlistSummaryMobile',
        )}
        className="number"
      >
        {`(${wishlistTotal} ${
          wishlistTotal > 1
            ? translate('account_wishlist.items')
            : translate('account_wishlist.item')
        })`}
      </div>
      {wishlistTotal > 0 && (
        <>
          {items.map((item, index) => (
            <WishlistItemMobile
              translate={translate}
              imageUrl={imageUrl}
              item={item}
              itemIndex={index}
              handleAddToCart={handleAddToCart}
              handleDeleteFromWishlist={handleDeleteFromWishlist}
              addedStatus={
                addedWishlistStatus &&
                addedWishlistStatus === item?.wishlist_item_id
              }
            />
          ))}
          <button
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              'ContinueShopping',
              'WishlistSummaryMobile',
            )}
            className={`add-all ${!canAddAll && 'disabled'}`}
            onClick={() => handleAddAllToCart(itemSalable)}
            disabled={!canAddAll || addedAllWishlistStatus}
          >
            {addedAllWishlistStatus
              ? translate('account_wishlist.added_all_items_to_bag')
              : translate('account_wishlist.add_all_items_to_bag')}
          </button>
        </>
      )}
      {wishlistTotal <= 0 && (
        <div className="empty">
          <ImageV2
            className="heart-image"
            src="/static/icons/HeartGray-01.svg"
          />
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'EmptyQuote1',
              'WishlistSummaryMobile',
            )}
            className="quote-empty"
          >
            {translate('account_wishlist.empty_wishlist')}
          </div>
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'EmptyQuote2',
              'WishlistSummaryMobile',
            )}
            className="quote-simply"
          >
            {translate('account_wishlist.simply_click')}
            <ImageV2 src="/static/icons/HeartGray-01.svg" />
            {translate('account_wishlist.icon_to_save')}
          </div>
          <Link
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              'ContinueShopping',
              'WishlistSummaryMobile',
            )}
            className="shopping"
            to={'/'}
          >
            {translate('account_wishlist.go_shopping')}
          </Link>
        </div>
      )}
    </div>
  );
};

const StyledWishlistMobile = styled(withLocales(WishlistMobile))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  > .number {
    color: #9b9b9b;
    margin: 15px 0 15px;
  }

  > .add-all {
    background: #78e723;
    color: #13283f;
    width: 100%;
    cursor: pointer;
    font-size: 19px;
    line-height: 48px;
    text-align: center;
    vertical-align: middle;
    text-transform: uppercase;
    height: 48px;
    display: block;
    margin-top: 16px;
    -webkit-transition: all 150ms ease;
    -o-transition: all 150ms ease;
    transition: all 150ms ease;
    border: none;
  }

  > .add-all.disabled {
    background: #cccccc;
  }

  > .empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    color: #9b9b9b;

    > .heart-image {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }

    > .quote-empty {
      margin-bottom: 10px;
    }

    > .quote-simply {
      margin-bottom: 20px;
      padding: 0 40px;
      text-align: center;

      > img {
        width: 18px;
        height: 18px;
      }
    }

    > .shopping {
      margin-bottom: 10px;
      background: #13283f;
      color: #fff;
      padding: 0 20px;
      font-size: 15px;
      line-height: 2.5;
      text-align: center;
      display: block;
      vertical-align: middle;
      text-transform: uppercase;
      height: 40px;
      -webkit-transition: all 150ms ease;
      -o-transition: all 150ms ease;
      transition: all 150ms ease;
    }
  }
`;

const MemoWishlistMobile = React.memo(StyledWishlistMobile);

export { MemoWishlistMobile as WishlistMobile, MemoWishlistMobile as default };
