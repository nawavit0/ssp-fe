import React, { useState } from 'react';
import { withLocales, withStoreConfig } from '@central-tech/core-ui';
import propTypes from 'prop-types';
import WishlistMobile from './component/mobile/WishlistMobile';
import WishlistDesktop from './component/desktop/WishlistDesktop';
import UseAddToCart from './component/useWishlist';
import { useDeleteFromWishlist } from '../../urlRewrite/product/components/useWishlist';

const WishlistContainer = props => {
  const { loading, isMobile, items, activeConfig, wishlistTotal } = props;
  const { addCartItem } = UseAddToCart();
  const { deleteFromWishlist } = useDeleteFromWishlist();

  const [addedWishlistStatus, setAddedWishlistStatus] = useState(null); // value: wishlist_item_id
  const [addedAllWishlistStatus, setAddedAllWishlistStatus] = useState(false);

  const handleAddToCart = async (
    product,
    configurableItemOptions,
    wishlistiItemId,
  ) => {
    const productSku = product?.sku || '';
    const isConfigurable = product?.type_id === 'configurable';
    await addCartItem(
      1,
      productSku,
      false,
      isConfigurable,
      configurableItemOptions,
    );
    setAddedWishlistStatus(wishlistiItemId);
    setTimeout(() => {
      setAddedWishlistStatus(null);
    }, 1500);
    return true;
  };

  const handleAddAllToCart = items => {
    items.reduce((previousAddToCart, item) => {
      const product = item?.product || {};
      const isConfigurable = product?.type_id === 'configurable';
      const configurableItemOptions = isConfigurable
        ? {
            option_id:
              product?.extension_attributes?.configurable_product_options[0]?.attribute_id?.toString() ||
              '',
            option_value: parseInt(item?.custom_attributes?.[0]?.value || 0),
          }
        : null;
      return previousAddToCart.then(() =>
        handleAddToCart(product, configurableItemOptions, null),
      );
    }, Promise.resolve());
    setAddedAllWishlistStatus(true);
    setTimeout(() => {
      setAddedAllWishlistStatus(false);
    }, 1000 + items.length * 1500);
  };
  const handleDeleteFromWishlist = async itemId => {
    await deleteFromWishlist({
      itemId: itemId,
    });
    return true;
  };

  const baseMediaUrl = activeConfig?.base_media_url || '';
  const imageUrl = `${baseMediaUrl}catalog/product`;

  if (isMobile) {
    return (
      <WishlistMobile
        loading={loading}
        imageUrl={imageUrl}
        items={items}
        wishlistTotal={wishlistTotal}
        handleAddToCart={handleAddToCart}
        handleAddAllToCart={handleAddAllToCart}
        handleDeleteFromWishlist={handleDeleteFromWishlist}
        addedWishlistStatus={addedWishlistStatus}
        addedAllWishlistStatus={addedAllWishlistStatus}
      />
    );
  }
  return (
    <WishlistDesktop
      loading={loading}
      imageUrl={imageUrl}
      items={items}
      wishlistTotal={wishlistTotal}
      handleAddToCart={handleAddToCart}
      handleAddAllToCart={handleAddAllToCart}
      handleDeleteFromWishlist={handleDeleteFromWishlist}
      addedWishlistStatus={addedWishlistStatus}
      addedAllWishlistStatus={addedAllWishlistStatus}
    />
  );
};

WishlistContainer.contextTypes = {
  customer: propTypes.object,
};

export default withStoreConfig(withLocales(WishlistContainer));
