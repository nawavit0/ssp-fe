import React from 'react';
import styled from 'styled-components';
import { withLocales, Link } from '@central-tech/core-ui';
import CartSeller from './CartSeller';
import CartProduct from './CartProduct';
import GiftPromotion from './GiftPromotion';
import TotalPrice from './TotalPrice';
import CheckoutFooter from './CheckoutFooter';
import FreeGiftSeller from './FreeGiftSeller';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const CartMobileStyled = styled.div`
  padding-top: 20px;
`;
const CartMobileTitleStyled = styled.div`
  text-align: center;
  font-size: 14px;
  border-bottom: 0.5px solid #b8b8b8;
  h1 {
    text-transform: uppercase;
    color: #262626;
    font-size: 18px;
    margin-bottom: 15px;
  }
  p {
    margin: 0;
  }
  span {
    text-transform: capitalize;
    color: #b8b8b8;
    font-size: 10px;
    font-weight: bold;
  }
`;
const CartProductStyled = styled.div`
  padding: 20px;
  &:last-child {
    padding-bottom: 0;
  }
`;
const NoProductFoundStyled = styled.div`
  padding: 100px 20px 120px;
  text-align: center;
  img {
    width: 30px;
    height: 30px;
  }
  button {
    color: #fff;
    text-transform: uppercase;
    background-color: #13283f;
    padding: 15px 0;
    max-width: 250px;
    width: 90%;
    border: none;
  }
  p {
    margin: 15px 0;
  }
`;

const CartMobile = ({
  translate,
  totalItemQuantity,
  cartItemWithSeller,
  cartId,
  shippingCost,
  giftWrap,
  discountAmount,
  baseGrandTotal,
  subTotalInclTax,
  earnTheOnePoint,
  giftFlag,
  giftMessage,
  promotionCodeErrorFlag,
  submitPromotionMessage,
  promotionCode,
  submittedPromotionCode,
  promotionCodeHandler,
  submitPromotionHandler,
  removeSubmittedPromotionCodeHandler,
  setGiftWrapMessageHandler,
  changeGiftWrapMessageHandler,
  deleteCartItemHandler,
  updateProductQtyHandler,
  changeSizeItemHandler,
}) => {
  const isDisableCartCheckout = !cartItemWithSeller
    ?.flatMap(seller => seller.items)
    ?.every(item => {
      return item.maxQty > 0;
    });
  const totalSeller = cartItemWithSeller?.length || 0;
  return (
    <CartMobileStyled>
      <CartMobileTitleStyled>
        <h1>
          {translate('shopping_bag.shopping_bag')}{' '}
          <span>
            ({totalItemQuantity}{' '}
            {totalItemQuantity > 1
              ? translate('shopping_bag.items')
              : translate('shopping_bag.item')}
            )
          </span>
        </h1>
      </CartMobileTitleStyled>
      {totalItemQuantity ? (
        <>
          {cartItemWithSeller.map((seller, currentSellerIndex) => {
            const items = seller?.items || [];
            const sellerName = seller?.sellerName || '';
            const itemQtySeller = seller?.quantity || 0;
            const freeItems = seller?.freeItems || [];
            return (
              <div key={currentSellerIndex}>
                {items.map((item, itemIndex) => {
                  const product = item?.product || {};
                  const productId = item?.productId || '';
                  const productName = item?.productName || '';
                  const productImage = item?.productImage || '';
                  const priceInclTax = item?.priceInclTax || 0;
                  const originalPrice = item?.originalPrice || 0;
                  const rowTotalInclTax = item?.rowTotalInclTax || 0;
                  const isConfigurable = item?.isConfigurable || false;
                  const qty = item?.qty || 0;
                  const minQty = item?.minQty || 0;
                  const maxQty = item?.maxQty || 0;
                  const isOutOfStock = item?.isOutOfStock || false;
                  const selectedSize = isConfigurable
                    ? item?.selectedSize || ''
                    : item?.product?.custom_attributes_option
                        ?.product_size_simple || '';
                  const productPath = item?.productPath || '';
                  const freeGift = item?.freeItems || false;
                  const sizeType = item?.sizeType || '';
                  const parentSku = item?.parentSku || '';
                  const sku = item?.sku || '';
                  return (
                    <CartProductStyled key={itemIndex}>
                      <CartProduct
                        productId={productId}
                        productName={productName}
                        productImage={productImage}
                        priceInclTax={priceInclTax}
                        discountAmount={discountAmount}
                        rowTotalInclTax={rowTotalInclTax}
                        originalPrice={originalPrice}
                        isConfigurable={isConfigurable}
                        qty={qty}
                        minQty={minQty}
                        maxQty={maxQty}
                        selectedSize={selectedSize}
                        isOutOfStock={isOutOfStock}
                        freeGift={freeGift}
                        productPath={productPath}
                        cartId={cartId}
                        deleteCartItemHandler={deleteCartItemHandler}
                        updateProductQtyHandler={updateProductQtyHandler}
                        changeSizeItemHandler={changeSizeItemHandler}
                        sizeType={sizeType}
                        sku={sku}
                        parentSku={parentSku}
                        product={product}
                        itemIndex={itemIndex}
                      />
                    </CartProductStyled>
                  );
                })}
                <CartSeller
                  itemQuantity={itemQtySeller}
                  sellerName={sellerName}
                  currentSellerIndex={currentSellerIndex + 1}
                  totalSeller={totalSeller}
                />
                <FreeGiftSeller freeItems={freeItems} />
              </div>
            );
          })}
          <GiftPromotion
            promotionCodeErrorFlag={promotionCodeErrorFlag}
            submitPromotionMessage={submitPromotionMessage}
            promotionCode={promotionCode}
            promotionCodeHandler={promotionCodeHandler}
            submitPromotionHandler={submitPromotionHandler}
            submittedPromotionCode={submittedPromotionCode}
            removeSubmittedPromotionCodeHandler={
              removeSubmittedPromotionCodeHandler
            }
            giftFlag={giftFlag}
            giftMessage={giftMessage}
            setGiftWrapMessageHandler={setGiftWrapMessageHandler}
            changeGiftWrapMessageHandler={changeGiftWrapMessageHandler}
          />
          <TotalPrice
            giftFlag={giftFlag}
            shippingCost={shippingCost}
            giftWrap={giftWrap}
            discountAmount={discountAmount}
            baseGrandTotal={baseGrandTotal}
            subTotalInclTax={subTotalInclTax}
          />
          <CheckoutFooter
            orderTotal={baseGrandTotal}
            earnTheOnePoint={earnTheOnePoint}
            shippingCost={shippingCost}
            isDisableCartCheckout={isDisableCartCheckout}
          />
        </>
      ) : (
        <NoProductFoundStyled>
          <img
            src="/static/icons/ShoppingBagGrey.svg"
            alt="Shopping bag icon"
          />
          <p
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'CartEmpty',
              'CartMobile',
            )}
          >
            {translate('shopping_bag.no_product_found')}
          </p>
          <Link
            id={generateElementId(
              ELEMENT_TYPE.BUTTON,
              ELEMENT_ACTION.VIEW,
              'ContinueShopping',
              'CartMobile',
            )}
            to="/"
          >
            <button type="button">
              {translate('shopping_bag.continue_shopping')}
            </button>
          </Link>
        </NoProductFoundStyled>
      )}
    </CartMobileStyled>
  );
};

export default withLocales(CartMobile);
