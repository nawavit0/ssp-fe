import React from 'react';
import { Skeleton } from '@central-tech/core-ui';
import AddToCartBoxMobile from './AddToCartBoxMobile';
import { Cms } from '../../../../../components/CMSGrapesjsView';
import {
  ProductMobileFooterStyled,
  FooterPriceStyled,
  FooterInitialSalePriceStyled,
  FooterInitialOldPriceStyled,
  FooterAddToCartDescriptionStyled,
  FooterDeliveryPolicyStyled,
  ProductMobileFooterLayoutStyled,
} from './styled';

const ProductMobileFooter = ({
  isGuest,
  productInitSalePrice,
  productInitOldPrice,
  isConfigurable,
  addToCartActiveFlag,
  productSku,
  qty,
  setQty,
  setSelectedSize,
  translate,
  minPrice,
  maxPrice,
  activeProduct,
  handleAddToCart,
  setShowInsufficientStockFlag,
  addToCartStatus,
}) => {
  const deliveryPolicySkeleton = () => {
    return (
      <Skeleton
        time={1}
        width="100%"
        borderRadius={0}
        height="10px"
        style={{
          float: 'none',
        }}
      />
    );
  };
  return (
    <ProductMobileFooterStyled>
      <ProductMobileFooterLayoutStyled>
        {addToCartActiveFlag || minPrice === maxPrice ? (
          <FooterPriceStyled>
            <FooterInitialSalePriceStyled>
              {productInitSalePrice}
            </FooterInitialSalePriceStyled>
            {productInitOldPrice && (
              <FooterInitialOldPriceStyled>
                {productInitOldPrice}
              </FooterInitialOldPriceStyled>
            )}
          </FooterPriceStyled>
        ) : (
          <div></div>
        )}
        <FooterAddToCartDescriptionStyled>
          <AddToCartBoxMobile
            translate={translate}
            addToCartActiveFlag={addToCartActiveFlag}
            sku={productSku}
            isConfigurable={isConfigurable}
            isGuest={isGuest}
            qty={qty}
            setQty={setQty}
            setSelectedSize={setSelectedSize}
            activeProduct={activeProduct}
            handleAddToCart={handleAddToCart}
            addToCartStatus={addToCartStatus}
            setShowInsufficientStockFlag={setShowInsufficientStockFlag}
          />
        </FooterAddToCartDescriptionStyled>
      </ProductMobileFooterLayoutStyled>
      <FooterDeliveryPolicyStyled>
        <Cms
          identifier="mobileWeb|PDP_DELIVERY_POLICY"
          ssr={false}
          blockLoading={deliveryPolicySkeleton}
        />
      </FooterDeliveryPolicyStyled>
    </ProductMobileFooterStyled>
  );
};

export default ProductMobileFooter;
