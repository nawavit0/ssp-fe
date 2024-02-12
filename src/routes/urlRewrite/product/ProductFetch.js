import React from 'react';
import { withStoreConfig } from '@central-tech/core-ui';
import { useProductDetail } from './useProductDetail';
import { useWishListDetail } from './useWishlistDetail';
import ProductContainer from './components/ProductContainer';
import { changeMediaUrl } from '../../../utils/imgUrl';
import { set, forEach } from 'lodash';
import { checkDate } from '../../../utils/date';
import { getProductImgUrl } from '../../../utils/imgUrl';

const ProductFetch = ({ slug, activeConfig, isMobile, customer }) => {
  const data = useProductDetail(slug);
  const wishlist = useWishListDetail();
  const wishlistData = wishlist?.wishlists?.items?.[0] || [];
  const loading = data?.loading || false;
  console.log('data', data);
  const product = data?.product || {};
  const mediaUrl = activeConfig?.base_media_url || '';
  const popupProductImage = product?.image
    ? getProductImgUrl(product.image, mediaUrl)
    : '/static/images/DefaultImage.jpg';
  const productImages = getProductImages(product, mediaUrl);
  const productPrice = product?.price || 0;
  const description = changeMediaUrl(product.description, mediaUrl);
  const relatedProducts = getRelatedProducts(product, mediaUrl);
  set(product, 'description', description);
  const sizeMaps = product?.extension_attributes?.size_maps || [];
  let isOutOfStock =
    product?.extension_attributes?.stock_item?.salable || false;
  const configurableOptions =
    product?.extension_attributes?.configurable_product_options || [];
  const childrenProducts = product?.configurable_product_items || [];
  const productOverlays = getProductOverlay(
    product,
    activeConfig,
    isMobile,
    mediaUrl,
  );
  const productType = product?.type_id || '';
  const isConfigurable = productType === 'configurable';
  if (isConfigurable) {
    isOutOfStock = getConfigurableStock(childrenProducts);
  }
  const isGuest = !(customer?.id || false);
  const guestCartId = customer?.guest?.cartId || '';
  let productBrand = product?.extension_attributes?.brand?.url_key || '';
  productBrand = productBrand ? `/${productBrand}` : '#';

  return (
    <ProductContainer
      loading={loading}
      product={product}
      childrenProducts={childrenProducts}
      productImages={productImages}
      productPrice={productPrice}
      isOutOfStock={isOutOfStock}
      isConfigurable={isConfigurable}
      configurableOptions={configurableOptions}
      productOverlays={productOverlays}
      relatedProducts={relatedProducts}
      slug={slug}
      isMobile={isMobile}
      isGuest={isGuest}
      guestCartId={guestCartId}
      popupProductImage={popupProductImage}
      productBrand={productBrand}
      sizeMaps={sizeMaps}
      wishlistData={wishlistData}
    />
  );
};

const getConfigurableStock = childrenProductsList => {
  /*** find stock from children products have least 1 qty ***/
  let isOutOfStock = true;
  if (childrenProductsList.length < 1) {
    return isOutOfStock;
  }
  forEach(childrenProductsList, childrenProduct => {
    const childrenProductSalable =
      childrenProduct?.extension_attributes?.stock_item?.salable || false;

    if (!childrenProductSalable) {
      isOutOfStock = false;
      return false;
    }
  });
  return isOutOfStock;
};

const getProductOverlay = (product, activeConfig, isMobile, mediaUrl) => {
  /*** get product overlay ***/
  const productOverlayStatus = !!product?.extension_attributes?.overlays[0]
    ?.overlay_status;

  const productOverlayMobileStatus = !!product?.extension_attributes
    ?.overlays[0]?.mobile_overlay_status;

  const overlayEnable = isMobile
    ? productOverlayMobileStatus
    : productOverlayStatus;

  if (overlayEnable === true) {
    const productOverlayStart =
      product?.extension_attributes?.overlays[0]?.overlay_start_date || false;
    const productOverlayEnd =
      product?.extension_attributes?.overlays[0]?.overlay_end_date || false;
    const productOverlayImage =
      product?.extension_attributes?.overlays[0]?.overlay_image || false;

    if (checkDate(productOverlayStart, productOverlayEnd)) {
      return {
        image: `${mediaUrl}${productOverlayImage}`,
      };
    }
  }

  return false;
};

const getYoutubeFormat = url => {
  if (url?.includes('youtube.com')) {
    return `${url.replace('watch?v=', 'embed/')}?autoplay=1&mute=1`;
  }
  if (url?.includes('youtu.be')) {
    return `${url.replace(
      'youtu.be/',
      'youtube.com/embed/',
    )}?autoplay=1&mute=1`;
  }
  return url;
};

const getProductImages = (product, mediaUrl) => {
  const productImages = product?.media_gallery_entries || [];
  const defaultImage = {
    imageUrl: '/static/images/DefaultImage.jpg',
    label: 'supersports',
    default: true,
  };
  if (productImages.length > 0) {
    return productImages
      .filter(obj => {
        if (obj.disabled) {
          return false;
        }
        if (obj.media_type?.includes('video')) {
          return !!obj.extension_attributes?.video_content;
        }
        return true;
      })
      .map(filteredObj => {
        const obj = {
          imageUrl: `${mediaUrl}catalog/product${filteredObj.file}`,
          label: filteredObj.label,
          type: filteredObj.media_type,
        };
        return !filteredObj.media_type?.includes('video')
          ? obj
          : {
              ...obj,
              videoUrl: getYoutubeFormat(
                filteredObj.extension_attributes?.video_content.video_url,
              ),
            };
      });
  }
  return [].concat(defaultImage);
};

const getRelatedProducts = (product, mediaUrl) => {
  const productLinks = product?.product_links || [];

  if (productLinks.length === 0) {
    return [];
  }

  return [product]
    .concat(
      productLinks
        .filter(link => !!link.product)
        .map(link => link.product)
        .filter(link => !!link.url_key),
    )
    .map(relatedProduct => {
      return {
        id: relatedProduct?.id || 0,
        sku: relatedProduct?.sku || '',
        name: relatedProduct?.name || '',
        brand: relatedProduct?.brand || '',
        price: relatedProduct?.price || 0,
        special_price: relatedProduct?.special_price || 0,
        is_out_of_stock:
          relatedProduct?.extension_attributes?.stock_item?.salable || false,
        url: `/${relatedProduct?.url_key || ''}`,
        image:
          relatedProduct.image && relatedProduct.image !== ''
            ? `${mediaUrl}catalog/product${relatedProduct.image}`
            : `/static/images/DefaultImage.jpg`,
      };
    });
};

export default withStoreConfig(ProductFetch);
