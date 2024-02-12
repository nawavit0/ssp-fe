import React, { useState, useEffect, useRef } from 'react';
import LazyLoad from 'react-lazyload';
import { withLocales, withStoreConfig, Tab, Link } from '@central-tech/core-ui';
import QuantityBox from '../QuantityBox';
import AddToCartBoxDesktop from './AddToCartBoxDesktop';
import SizeSelectionModalDesktop from './SizeSelectionModalDesktop';
import SizeTypeBox from '../SizeTypeBox';
import { formatPrice } from '../../../../../utils/formatPrice';
import RelatedProductDesktop from './RelatedProductDesktop';
import SlideImageDesktop from './SlideImageDesktop';
import { Cms } from '../../../../../components/CMSGrapesjsView';
import RelatedSearch from '../RelatedSearch';
import { nativePopup } from '../../../../../utils/popup';
import ShortDescriptionDesktop from './ShortDescriptionDesktop';
import WishlistProductDesktop from './WishlistProductDesktop';
import SizeGuideDesktop from './SizeGuideDesktop';
import SizeModalDesktop from './SizeModalDesktop';
import { useStore } from '../../../../../reactReducers/store';
import { setPopupAddtoCart } from '../../../../../reactReducers/actions';
import InsufficientStockModalDesktop from './InsufficientStockModalDesktop';
import {
  // FlexLeftRightStyled,
  ProductPageLayoutStyled,
  ProductPageLayoutRightColumnStyled,
  QuantitySizeTypeStyled,
  QuantityStyled,
  SizeTypeStyled,
  SizeGuideLabelStyled,
  // FreeGiftStyled,
  ActionStyled,
  ProductDetailStyled,
  BrandProductNameStyled,
  PriceStyled,
  ContentStyled,
  CustomTabStyled,
  TabSectionStyled,
  TabStyled,
  DeliveryAndReturnStyled,
  SocialIconStyled,
  SocialStyled,
  The1Styled,
  The1ShareStyled,
  // PromotionFreeStyled,
  // PromotionItemStyled,
  SoldByStyled,
  InitialOldPriceStyled,
  InitialSalePriceStyled,
  SizeTypeLayoutStyled,
} from './styled';

const customRelatedSectionStyle = `
  border-bottom: 1px solid #D5D6D7;
  > span {
    font-size: 14px;
  }
`;
const customRelatedSearchBox = `
    font-size: 14px;
`;
const useIntersect = (
  { root = null, rootMargin, threshold = 0 },
  addtoCartFormatData = {},
) => {
  const [node, setNode] = useState(null);
  const [, dispatch] = useStore();
  const observer = useRef(
    typeof window !== 'undefined'
      ? new window.IntersectionObserver(
          ([entry]) => {
            if (entry?.isIntersecting) {
              return dispatch(
                setPopupAddtoCart({
                  ...addtoCartFormatData,
                  isShow: false,
                }),
              );
            } else if (entry?.isIntersecting === false) {
              return dispatch(
                setPopupAddtoCart({
                  ...addtoCartFormatData,
                  isShow: true,
                }),
              );
            }
          },
          {
            root,
            rootMargin,
            threshold,
          },
        )
      : {},
  );

  useEffect(() => {
    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);
    return () => {
      dispatch(setPopupAddtoCart({}));
      currentObserver.disconnect();
    };
  }, [node, dispatch]);

  return [setNode];
};

function ProductStructureDesktop(props) {
  const {
    isGuest,
    guestCookies,
    productName,
    productSku,
    productInitSalePrice,
    productInitOldPrice,
    brandName,
    shortDescription,
    soldBy,
    translate,
    relatedProducts,
    isConfigurable,
    productImages,
    productOverlays,
    description,
    isNewBadge,
    percentDiscount,
    qty,
    stockQty,
    minQty,
    maxQty,
    setQty,
    sizeListSalable,
    selectedSize,
    setSelectedSize,
    selectedSizeType,
    setSelectedSizeType,
    activeProduct,
    loading,
    popupProductImage,
    relatedSearch,
    handleAddToCart,
    sizeListForSizeGuide,
    showInsufficientStockFlag,
    setShowInsufficientStockFlag,
    showSizeSelectionModalFlag,
    setShowSizeSelectionModalFlag,
    maximumT1Redemption,
    productBrand,
    addToCartStatus,
    isWishlist,
    handleWishlistModal,
    showSizeSelectionWishlistModalFlag,
    setShowSizeSelectionWishlistModalFlag,
    handleWishlistLoginModal,
    addToCartActiveFlag,
  } = props;
  const [showSizeModalFlag, setShowSizeModalFlag] = useState(false);
  const [ref] = useIntersect(
    {
      rootMargin: '-113px 0px 0px 0px',
    },
    {
      addToCartActiveFlag: addToCartActiveFlag,
      isGuest: isGuest,
      qty: qty,
      setQty: setQty,
      setSelectedSize: setSelectedSize,
      sku: productSku,
      isConfigurable: isConfigurable,
      translate: translate,
      activeProduct: activeProduct,
      popupProductImage: popupProductImage,
      guestCookies: guestCookies,
      productInitSalePrice: productInitSalePrice,
      productInitOldPrice: productInitOldPrice,
      isShow: false,
    },
  );
  const selectedSizeList = sizeListSalable[selectedSizeType];
  return (
    <>
      <SizeSelectionModalDesktop
        selectedSizeList={selectedSizeList}
        setSelectedSize={setSelectedSize}
        selectedSize={selectedSize}
        sizeListSalable={sizeListSalable}
        selectedSizeType={selectedSizeType}
        setSelectedSizeType={setSelectedSizeType}
        showSizeSelectionModalFlag={showSizeSelectionModalFlag}
        setShowSizeSelectionModalFlag={setShowSizeSelectionModalFlag}
        handleAddToCart={handleAddToCart}
        addToCartStatus={addToCartStatus}
        showSizeSelectionWishlistModalFlag={showSizeSelectionWishlistModalFlag}
        setShowSizeSelectionWishlistModalFlag={
          setShowSizeSelectionWishlistModalFlag
        }
        handleWishlistLoginModal={handleWishlistLoginModal}
        isGuest={isGuest}
        isWishlist={isWishlist}
      />
      <InsufficientStockModalDesktop
        showInsufficientStockFlag={showInsufficientStockFlag}
        setShowInsufficientStockFlag={setShowInsufficientStockFlag}
      />
      <ProductPageLayoutStyled>
        <SlideImageDesktop
          loading={loading}
          productImages={productImages}
          productOverlays={productOverlays}
          isNewBadge={isNewBadge}
          percentDiscount={percentDiscount}
          translate={translate}
        />
        <ProductPageLayoutRightColumnStyled>
          <ProductDetailStyled>
            <BrandProductNameStyled>
              <Link to={productBrand}>
                <h2>{brandName}</h2>
              </Link>
              <h1>{productName}</h1>
            </BrandProductNameStyled>
            <PriceStyled>
              <InitialSalePriceStyled>
                {productInitSalePrice}
              </InitialSalePriceStyled>
              <InitialOldPriceStyled>
                {productInitOldPrice}
              </InitialOldPriceStyled>
            </PriceStyled>
          </ProductDetailStyled>
          <SoldByStyled>
            {translate('product_detail.sold_by_plain')} {soldBy}
          </SoldByStyled>
          <ShortDescriptionDesktop
            translate={translate}
            shortDescription={shortDescription}
          />
          <hr />
          {isConfigurable && (
            <SizeGuideDesktop
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              setSelectedSizeType={setSelectedSizeType}
              selectedSizeList={selectedSizeList}
            />
          )}
          <QuantitySizeTypeStyled>
            <QuantityStyled>
              <h3>{translate('product_detail.quantity')}</h3>
              <QuantityBox
                isMobile={false}
                qty={qty}
                setQty={setQty}
                stockQty={stockQty}
                maxQty={maxQty}
                minQty={minQty}
              />
            </QuantityStyled>
            {isConfigurable && (
              <SizeTypeStyled>
                {Object.keys(sizeListSalable).map((value, index) => {
                  return (
                    <SizeTypeLayoutStyled key={index}>
                      <SizeTypeBox
                        sizeType={value}
                        selectedSizeType={selectedSizeType}
                        setSelectedSizeType={setSelectedSizeType}
                        isSelected={selectedSizeType === value}
                        key={value}
                      />
                    </SizeTypeLayoutStyled>
                  );
                })}
                <SizeGuideLabelStyled
                  onClick={() => setShowSizeModalFlag(true)}
                >
                  <p>{translate('product_detail.size_guide')}</p>
                  <img src="/static/icons/SizeGuide.svg" />
                </SizeGuideLabelStyled>
              </SizeTypeStyled>
            )}
          </QuantitySizeTypeStyled>
          <SizeModalDesktop
            showSizeModalFlag={showSizeModalFlag}
            setShowSizeModalFlag={setShowSizeModalFlag}
            sizeList={sizeListForSizeGuide}
          />
          <hr />
          {/* <FreeGiftStyled>
            <FlexLeftRightStyled>
              <PromotionItemStyled>
                <img src="https://www.adidas.co.th/dw/image/v2/bcbs_prd/on/demandware.static/-/Sites-adidas-products/default/dw891ca5de/zoom/G27636_01_standard.jpg?strip=false&sw=600" />
                <p>[MOCKED]</p>
              </PromotionItemStyled>
              <PromotionFreeStyled>Free</PromotionFreeStyled>
            </FlexLeftRightStyled>
          </FreeGiftStyled> */}
          <The1ShareStyled>
            <The1Styled>
              {maximumT1Redemption && (
                <>
                  <img src="/static/icons/TheOne.svg" alt="The 1 Card" />
                  <p>
                    {translate('product_detail.max_point_redeemable')}{' '}
                    <span>
                      {formatPrice(maximumT1Redemption)}{' '}
                      {translate('product_detail.points')}
                    </span>
                  </p>
                </>
              )}
            </The1Styled>
            <SocialStyled>
              <p>{translate('product_detail.share')} :</p>
              <SocialIconStyled>
                <a
                  onClick={() =>
                    nativePopup(
                      `https://www.facebook.com/sharer.php?u=${window.location.href}`,
                    )
                  }
                >
                  <img src="/static/icons/Facebook.svg" alt="Facebook icon" />
                </a>
                <a
                  onClick={() =>
                    nativePopup(
                      `https://twitter.com/share?url=${
                        window.location.href
                      }&text=${encodeURIComponent(productName)}`,
                    )
                  }
                >
                  <img src="/static/icons/Twitter.svg" alt="Twitter icon" />
                </a>
                <a
                  onClick={() =>
                    nativePopup(
                      `https://social-plugins.line.me/lineit/share?url=${window.location.href}`,
                    )
                  }
                >
                  <img src="/static/icons/Line.svg" alt="Line icon" />
                </a>
              </SocialIconStyled>
            </SocialStyled>
          </The1ShareStyled>
          <ActionStyled>
            <WishlistProductDesktop
              isGuest={isGuest}
              isWishlist={isWishlist}
              handleWishlistModal={handleWishlistModal}
            />
            <AddToCartBoxDesktop
              handleAddToCart={handleAddToCart}
              refs={ref}
              qty={qty}
              setQty={setQty}
              sku={productSku}
              isConfigurable={isConfigurable}
              translate={translate}
              isGuest={isGuest}
              guestCookies={guestCookies}
              addToCartActiveFlag={!isConfigurable || activeProduct}
              activeProduct={activeProduct}
              setShowInsufficientStockFlag={setShowInsufficientStockFlag}
              addToCartStatus={addToCartStatus}
            />
          </ActionStyled>
          {isConfigurable && relatedProducts.length > 0 && (
            <RelatedProductDesktop
              translate={translate}
              products={relatedProducts}
            />
          )}
        </ProductPageLayoutRightColumnStyled>
      </ProductPageLayoutStyled>
      <DeliveryAndReturnStyled>
        <LazyLoad height={125} once>
          <Cms identifier="PDP_DELIVERY_RETURN" />
        </LazyLoad>
      </DeliveryAndReturnStyled>
      <LazyLoad height={200} once>
        <TabStyled>
          <Tab
            defaultTab={1}
            renderTabHeader={({ children }) => {
              return children.length ? (
                <TabSectionStyled>{children}</TabSectionStyled>
              ) : null;
            }}
          >
            <Tab.Item
              title={translate('product_detail.description')}
              customButton={({ title, active }) => (
                <CustomTabStyled active={active}>{title}</CustomTabStyled>
              )}
            >
              <ContentStyled>
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </ContentStyled>
            </Tab.Item>
            <Tab.Item
              title={translate('product_detail.delivery')}
              customButton={({ title, active }) => (
                <CustomTabStyled active={active}>{title}</CustomTabStyled>
              )}
            >
              <ContentStyled>
                <LazyLoad height={125} once>
                  <Cms identifier="PDP_DELIVERY" ssr={false} />
                </LazyLoad>
              </ContentStyled>
            </Tab.Item>
            <Tab.Item
              title={translate('product_detail.returns')}
              customButton={({ title, active }) => (
                <CustomTabStyled active={active}>{title}</CustomTabStyled>
              )}
            >
              <ContentStyled>
                <LazyLoad height={125} once>
                  <Cms identifier="PDP_RETURN" ssr={false} />
                </LazyLoad>
              </ContentStyled>
            </Tab.Item>
          </Tab>
        </TabStyled>
      </LazyLoad>
      <LazyLoad height={130} once>
        <RelatedSearch
          relatedSearch={relatedSearch}
          title={translate('product_detail.related_search')}
          customBoxRelatedStyle={customRelatedSearchBox}
          customRelatedSectionStyle={customRelatedSectionStyle}
        />
      </LazyLoad>
      <LazyLoad height={520} once>
        <Cms identifier="PDP_RECOMMENDED_FOR_YOU" ssr={false} />
      </LazyLoad>
    </>
  );
}

export default withStoreConfig(withLocales(ProductStructureDesktop));
