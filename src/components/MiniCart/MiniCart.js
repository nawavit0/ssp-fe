import React from 'react';
import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';
import MiniCartItem from './components/MiniCartItem';
import ImageLazy from '../Image/ImageLazy';
import { formatPrice } from '../../utils/formatPrice';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';

const MiniCart = ({
  className,
  translate,
  isGuest,
  cartItems,
  isEmptyCart,
  rootImageUrl,
  baseGrandTotal,
  subTotalInclTax,
  shippingAmount,
  discountAmount,
  deleteCartItemHandler,
  updateProductQtyHandler,
  changeSizeItemHandler,
}) => {
  const isDisableCartCheckout = !cartItems?.every(item => {
    return item?.product?.extension_attributes?.stock_item?.qty > 0;
  });
  return (
    <div className={className}>
      {isEmptyCart && (
        <div className="empty-minicart">
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'EmptyCart',
              'MiniCartArea',
            )}
          >
            {translate('mini_cart.empty_bag')}
          </div>
          {isGuest && (
            <>
              <div
                id={generateElementId(
                  ELEMENT_TYPE.LABEL,
                  ELEMENT_ACTION.VIEW,
                  'Login',
                  'MiniCartArea',
                )}
              >
                {translate('mini_cart.no_login')}
              </div>
              <div className="empty-line">
                <Link
                  to={`/register`}
                  id={generateElementId(
                    ELEMENT_TYPE.LINK,
                    ELEMENT_ACTION.VIEW,
                    'Login',
                    'MiniCartArea',
                  )}
                  className="login"
                >
                  <div className="login-btn">
                    {translate('mini_cart.login_btn')}
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
      {!isEmptyCart && (
        <div className="minicart">
          <div className="scroll-box">
            <div className="scroll-inner">
              {cartItems
                .filter(item => item?.price_incl_tax > 0)
                .map((item, index) => {
                  const isConfigurable =
                    (item?.product_type || 'simple') === 'configurable';
                  const productSimpleUrl = `/${item?.product?.url_key || '/'}`;
                  const parentSku =
                    item?.extension_attributes?.parent_sku || '';
                  const productConfigurableUrl = `/product-sku?sku=${parentSku}`;
                  const sizeType =
                    item?.product?.custom_attributes?.size_type || '';
                  const stockQty =
                    item?.product?.extension_attributes?.stock_item?.qty || 0;
                  let minQty =
                    item?.product?.extension_attributes?.stock_item
                      ?.min_sale_qty || 0;
                  let maxQty =
                    item?.product?.extension_attributes?.stock_item
                      ?.max_sale_qty || 0;
                  minQty = minQty > stockQty ? stockQty : minQty;
                  maxQty = maxQty > stockQty ? stockQty : maxQty;
                  const selectedSize =
                    item?.product?.custom_attributes_option
                      ?.product_size_simple || '';
                  const sku = item?.sku || '';
                  return (
                    <MiniCartItem
                      key={index}
                      index={index}
                      sku={sku}
                      translate={translate}
                      product={item}
                      parentSku={parentSku}
                      productId={item?.item_id || 0}
                      productName={item?.product?.name || ''}
                      productUrl={
                        isConfigurable
                          ? productConfigurableUrl
                          : productSimpleUrl
                      }
                      productImage={
                        item?.product?.image && item?.product?.image !== ''
                          ? `${rootImageUrl}${item?.product?.image}`
                          : `/static/images/DefaultImage.jpg`
                      }
                      sizeType={sizeType}
                      qty={item?.qty || 0}
                      minQty={minQty}
                      maxQty={maxQty}
                      isProductDiscount={
                        item?.price_incl_tax !== item?.product?.price
                      }
                      priceInclTax={item?.price_incl_tax || 0}
                      originalPrice={item?.product?.price || 0}
                      rowTotalInclTax={item?.row_total_incl_tax || 0}
                      isOutOfStock={
                        !item?.product?.extension_attributes?.salable || false
                      }
                      isConfigurable={isConfigurable}
                      selectedSize={selectedSize}
                      deleteCartItemHandler={deleteCartItemHandler}
                      updateProductQtyHandler={updateProductQtyHandler}
                      changeSizeItemHandler={changeSizeItemHandler}
                    />
                  );
                })}
            </div>
          </div>
          <div className="footer">
            <div className="footer-line">
              <div className="sub-total">
                <div
                  id={generateElementId(
                    ELEMENT_TYPE.LABEL,
                    ELEMENT_ACTION.VIEW,
                    'SubtotalPrice',
                    'MiniCartArea',
                  )}
                >
                  {translate('mini_cart.sub_total')}
                </div>
                <div
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'SubtotalPrice',
                    'MiniCartArea',
                  )}
                >{`฿${formatPrice(subTotalInclTax, 2)}`}</div>
              </div>
            </div>
            <div className="footer-line">
              <div className="sub-total">
                <div
                  id={generateElementId(
                    ELEMENT_TYPE.LABEL,
                    ELEMENT_ACTION.VIEW,
                    'ShippingAndHandlingPrice',
                    'MiniCartArea',
                  )}
                >
                  {translate('mini_cart.shipping_and_handling')}
                </div>
                <div
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'ShippingAndHandlingPrice',
                    'MiniCartArea',
                  )}
                >
                  {shippingAmount}
                </div>
              </div>
            </div>
            {discountAmount !== 0 && (
              <div className="footer-line">
                <div className="sub-total discount">
                  <div
                    id={generateElementId(
                      ELEMENT_TYPE.LABEL,
                      ELEMENT_ACTION.VIEW,
                      'DiscountPrice',
                      'MiniCartArea',
                    )}
                  >
                    {translate('mini_cart.discount')}
                  </div>
                  <div
                    id={generateElementId(
                      ELEMENT_TYPE.INFO,
                      ELEMENT_ACTION.VIEW,
                      'DiscountPrice',
                      'MiniCartArea',
                    )}
                    className=""
                  >
                    -฿{formatPrice(discountAmount, 2)}
                  </div>
                </div>
              </div>
            )}
            <div className="footer-end-line" />
            <div className="footer-line">
              <div className="order-total">
                <div
                  id={generateElementId(
                    ELEMENT_TYPE.LABEL,
                    ELEMENT_ACTION.VIEW,
                    'OrderTotalPrice',
                    'MiniCartArea',
                  )}
                >
                  {translate('mini_cart.order_total')}
                </div>
                <div
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'OrderTotalPrice',
                    'MiniCartArea',
                  )}
                >{`฿${formatPrice(baseGrandTotal, 2)}`}</div>
              </div>
            </div>
            <div className="footer-line">
              <Link
                to={`/cart`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'Cart',
                  'MiniCartArea',
                )}
                className="footer-link"
              >
                <div className="view-bag">
                  {translate('mini_cart.view_my_bag')}
                </div>
              </Link>
              <Link
                to={isDisableCartCheckout ? `` : `/checkout`}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'Checkout',
                  'MiniCartArea',
                )}
                className={`footer-link ${
                  isDisableCartCheckout ? 'checkout-disable' : ''
                }`}
              >
                <div className="checkout">
                  {<ImageLazy src={`/static/icons/LockWhite@2x.png`} />}
                  {translate('mini_cart.secure_checkout')}
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StyledMiniCart = styled(MiniCart)`
  width: 500px;
  > .empty-minicart {
    color: #333;
    font-size: 14px;
    line-height: 150%;
    font-weight: 400;
    margin: 16px;
    > div {
      margin: 16px;
      text-align: center;
    }
    > .empty-line > .login {
      color: #fff;
      > .login-btn {
        width: 100%;
        display: block;
        padding: 8px;
        text-align: center;
        background: #13283f;
      }
    }
  }
  > .minicart {
    width: 100%;

    > .scroll-box {
      min-height: 244px;
      max-height: 334px;
      overflow-y: auto;

      > .scroll-inner {
        overflow-x: hidden;
      }
    }

    > .footer {
      > .footer-line {
        display: flex;
        margin: 8px;

        > .sub-total {
          margin: 8px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          color: #2d2d2d;
          font-size: 18px;
          line-height: 150%;
          font-weight: bold;
          width: 100%;

          > div {
            -ms-flex-preferred-size: 0;
            flex-basis: 0;
            -ms-flex-positive: 1;
            flex-grow: 1;
            max-width: 100%;

            :last-child {
              text-align: right;
            }
          }
        }

        > .sub-total.discount {
          > div:last-child {
            color: #dd0a0a;
          }
        }

        > .order-total {
          margin: 8px;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          color: #2d2d2d;
          font-size: 24px;
          line-height: 150%;
          font-weight: 600;
          width: 100%;

          > div {
            -ms-flex-preferred-size: 0;
            flex-basis: 0;
            -ms-flex-positive: 1;
            flex-grow: 1;
            max-width: 100%;

            :last-child {
              text-align: right;
              color: #dd0a0a;
            }
          }
        }

        > .footer-link {
          cursor: pointer;
          margin: 16px 8px;
          color: inherit;
          text-decoration: none;
          font-weight: 600;

          > .view-bag {
            height: 55px;
            width: 226px;
            text-align: center;
            line-height: 55px;
            color: #13283f;
            background: rgb(121, 232, 30);
            font-weight: 600;
            font-size: 14px;
          }

          > .checkout {
            height: 55px;
            width: 226px;
            text-align: center;
            line-height: 55px;
            color: #fff;
            background: rgb(11, 34, 60);
            font-weight: 600;
            font-size: 14px;

            > img {
              width: 24px;
              height: 24px;
              margin-right: 4px;
              margin-bottom: 6px;
              margin-left: -4px;
            }
          }
        }
        > .footer-link.checkout-disable {
          cursor: not-allowed;
          > .checkout {
            background: #b7b7b7;
          }
          * {
            cursor: not-allowed;
          }
        }
      }

      > .footer-end-line {
        border-bottom: 1px solid #a2a1a1;
        margin: 8px 16px;
      }
    }
  }
`;

const MemoMiniCart = React.memo(StyledMiniCart);

export { MemoMiniCart as MiniCart, MemoMiniCart as default };
