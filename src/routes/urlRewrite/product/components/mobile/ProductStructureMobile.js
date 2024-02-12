import React, { useState } from 'react';
import LazyLoad from 'react-lazyload';
import { withLocales, withRoutes, CardCollaspe } from '@central-tech/core-ui';
import RelatedProductMobile from './RelatedProductMobile';
import { Cms } from '../../../../../components/CMSGrapesjsView';
import RelatedSearch from '../RelatedSearch';
import SizeModalMobile from './SizeModalMobile';
import SlideImageMobile from './SlideImageMobile';
import QuantityBox from '../QuantityBox';
import SizeGuideMobile from './SizeGuideMobile';
import ShortDescriptionMobile from './ShortDescriptionMobile';
import SizeSelectionModalMobile from './SizeSelectionModalMobile';
import InsufficientStockModalMobile from './InsufficientStockModalMobile';
import WishlistModalMobile from './WishlistModalMobile';
import WishlistProductMobile from './WishlistProductMobile';
import ProductFooterMobile from './ProductFooterMobile';
import {
  ProductLayoutMobileStyled,
  ProductFlexBoxStyled,
  ProductNameStyled,
  ProductPriceBoxStyled,
  ProductNameBoxStyled,
  ProductSalePriceStyled,
  ProductOldPriceStyled,
  ProductSellerStyled,
  SeparateLineStyled,
  SocialStyled,
  SocialIconStyled,
  DeliveryAndReturnStyled,
  QuantityStyled,
  ModalBackgroundStyled,
} from './styled';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../../../utils/generateElementId';

const customContentTab = () => `
  padding: 14px;
  background-color: #f2f2f2;
`;
const customTitleTab = () => `
  font-size: 12px;
  color: #0C0C0C;
  font-weight: bold;
  border-top: 1px solid #e3e1e1;
  height: 44px;
  background-color: #f2f2f2;
`;
const customRelatedSectionStyle = `
  border-bottom: 1px solid #D5D6D7;
  > span {
    font-size: 11px;
  }
`;
const customRelatedSearchBox = `
    font-size: 11px;
`;

const ProductStructureMobile = props => {
  const {
    translate,
    productId,
    productSku,
    productName,
    productInitSalePrice,
    productInitOldPrice,
    shortDescription,
    soldBy,
    relatedProducts,
    isConfigurable,
    minPrice,
    maxPrice,
    productImages,
    productOverlays,
    isGuest,
    qty,
    stockQty,
    minQty,
    maxQty,
    setQty,
    selectedSize,
    setSelectedSize,
    selectedSizeType,
    setSelectedSizeType,
    percentDiscount,
    isNewBadge,
    activeProduct,
    description,
    relatedSearch,
    sizeListSalable,
    location,
    loading,
    sizeListForSizeGuide,
    showSizeSelectionModalFlag,
    setShowSizeSelectionModalFlag,
    showSizeSelectionWishlistModalFlag,
    setShowSizeSelectionWishlistModalFlag,
    handleAddToCart,
    showInsufficientStockFlag,
    setShowInsufficientStockFlag,
    showWishlistModalFlag,
    setShowWishlistModalFlag,
    handleWishlistModal,
    handleWishlistLoginModal,
    addToCartStatus,
    wishlistId,
    isWishlist,
    handleAddToWishlist,
    addToCartActiveFlag,
    addToWishListStatus,
  } = props;
  const [showSizeModalFlag, setShowSizeModalFlag] = useState(false);
  const [autoAddToWishlist, setAutoAddToWishlist] = useState(false);

  let wishlistUrl = '';
  if (isGuest) {
    wishlistUrl =
      location && location.url
        ? `/login?previous_page=${encodeURI(
            `${location.url}&auto_wishlist=true${
              activeProduct?.current_option?.attr_value
                ? `&size=${activeProduct?.current_option?.attr_value}`
                : ``
            }`,
          )}`
        : '';
  }
  const autoWishlist =
    location && location.queryParams
      ? location.queryParams.auto_wishlist || ''
      : '';
  const isAutoWishlist = Boolean(autoWishlist === 'true');
  if (!isGuest && isAutoWishlist && !autoAddToWishlist) {
    setAutoAddToWishlist(true);
    const sizeOption =
      location && location.queryParams ? location.queryParams.size || '' : '';
    const isSizeOption = Boolean(sizeOption);
    const customAttributes =
      isConfigurable && isSizeOption
        ? [
            {
              attribute_code: 'product_size_simple',
              name: 'product_size_simple',
              value: sizeOption.toString() || '',
            },
          ]
        : [];
    handleAddToWishlist(wishlistId, productId, customAttributes);
  }
  const selectedSizeList = sizeListSalable[selectedSizeType] || [];
  return (
    <>
      <SizeSelectionModalMobile
        selectedSizeList={selectedSizeList}
        setSelectedSize={setSelectedSize}
        selectedSize={selectedSize}
        sizeListSalable={sizeListSalable}
        selectedSizeType={selectedSizeType}
        setSelectedSizeType={setSelectedSizeType}
        showSizeSelectionModalFlag={showSizeSelectionModalFlag}
        setShowSizeSelectionModalFlag={setShowSizeSelectionModalFlag}
        showSizeSelectionWishlistModalFlag={showSizeSelectionWishlistModalFlag}
        setShowSizeSelectionWishlistModalFlag={
          setShowSizeSelectionWishlistModalFlag
        }
        handleWishlistLoginModal={handleWishlistLoginModal}
        handleAddToCart={handleAddToCart}
        addToCartStatus={addToCartStatus}
        isGuest={isGuest}
        isWishlist={isWishlist}
      />
      <InsufficientStockModalMobile
        showInsufficientStockFlag={showInsufficientStockFlag}
        setShowInsufficientStockFlag={setShowInsufficientStockFlag}
      />
      <SlideImageMobile
        loading={loading}
        productImages={productImages}
        productOverlays={productOverlays}
        isNewBadge={isNewBadge}
        percentDiscount={percentDiscount}
        translate={translate}
      />
      <ProductLayoutMobileStyled>
        <ProductFlexBoxStyled>
          <ProductNameBoxStyled>
            <ProductNameStyled>{productName}</ProductNameStyled>
          </ProductNameBoxStyled>
          <ProductPriceBoxStyled>
            <ProductSalePriceStyled>
              {productInitSalePrice}
            </ProductSalePriceStyled>
            {productInitOldPrice && (
              <ProductOldPriceStyled>
                {productInitOldPrice}
              </ProductOldPriceStyled>
            )}
          </ProductPriceBoxStyled>
        </ProductFlexBoxStyled>
        <ProductFlexBoxStyled>
          <ProductSellerStyled>
            {translate('product_detail.sold_by') + soldBy}
          </ProductSellerStyled>
        </ProductFlexBoxStyled>
        <SeparateLineStyled />
        {shortDescription !== '' && (
          <>
            <ProductFlexBoxStyled>
              <ShortDescriptionMobile
                translate={translate}
                shortDescription={shortDescription}
              />
            </ProductFlexBoxStyled>
            <SeparateLineStyled />
          </>
        )}
        {isConfigurable && relatedProducts.length > 0 && (
          <RelatedProductMobile
            translate={translate}
            products={relatedProducts}
          />
        )}
        {isConfigurable && (
          <SizeGuideMobile
            setShowSizeModalFlag={setShowSizeModalFlag}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedSizeType={selectedSizeType}
            setSelectedSizeType={setSelectedSizeType}
            sizeListSalable={sizeListSalable}
            selectedSizeList={selectedSizeList}
          />
        )}
        <ProductFlexBoxStyled>
          <QuantityStyled>
            <h3>{translate('product_detail.quantity')}</h3>
            <QuantityBox
              isMobile
              qty={qty}
              setQty={setQty}
              stockQty={stockQty}
              minQty={minQty}
              maxQty={maxQty}
            />
          </QuantityStyled>
        </ProductFlexBoxStyled>
      </ProductLayoutMobileStyled>
      <DeliveryAndReturnStyled>
        <LazyLoad height={200} once>
          <Cms identifier="mobileWeb|PDP_DELIVERY_RETURN" ssr={false} />
        </LazyLoad>
      </DeliveryAndReturnStyled>
      <SeparateLineStyled />
      <WishlistProductMobile
        translate={translate}
        isGuest={isGuest}
        isWishlist={isWishlist}
        handleWishlistModal={handleWishlistModal}
        addToWishListStatus={addToWishListStatus}
      />
      <WishlistModalMobile
        showWishlistModalFlag={showWishlistModalFlag}
        setShowWishlistModalFlag={setShowWishlistModalFlag}
        wishlistUrl={wishlistUrl}
      />
      <SocialStyled>
        <p>{translate('product_detail.share')} :</p>
        <SocialIconStyled>
          <a
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer.php?u=${window.location.href}`,
              )
            }
          >
            <img src="/static/icons/Facebook.svg" alt="Facebook" />
          </a>
          <a
            onClick={() =>
              window.open(
                `https://twitter.com/share?url=${
                  window.location.href
                }&text=${encodeURIComponent(productName)}`,
              )
            }
          >
            <img src="/static/icons/Twitter.svg" alt="Twitter" />
          </a>
          <a
            onClick={() =>
              window.open(
                `https://social-plugins.line.me/lineit/share?url=${window.location.href}`,
              )
            }
          >
            <img src="/static/icons/Line.svg" alt="Line" />
          </a>
        </SocialIconStyled>
      </SocialStyled>
      <LazyLoad height={130} once>
        <CardCollaspe
          title={translate('product_detail.description')}
          borderColor="#E3E1E1"
          defaultVisible={false}
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.VIEW,
            'DescriptionTab',
            'ProductDetailPage',
          )}
          titleStyled={customTitleTab}
          bodyStyled={customContentTab}
          arrowUrl="/static/icons/ArrowDown.svg"
          arrowSize={20}
          defaultRotateArrow={0}
          activeRotateArrow={180}
        >
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </CardCollaspe>
        <CardCollaspe
          title={translate('product_detail.delivery')}
          borderColor="#E3E1E1"
          defaultVisible={false}
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.VIEW,
            'Delivery',
            'ProductDetailPage',
          )}
          titleStyled={customTitleTab}
          bodyStyled={customContentTab}
          arrowUrl="/static/icons/ArrowDown.svg"
          arrowSize={20}
          defaultRotateArrow={0}
          activeRotateArrow={180}
        >
          <LazyLoad height={125} once>
            <Cms identifier="mobileWeb|PDP_DELIVERY" ssr={false} />
          </LazyLoad>
        </CardCollaspe>
        <CardCollaspe
          title={translate('product_detail.returns')}
          borderColor="#E3E1E1"
          defaultVisible={false}
          titleStyled={customTitleTab}
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.VIEW,
            'Return',
            'ProductDetailPage',
          )}
          bodyStyled={customContentTab}
          arrowUrl="/static/icons/ArrowDown.svg"
          arrowSize={20}
          defaultRotateArrow={0}
          activeRotateArrow={180}
        >
          <LazyLoad height={125} once>
            <Cms identifier="mobileWeb|PDP_RETURN" ssr={false} />
          </LazyLoad>
        </CardCollaspe>
        <RelatedSearch
          relatedSearch={relatedSearch}
          title={translate('product_detail.related_search')}
          customBoxRelatedStyle={customRelatedSearchBox}
          customRelatedSectionStyle={customRelatedSectionStyle}
          isSlide
        />
      </LazyLoad>
      <LazyLoad height={250} once>
        <Cms identifier="mobileWeb|PDP_RECOMMENDED_FOR_YOU" ssr={false} />
      </LazyLoad>
      <ProductFooterMobile
        productInitSalePrice={productInitSalePrice}
        productInitOldPrice={productInitOldPrice}
        translate={translate}
        isConfigurable={isConfigurable}
        addToCartActiveFlag={addToCartActiveFlag}
        minPrice={minPrice}
        maxPrice={maxPrice}
        isGuest={isGuest}
        qty={qty}
        setQty={setQty}
        setSelectedSize={setSelectedSize}
        productSku={productSku}
        activeProduct={activeProduct}
        handleAddToCart={handleAddToCart}
        addToCartStatus={addToCartStatus}
        setShowInsufficientStockFlag={setShowInsufficientStockFlag}
      />
      <SizeModalMobile
        showSizeModalFlag={showSizeModalFlag}
        setShowSizeModalFlag={setShowSizeModalFlag}
        sizeList={sizeListForSizeGuide}
      />
      <ModalBackgroundStyled showSizeModalFlag={showSizeModalFlag} />
    </>
  );
};

export default withRoutes(withLocales(ProductStructureMobile));
