import React, { useState, useEffect, memo } from 'react';
import {
  withLocales,
  withRoutes,
  withStoreConfig,
} from '@central-tech/core-ui';
import {
  sendGTMProductDetailImpressionSimple,
  sendGTMProductDetailImpressionConfigurable,
} from '../../../../utils/gtm';
import ProductStructureDesktop from './desktop/ProductStructureDesktop';
import ProductStructureMobile from './mobile/ProductStructureMobile';
import { findIndex, groupBy, find, cloneDeep } from 'lodash';
import { Helmet } from 'react-helmet';
import Breadcrumbs from '../../../../components/Breadcrumbs/Breadcrumbs';
import { formatPrice } from '../../../../utils/formatPrice';
import { calPercentDiscount } from '../../../../utils/calPercentDiscount';
import useAddToCart from './useAddToCart';
import { setProductDetail } from '../../../../reactReducers/actions';
import { useStore } from '../../../../reactReducers/store';
import { mapSizeListProductOption } from '../utils';
import { useAddToWishlist, useDeleteFromWishlist } from './useWishlist';

const ProductContainer = props => {
  const {
    loading,
    product,
    relatedProducts,
    productImages,
    isConfigurable,
    productPrice,
    activeConfig,
    slug,
    translate,
    productOverlays,
    isMobile,
    isGuest,
    guestCartId,
    isOutOfStock,
    popupProductImage,
    productBrand,
    sizeMaps,
    wishlistData,
  } = props;
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [showInsufficientStockFlag, setShowInsufficientStockFlag] = useState(
    false,
  );
  const [showWishlistModalFlag, setShowWishlistModalFlag] = useState(false);
  const [showSizeSelectionModalFlag, setShowSizeSelectionModalFlag] = useState(
    false,
  );
  const [
    showSizeSelectionWishlistModalFlag,
    setShowSizeSelectionWishlistModalFlag,
  ] = useState(false);
  const [{ productDetail }, dispatch] = useStore();
  const addToCartHandler = useAddToCart();
  const { addToWishlist } = useAddToWishlist();
  const { deleteFromWishlist } = useDeleteFromWishlist();
  const percentDiscount = calPercentDiscount(product);
  const productName = product?.name || '';
  const productSku = product?.sku || '';
  const productId = product?.id || '';
  const isNewBadge = !!Number(product?.custom_attributes?.new || false);
  const relatedSearch = product?.product_tags || '';
  const productSpecialPrice = product?.special_price || null;
  const brandName = product?.custom_attributes_option?.brand_name || '';
  const shortDescription = product?.short_description || '';
  const description = product?.description || '';
  const soldBy = product?.marketplace?.seller || `Supersports`;
  const minPrice = product?.price_min || 0;
  const maxPrice = product?.price_max || 0;

  let productInitSalePrice = 0;
  let productInitOldPrice = false;
  if (isConfigurable) {
    if (minPrice === maxPrice) {
      productInitSalePrice = `฿${formatPrice(minPrice, 2, false)}`;
    } else {
      productInitSalePrice = `฿${formatPrice(
        minPrice,
        2,
        false,
      )} - ฿${formatPrice(maxPrice, 2, false)}`;
    }
  } else if (productPrice === productSpecialPrice) {
    productInitSalePrice = `฿${formatPrice(productPrice, 2, false)}`;
  } else {
    productInitSalePrice =
      productSpecialPrice !== null
        ? `฿${formatPrice(productSpecialPrice, 2, false)}`
        : `฿${formatPrice(productPrice, 2, false)}`;
    productInitOldPrice =
      productSpecialPrice !== null
        ? `฿${formatPrice(productPrice, 2, false)}`
        : false;
  }
  const sizeList = groupBy(sizeMaps, sizeMaps => sizeMaps.type);
  const productOptions = getProductOption(product, sizeList);
  const sizeListSalable = mapSizeListProductOption(productOptions, sizeMaps);
  const sizeListForSizeGuide = mutateSizeListForSizeGuide(sizeListSalable);
  const activeProduct = getActiveProduct(product, productOptions, selectedSize);
  const isWishlist = getIsWishlist(
    wishlistData,
    isConfigurable,
    product,
    activeProduct,
  );
  const maximumT1RedemptionProducts =
    product?.extension_attributes?.t1c_redeemable_points || [];
  let maximumT1Redemption = Math.max(...maximumT1RedemptionProducts);
  let stockQty = product?.extension_attributes?.stock_item?.qty || 0;
  let minQty = product?.extension_attributes?.stock_item?.min_sale_qty || 0;
  let maxQty = product?.extension_attributes?.stock_item?.max_sale_qty || 0;
  if (activeProduct !== false) {
    maximumT1Redemption =
      product?.extension_attributes?.t1c_redeemable_points?.[0] || 0;
    const activeProductPrice = activeProduct?.price || 0;
    const activeProductSpecialPrice = activeProduct?.special_price || null;
    stockQty = activeProduct?.extension_attributes?.stock_item?.qty || 0;
    minQty = activeProduct?.extension_attributes?.stock_item?.min_sale_qty || 0;
    maxQty = activeProduct?.extension_attributes?.stock_item?.max_sale_qty || 0;
    productInitSalePrice =
      activeProductSpecialPrice !== null
        ? `฿${formatPrice(activeProductSpecialPrice, 2, false)}`
        : `฿${formatPrice(activeProductPrice, 2, false)}`;
    productInitOldPrice =
      activeProductSpecialPrice !== null
        ? `฿${formatPrice(activeProductPrice, 2, false)}`
        : false;
  }
  minQty = minQty > stockQty ? stockQty : minQty;
  maxQty = maxQty > stockQty ? stockQty : maxQty;
  const addToCartActiveFlag = !isConfigurable || activeProduct;
  const defaultSizeType = product?.custom_attributes?.size_type || '';
  const [selectedSizeType, setSelectedSizeType] = useState(defaultSizeType);
  const [addToCartStatus, setAddToCartStatus] = useState('');
  const [addToWishListStatus, setAddToWishListStatus] = useState('');
  const handleAddToCart = addToCartHandler({
    addToCartActiveFlag,
    isGuest,
    qty,
    setQty,
    setSelectedSize,
    sku: productSku,
    isConfigurable,
    activeProduct,
    selectedSize,
    setAddToCartStatus,
    setShowInsufficientStockFlag,
    setShowSizeSelectionModalFlag,
    translate,
  });
  const productObject = {
    slug,
    product,
    productName,
    brandName,
    productSku,
    productImages,
    productPrice,
    productSpecialPrice,
    isOutOfStock,
    relatedProducts,
    isConfigurable,
  };

  useEffect(() => {
    const productType = product?.type_id || '';
    if (productType === 'configurable') {
      sendGTMProductDetailImpressionConfigurable({ parentProduct: product });
    } else {
      sendGTMProductDetailImpressionSimple({
        childProduct: product,
        parentSku: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (selectedSize) {
      sendGTMProductDetailImpressionSimple({
        childProduct: activeProduct,
        parentSku: productSku,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize]);
  useEffect(() => {
    setSelectedSizeType(selectedSizeType || defaultSizeType);
    setQty(qty);
    const newProductDetail = {
      productInitSalePrice,
      productInitOldPrice,
      addToCartStatus,
      handleAddToCart,
    };
    if (JSON.stringify(productDetail) !== JSON.stringify(newProductDetail)) {
      dispatch(setProductDetail(newProductDetail));
    }
  }, [
    addToCartStatus,
    defaultSizeType,
    dispatch,
    handleAddToCart,
    productDetail,
    productInitOldPrice,
    productInitSalePrice,
    qty,
    selectedSizeType,
  ]);

  const handleWishlistLoginModal = () => {
    if (isGuest) {
      setShowSizeSelectionWishlistModalFlag(false);
      setShowWishlistModalFlag(true);
    } else {
      if (!isWishlist) {
        /*** add to wishlist ***/
        const wishlistId = wishlistData?.id || '';
        if (isConfigurable) {
          const customAttribute = {
            name: 'product_size_simple',
            attribute_code: 'product_size_simple',
            value: activeProduct?.current_option?.attr_value?.toString() || '',
          };
          handleAddToWishlist(wishlistId, productId, customAttribute);
        } else {
          handleAddToWishlist(wishlistId, productId);
        }
        /*** add to wishlist ***/
      } else {
        /*** remove from wishlist ***/
        handleDeleteFromWishlist(isWishlist);
        /*** remove from wishlist ***/
      }
      setShowSizeSelectionWishlistModalFlag(false);
    }
  };
  const handleSizeSelectionModal = () => {
    setShowWishlistModalFlag(false);
    setShowSizeSelectionWishlistModalFlag(true);
  };
  const handleWishlistModal = () => {
    if (selectedSize || !isConfigurable) {
      handleWishlistLoginModal();
    } else {
      handleSizeSelectionModal();
    }
  };
  const handleAddToWishlist = async (
    wishlistId,
    productId,
    customerAttributes,
  ) => {
    await addToWishlist({
      wishlistId: parseInt(wishlistId),
      productId: parseInt(productId),
      customerAttributes: customerAttributes,
    });
    setAddToWishListStatus(translate('product_detail.added_to_wishlist'));
    setTimeout(() => {
      setAddToWishListStatus('');
      setSelectedSize('');
    }, 1500);
  };
  const handleDeleteFromWishlist = async itemId => {
    await deleteFromWishlist({
      itemId: itemId,
    });
    setSelectedSize('');
  };

  return (
    <>
      {renderHeader(product, slug, activeConfig, translate, productObject)}
      {isMobile === true ? (
        <ProductStructureMobile
          key={`PDP${productId}`}
          loading={loading}
          productId={productId}
          productName={productName}
          productSku={productSku}
          isConfigurable={isConfigurable}
          productInitSalePrice={productInitSalePrice}
          productInitOldPrice={productInitOldPrice}
          productSpecialPrice={productSpecialPrice}
          brandName={brandName}
          shortDescription={shortDescription}
          description={description}
          soldBy={soldBy}
          relatedProducts={relatedProducts}
          translate={translate}
          minPrice={minPrice}
          maxPrice={maxPrice}
          productImages={productImages}
          productOverlays={productOverlays}
          isNewBadge={isNewBadge}
          percentDiscount={percentDiscount}
          qty={qty}
          stockQty={stockQty}
          minQty={minQty}
          maxQty={maxQty}
          setQty={setQty}
          isGuest={isGuest}
          guestCookies={guestCartId}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedSizeType={selectedSizeType}
          setSelectedSizeType={setSelectedSizeType}
          sizeList={sizeList}
          sizeListSalable={sizeListSalable}
          relatedSearch={relatedSearch}
          activeProduct={activeProduct}
          maximumT1Redemption={maximumT1Redemption}
          handleAddToCart={handleAddToCart}
          sizeListForSizeGuide={sizeListForSizeGuide}
          showSizeSelectionModalFlag={showSizeSelectionModalFlag}
          setShowSizeSelectionModalFlag={setShowSizeSelectionModalFlag}
          showSizeSelectionWishlistModalFlag={
            showSizeSelectionWishlistModalFlag
          }
          setShowSizeSelectionWishlistModalFlag={
            setShowSizeSelectionWishlistModalFlag
          }
          showInsufficientStockFlag={showInsufficientStockFlag}
          setShowInsufficientStockFlag={setShowInsufficientStockFlag}
          showWishlistModalFlag={showWishlistModalFlag}
          setShowWishlistModalFlag={setShowWishlistModalFlag}
          handleWishlistModal={handleWishlistModal}
          handleWishlistLoginModal={handleWishlistLoginModal}
          handleSizeSelectionModal={handleSizeSelectionModal}
          addToCartStatus={addToCartStatus}
          isWishlist={isWishlist}
          handleAddToWishlist={handleAddToWishlist}
          addToCartActiveFlag={addToCartActiveFlag}
          addToWishListStatus={addToWishListStatus}
        />
      ) : (
        <ProductStructureDesktop
          key={`PDP${productId}`}
          loading={loading}
          productName={productName}
          productSku={productSku}
          isConfigurable={isConfigurable}
          productInitSalePrice={productInitSalePrice}
          productInitOldPrice={productInitOldPrice}
          brandName={brandName}
          shortDescription={shortDescription}
          soldBy={soldBy}
          relatedProducts={relatedProducts}
          description={description}
          translate={translate}
          minPrice={minPrice}
          maxPrice={maxPrice}
          qty={qty}
          stockQty={stockQty}
          minQty={minQty}
          maxQty={maxQty}
          setQty={setQty}
          isGuest={isGuest}
          guestCookies={guestCartId}
          productImages={productImages}
          productOverlays={productOverlays}
          isNewBadge={isNewBadge}
          percentDiscount={percentDiscount}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedSizeType={selectedSizeType}
          setSelectedSizeType={setSelectedSizeType}
          sizeList={sizeList}
          sizeListSalable={sizeListSalable}
          activeProduct={activeProduct}
          popupProductImage={popupProductImage}
          maximumT1Redemption={maximumT1Redemption}
          handleAddToCart={handleAddToCart}
          sizeListForSizeGuide={sizeListForSizeGuide}
          showSizeSelectionModalFlag={showSizeSelectionModalFlag}
          setShowSizeSelectionModalFlag={setShowSizeSelectionModalFlag}
          showSizeSelectionWishlistModalFlag={
            showSizeSelectionWishlistModalFlag
          }
          setShowSizeSelectionWishlistModalFlag={
            setShowSizeSelectionWishlistModalFlag
          }
          relatedSearch={relatedSearch}
          showWishlistModalFlag={showWishlistModalFlag}
          setShowWishlistModalFlag={setShowWishlistModalFlag}
          handleWishlistModal={handleWishlistModal}
          handleWishlistLoginModal={handleWishlistLoginModal}
          handleSizeSelectionModal={handleSizeSelectionModal}
          showInsufficientStockFlag={showInsufficientStockFlag}
          setShowInsufficientStockFlag={setShowInsufficientStockFlag}
          productBrand={productBrand}
          addToCartStatus={addToCartStatus}
          isWishlist={isWishlist}
          handleAddToWishlist={handleAddToWishlist}
          addToCartActiveFlag={addToCartActiveFlag}
          addToWishListStatus={addToWishListStatus}
        />
      )}
    </>
  );
};
const mutateSizeListForSizeGuide = sizeListSalable => {
  const sizeListForSizeGuide = cloneDeep(sizeListSalable);
  const sizeTypeList = Object.keys(sizeListForSizeGuide);
  const productIdList = [];
  if (sizeTypeList.length) {
    sizeTypeList.map(sizeType => {
      sizeListForSizeGuide[sizeType].map(sizeList => {
        const productId = sizeList?.product_id.toString() || '';
        if (productId) {
          productIdList.push(productId);
        }
      });
    });
  }
  const uniqueProductIdList = [...new Set(productIdList)];
  uniqueProductIdList.map(productId => {
    Object.keys(sizeListForSizeGuide).map(size => {
      const selectedSizeList = sizeListForSizeGuide[size];
      const selectSizeListIndex = selectedSizeList.findIndex(
        o => o.productId === productId,
      );
      if (selectSizeListIndex === -1) {
        sizeListForSizeGuide[size].push({
          size: '-',
          salableFlag: false,
          productId: productId,
        });
      }
    });
  });
  return sizeListForSizeGuide;
};
const renderHeader = (
  product,
  slug,
  activeConfig,
  translate,
  productObject,
) => {
  const productName = product?.name || '';
  const productTitle = product?.meta_title || '';
  const productDescription = product?.meta_description || '';
  const productImageSeo = product?.image || '';
  const baseMediaUrlRaw = activeConfig?.base_media_url || '';
  const baseUrl = activeConfig?.base_url || '';
  const baseMediaUrl = baseMediaUrlRaw.substring(0, baseMediaUrlRaw.length - 1);

  return (
    <>
      <Helmet>
        <title>{productTitle || productName}</title>
        <meta name="description" content={productDescription} />
        <meta
          property="og:title"
          content={`${productName} | ${translate('seo.website_name')}`}
        />
        <meta property="og:description" content={productDescription} />
        <meta
          property="og:image"
          content={`${baseMediaUrl}/catalog/product${productImageSeo}`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:locale" content={translate('seo.locale')} />
        <meta property="og:site_name" content={translate('seo.site_name')} />
        <meta name="twitter:site" content={baseUrl} />
        <meta
          name="twitter:title"
          content={`${productName} | ${translate('seo.website_name')}`}
        />
        <meta name="twitter:description" content={productDescription} />
        <meta
          name="twitter:image"
          content={`${baseMediaUrl}/catalog/product${productImageSeo}`}
        />
        <meta name="twitter:domain" content={`${baseUrl}${slug}`} />
      </Helmet>
      <Helmet>
        <script type="application/ld+json">
          {setJsonLDProduct(productObject, baseUrl)}
        </script>
      </Helmet>
      <Breadcrumbs breadcrumbsData={getBreadcrumbsData(product)} />
    </>
  );
};

const getIsWishlist = (
  wishlistData,
  isConfigurable,
  product,
  activeProduct,
) => {
  const wishlistDataItems = wishlistData?.items || [];
  let returnValue = false;
  if (isConfigurable) {
    if (activeProduct) {
      const productId = product?.id || 0;
      wishlistDataItems.map(item => {
        const itemId = item?.wishlist_item_id || 0;
        let attrCheck = 0;
        const itemProductId = item?.product_id || '';
        const itemCustomAttr = item?.custom_attributes || [];
        itemCustomAttr.map(attr => {
          const attributeCode = attr?.attribute_code || false;
          const attributeValue = attr?.value || false;
          const attributeActive =
            activeProduct?.custom_attributes?.[attributeCode];
          if (attributeValue && attributeValue === attributeActive) {
            attrCheck++;
          }
        });
        if (
          parseInt(itemProductId) === parseInt(productId) &&
          itemCustomAttr.length > 0 &&
          attrCheck === itemCustomAttr.length
        ) {
          returnValue = parseInt(itemId);
        }
      });
    }
    return returnValue;
  }
  const productId = product?.id || 0;
  wishlistDataItems.map(item => {
    const itemProductId = item?.product_id || '';
    const itemId = item?.wishlist_item_id || 0;
    if (parseInt(itemProductId) === parseInt(productId)) {
      returnValue = parseInt(itemId);
    }
  });

  return returnValue;
};

const getActiveProduct = (product, productOptions, selectedSize) => {
  const childrenProduct = product?.configurable_product_items || [];
  const currentOptionIndex = findIndex(productOptions, o => {
    const productId = o?.product_id || '';
    return productId.toString() === selectedSize;
  });
  if (currentOptionIndex === -1) {
    return false;
  }
  const currentOption = productOptions[currentOptionIndex];
  const currentChildrenProductIndex = findIndex(childrenProduct, o => {
    const productId = o?.id || '';
    return productId.toString() === selectedSize;
  });
  if (currentChildrenProductIndex === -1) {
    return false;
  }
  const selectedProduct = childrenProduct[currentChildrenProductIndex];
  const activeProduct = {
    ...selectedProduct,
    current_option: currentOption,
    min_qty:
      selectedProduct?.extension_attributes?.stock_item?.min_sale_qty || 0,
    max_qty:
      selectedProduct?.extension_attributes?.stock_item?.max_sale_qty || 0,
  };
  return activeProduct;
};

const getProductOption = (product, sizeList) => {
  const childrenProduct = product?.configurable_product_items || [];
  const productAttribute =
    product?.extension_attributes?.configurable_product_options?.[0]?.values ||
    [];
  const attributeId =
    product?.extension_attributes?.configurable_product_options?.[0]
      ?.attribute_id || 0;
  return productAttribute.map(attr => {
    const productId = attr?.extension_attributes?.products?.[0] || '';
    const product = find(childrenProduct, o => {
      return parseInt(o.id) === parseInt(productId);
    });
    const productSize = attr?.extension_attributes?.label || '';
    const productType = product?.custom_attributes?.size_type || '';
    const salableFlag = product?.extension_attributes?.salable || false;
    const remainingQuantity =
      product?.extension_attributes?.stock_item?.qty || '';
    const minQuantity =
      product?.extension_attributes?.stock_item?.min_sale_qty || 0;
    const maxQuantity =
      product?.extension_attributes?.stock_item?.max_sale_qty || 0;

    const indexKey = findIndex(sizeList[`${productType}`], o => {
      return o.size.toString() === productSize.toString();
    });
    return {
      attr_id: attributeId.toString(),
      attr_value: attr?.value_index || 0,
      attr_size: productSize,
      attr_type: productType,
      attr_index: indexKey !== -1 ? indexKey : false,
      product_id: productId,
      salableFlag: salableFlag,
      remainingQuantity: remainingQuantity,
      minQuantity: minQuantity,
      maxQuantity: maxQuantity,
    };
  });
};

const getBreadcrumbsData = product => {
  const breadcrumbs = product?.breadcrumbs || [];
  const productName = product?.name || 'Product Name';
  const productUrl = product?.url_key || '/';
  const currentBreadcrumbs = breadcrumbs.map(breadcrumb => {
    return {
      name: breadcrumb.name,
      level: breadcrumbs.level,
      url_path: breadcrumb.url,
    };
  });
  const productBreadcrumb = {
    name: productName,
    level: currentBreadcrumbs.length,
    url_path: productUrl,
  };
  return currentBreadcrumbs.concat(productBreadcrumb);
};

const setJsonLDProduct = (productObject, baseUrl) => {
  const {
    slug,
    product,
    productName,
    brandName,
    productSku,
    productImages,
    productPrice,
    productSpecialPrice,
    isOutOfStock,
    relatedProducts,
    isConfigurable,
  } = productObject;
  const productImageSchema = productImages.map(image => {
    return image?.imageUrl || `/static/images/DefaultImage.jpg`;
  });
  const childrenProduct = product?.configurable_product_items || [];
  let productOffer = [];
  if (isConfigurable) {
    productOffer = childrenProduct.map(childProduct => {
      const isChildAvailability =
        childProduct?.extension_attributes?.stock_item?.salable || false
          ? `OutOfStock`
          : `InStock`;
      const childPrice = childProduct?.price || 0;
      const childSpecialPrice = childProduct?.special_price || null;
      const childSpecialPriceToDate = childProduct?.special_to_date || '';
      const childSku = childProduct?.sku || '';
      const offer = {
        '@type': 'Offer',
        sku: childSku,
        priceCurrency: 'THB',
        url: `${baseUrl}${slug}`,
      };
      if (childProduct.special_price !== null) {
        return {
          ...offer,
          availability: isChildAvailability,
          price: parseFloat(childSpecialPrice).toFixed(2),
          priceValidUntil: childSpecialPriceToDate,
        };
      }
      return {
        ...offer,
        price: parseFloat(childPrice).toFixed(2),
      };
    });
  } else {
    const availability = isOutOfStock ? `OutOfStock` : `InStock`;
    let priceOffer = {};
    if (productSpecialPrice !== null) {
      const specialPriceToDate = product?.special_to_date || '';
      priceOffer = {
        price: parseFloat(productSpecialPrice).toFixed(2),
        priceValidUntil: specialPriceToDate,
      };
    } else {
      priceOffer = {
        price: parseFloat(productPrice).toFixed(2),
      };
    }
    productOffer = {
      '@type': 'Offer',
      availability: availability,
      price: productPrice,
      priceCurrency: 'THB',
      url: `${baseUrl}${slug}`,
      ...priceOffer,
    };
  }
  const productRelatedSchema = relatedProducts.map(relatedProduct => {
    const relatedName = relatedProduct?.name || '';
    const relatedSku = relatedProduct?.sku || '';
    const relatedImage =
      relatedProduct?.image || `/static/images/DefaultImage.jpg`;
    const relatedPrice = relatedProduct?.price || 0;
    const relatedUrl = relatedProduct?.url || '';
    const relatedOutOfStock = relatedProduct?.is_out_of_stock || false;
    const relatedAvailability = relatedOutOfStock ? `OutOfStock` : `InStock`;
    return {
      '@type': 'Product',
      name: relatedName,
      sku: relatedSku,
      image: relatedImage,
      weight: '0',
      brand: {
        '@type': 'Thing',
        name: brandName,
      },
      offers: {
        '@type': 'Offer',
        price: parseFloat(relatedPrice).toFixed(2),
        priceCurrency: 'THB',
        availability: relatedAvailability,
        url: `${baseUrl}${relatedUrl}`,
      },
    };
  });
  return JSON.stringify({
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    brand: {
      '@type': 'Thing',
      name: brandName,
    },
    description: product?.meta_description || '',
    sku: productSku,
    weight: '0',
    image: productImageSchema,
    offers: [].concat(productOffer),
    isRelatedTo: [].concat(productRelatedSchema),
  });
};

export default memo(withRoutes(withLocales(withStoreConfig(ProductContainer))));
