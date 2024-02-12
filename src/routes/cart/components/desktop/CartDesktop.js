import React from 'react';
import styled from 'styled-components';
import { withLocales, Link } from '@central-tech/core-ui';
import CartProduct from './CartProduct';
import CartSeller from './CartSeller';
import Promotion from './Promotion';
import TotalPrice from './TotalPrice';
import GiftWrap from './GiftWrap';
import FreeGiftSeller from './FreeGiftSeller';
import { formatPrice } from '../../../../utils/formatPrice';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';

const CartDesktopStyled = styled.div`
  padding: 30px 30px 60px;
`;
const CartDesktopTitleStyled = styled.div`
  text-align: center;
  margin-bottom: 20px;
  h1 {
    text-transform: uppercase;
    font-size: 30px;
    margin-bottom: 5px;
    color: #262626;
    font-weight: bold;
  }
  p {
    color: #b8b8b8;
    margin: 0;
    font-size: 16px;
    font-weight: bold;
  }
  span {
    text-transform: capitalize;
  }
`;
const SellerLayoutStyled = styled.div`
  &:not(:first-child) {
    border-top: solid 1px #d7d7d7;
  }
`;
const CartDesktopContentStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  grid-gap: 30px;
`;
const CartDesktopProductStyled = styled.div`
  width: 100%;
`;
const CartDesktopSummaryStyled = styled.div`
  width: 100%;
  height: fit-content;
  border: solid 1px #d7d7d7;
  padding: 15px;
  background-color: #fff;
  position: -webkit-sticky;
  position: sticky;
  top: 185px;
`;
const CheckoutBoxStyled = styled.div`
  height: 46px;
  background-color: ${props => (props.disable ? '#b7b7b7' : '#13283f')};
  padding: 16px auto;
  color: #ffffff;
  font-size: 17px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  cursor: ${props => (props.disable ? 'not-allowed' : 'pointer')};
  img {
    width: 28px;
    height: 25px;
    margin-right: 8px;
  }
`;
const PromotionStyled = styled.div`
  padding-bottom: 20px;
  margin-bottom: 15px;
  border-bottom: solid 1px #d7d7d7;
`;
const TotalPriceStyled = styled.div`
  margin-bottom: 15px;
`;
const FooterEarnTheOneStyled = styled.div`
  display: flex;
  img {
    background-color: black;
    width: 32px;
    height: 31px;
    margin-right: 10px;
  }
  p {
    font-size: 12px;
    text-align: left;
    margin-top: auto;
    margin-bottom: 6px;
    color: #8c8c8c;
  }
  span {
    color: #3d3d3d;
    font-weight: bold;
  }
`;
const CartSellerStyled = styled.div`
  margin-bottom: 40px;
  margin-left: 160px;
`;
const NoProductFoundStyled = styled.div`
  padding: 100px 20px 120px;
  text-align: center;
  img {
    width: 46px;
    height: 60px;
  }
  button {
    color: #fff;
    text-transform: uppercase;
    background-color: #13283f;
    padding: 15px 0;
    max-width: 250px;
    width: 90%;
    border: none;
    font-size: 14px;
  }
  p {
    margin: 30px 0;
    font-size: 14px;
  }
`;
const OrderQualifyDeliveryStyled = styled.p`
  font-size: 12px;
  color: #8c8c8c;
  text-align: center;
  margin-top: 25px;
  font-weight: bold;
`;
const CartDesktop = ({
  translate,
  totalItemQuantity,
  cartItemWithSeller,
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
    <CartDesktopStyled>
      <CartDesktopTitleStyled>
        <h1>{translate('shopping_bag.shopping_bag')} </h1>
        <p>
          ({totalItemQuantity}{' '}
          <span>
            {totalItemQuantity > 1
              ? translate('shopping_bag.items')
              : translate('shopping_bag.item')}
            )
          </span>
        </p>
      </CartDesktopTitleStyled>
      {totalItemQuantity ? (
        <CartDesktopContentStyled>
          <CartDesktopProductStyled>
            {cartItemWithSeller.map((seller, currentSellerIndex) => {
              const items = seller?.items || [];
              const sellerName = seller?.sellerName || '';
              const itemQtySeller = seller?.quantity || 0;
              const freeItems = seller?.freeItems || [];
              return (
                <SellerLayoutStyled key={currentSellerIndex}>
                  {items.map((item, itemIndex) => {
                    const product = item?.product || {};
                    const productId = item?.productId || '';
                    const productName = item?.productName || '';
                    const productImage = item?.productImage || '';
                    const priceInclTax = item?.priceInclTax || 0;
                    const originalPrice = item?.originalPrice || 0;
                    const discountAmount = item?.discountAmount || 0;
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
                      <CartProduct
                        key={itemIndex}
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
                        deleteCartItemHandler={deleteCartItemHandler}
                        updateProductQtyHandler={updateProductQtyHandler}
                        changeSizeItemHandler={changeSizeItemHandler}
                        sizeType={sizeType}
                        sku={sku}
                        parentSku={parentSku}
                        product={product}
                        itemIndex={itemIndex}
                      />
                    );
                  })}
                  <CartSellerStyled>
                    <CartSeller
                      itemQuantity={itemQtySeller}
                      sellerName={sellerName}
                      currentSellerIndex={currentSellerIndex + 1}
                      totalSeller={totalSeller}
                    />
                  </CartSellerStyled>
                  <FreeGiftSeller freeItems={freeItems} />
                </SellerLayoutStyled>
              );
            })}
            <GiftWrap
              giftFlag={giftFlag}
              setGiftWrapMessageHandler={setGiftWrapMessageHandler}
              changeGiftWrapMessageHandler={changeGiftWrapMessageHandler}
              giftMessage={giftMessage}
            />
          </CartDesktopProductStyled>
          <CartDesktopSummaryStyled>
            <PromotionStyled>
              <Promotion
                promotionCodeErrorFlag={promotionCodeErrorFlag}
                submitPromotionMessage={submitPromotionMessage}
                promotionCode={promotionCode}
                promotionCodeHandler={promotionCodeHandler}
                submitPromotionHandler={submitPromotionHandler}
                submittedPromotionCode={submittedPromotionCode}
                removeSubmittedPromotionCodeHandler={
                  removeSubmittedPromotionCodeHandler
                }
              />
            </PromotionStyled>
            <TotalPriceStyled>
              <TotalPrice
                giftFlag={giftFlag}
                shippingCost={shippingCost}
                giftWrap={giftWrap}
                discountAmount={discountAmount}
                baseGrandTotal={baseGrandTotal}
                subTotalInclTax={subTotalInclTax}
              />
            </TotalPriceStyled>
            {shippingCost === 0 && (
              <OrderQualifyDeliveryStyled>
                {translate('shopping_bag.order_qualify_free_delivery')}
              </OrderQualifyDeliveryStyled>
            )}
            <Link
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.VIEW,
                'SecureCheckout',
                'CartDesktop',
              )}
              to={isDisableCartCheckout ? `` : `/checkout`}
              native
            >
              <CheckoutBoxStyled disable={isDisableCartCheckout}>
                <img src="/static/icons/LockWhite@2x.png" alt="Pad Lock" />
                {translate('shopping_bag.secure_checkout')}
              </CheckoutBoxStyled>
            </Link>
            <FooterEarnTheOneStyled>
              <img src="/static/icons/TheOne.svg" alt="The 1 Card" />
              <p>
                {translate('shopping_bag.earn')}{' '}
                <span>
                  {formatPrice(earnTheOnePoint)}{' '}
                  {translate('shopping_bag.points')}{' '}
                </span>
                {translate('shopping_bag.with_your_the_1')}
              </p>
            </FooterEarnTheOneStyled>
          </CartDesktopSummaryStyled>
        </CartDesktopContentStyled>
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
              'CartDesktop',
            )}
          >
            {translate('shopping_bag.no_product_found')}
          </p>
          <Link
            id={generateElementId(
              ELEMENT_TYPE.BUTTON,
              ELEMENT_ACTION.VIEW,
              'ContinueShopping',
              'CartDesktop',
            )}
            to="/"
          >
            <button type="button">
              {translate('shopping_bag.continue_shopping')}
            </button>
          </Link>
        </NoProductFoundStyled>
      )}
    </CartDesktopStyled>
  );
};

export default withLocales(CartDesktop);
