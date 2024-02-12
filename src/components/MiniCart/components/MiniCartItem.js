import React from 'react';
import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';
import ImageV2 from '../../Image/ImageV2';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';
import { formatPrice } from '../../../utils/formatPrice';
import DeleteCartItem from '../../../routes/cart/components/DeleteCart';
import SizeBox from '../../../routes/cart/components/SizeBox';
import QuantityBox from '../../../routes/cart/components/QuantityBox';
import {
  getProductCustomAttributesProductPreview,
  GTM_SECTION_MINICART,
} from '../../../utils/gtm';

const MiniCartItem = props => {
  const {
    className,
    translate,
    index,
    product,
    productId,
    productName,
    productUrl,
    productImage,
    sizeType,
    qty,
    sku,
    parentSku,
    minQty,
    maxQty,
    isProductDiscount,
    priceInclTax,
    originalPrice,
    rowTotalInclTax,
    isOutOfStock,
    selectedSize,
    isConfigurable,
    deleteCartItemHandler,
    updateProductQtyHandler,
    changeSizeItemHandler,
  } = props;
  const gtmCustomAttributes = getProductCustomAttributesProductPreview({
    product,
    options: { position: index + 1, section: GTM_SECTION_MINICART },
  });
  return (
    <div className={className}>
      <div className="item-line">
        <div className="item-img">
          <Link
            native
            to={productUrl}
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              'ProductItemImage',
              'MiniCartArea',
            )}
            {...gtmCustomAttributes}
          >
            <ImageV2 src={productImage} alt={productName} />
          </Link>
        </div>
        <div className="item-text">
          <div className="item-text-line">
            <div className="item-product-name">
              <Link
                native
                to={productUrl}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'ProductItemName',
                  'MiniCartArea',
                )}
                {...gtmCustomAttributes}
              >
                {productName}
              </Link>
            </div>
            <div className="item-product-price">
              <span
                className="init-price"
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'ProductItemPrice',
                  'MiniCartArea',
                )}
              >
                ฿{formatPrice(priceInclTax, 2)}
              </span>
              <span className="special-price">
                {isProductDiscount && `฿${formatPrice(originalPrice, 2)}`}
              </span>
            </div>
          </div>
        </div>
        <div className="item-action">
          <div className="trash">
            <DeleteCartItem
              id={generateElementId(
                ELEMENT_TYPE.LINK,
                ELEMENT_ACTION.VIEW,
                'ProductItemDelete',
                'MiniCartArea',
              )}
              deleteCartItemHandler={deleteCartItemHandler}
              productId={productId}
              product={product}
              parentSku={parentSku}
              qty={qty}
            />
          </div>
        </div>
      </div>
      <div className="item-line">
        <div className="item-sizing">
          <div className="item-text-line">
            <div className="item-label">{translate('mini_cart.size')}</div>
            <SizeBox
              sku={sku}
              qty={qty}
              productId={productId}
              parentSku={parentSku}
              deleteCartItemHandler={deleteCartItemHandler}
              changeSizeItemHandler={changeSizeItemHandler}
              isConfigurable={isConfigurable}
              disableFlag={isOutOfStock}
              selectedSize={selectedSize}
              sizeType={sizeType}
              id={generateElementId(
                ELEMENT_TYPE.SELECT,
                ELEMENT_ACTION.EDIT,
                'SelectSizeProductItem',
                'MiniCartArea',
              )}
              fontSize="14px"
              width="120px"
            />
          </div>
        </div>
        <div className="item-qty">
          <div className="item-text-line">
            <div className="item-label">{translate('mini_cart.qty')}</div>
            <QuantityBox
              inputId={generateElementId(
                ELEMENT_TYPE.SELECT,
                ELEMENT_ACTION.EDIT,
                'QuantityBoxProductItem',
                'MiniCartArea',
                sku,
              )}
              disableBoxFlag={isOutOfStock}
              productId={productId}
              qty={qty}
              minQty={minQty}
              maxQty={maxQty}
              updateProductQtyHandler={updateProductQtyHandler}
            />
          </div>
        </div>
        <div className="item-total">
          <div className="item-text-line">
            <div className="total-text">
              <div
                className="item-label"
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'ProductItemPriceTotal',
                  'MiniCartArea',
                )}
              >
                {translate('mini_cart.total')}
              </div>
              <span
                className="total-row"
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.VIEW,
                  'ProductItemTotalPrice',
                  'MiniCartArea',
                )}
              >
                ฿{formatPrice(rowTotalInclTax, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="end-line" />
    </div>
  );
};

const StyledMiniCartItem = styled(MiniCartItem)`
  width: 100%;
  display: block;
  height: 244px;
  > .item-line {
    display: flex;
    margin: 8px;
    > .item-img {
      margin: 8px;
      display: flex;
      width: 120px;
      height: 120px;
      > img {
        max-width: 100%;
        height: auto;
      }
    }
    > .item-text {
      margin: 8px;
      display: flex;
      flex-basis: 0;
      -ms-flex-positive: 1;
      flex-grow: 1;
      max-width: 100%;
    }
    > .item-action {
      margin: 8px;
      display: flex;
      > .trash {
        width: 30px;
        height: 30px;
      }
    }
    > .item-sizing {
      margin: 8px;
      -ms-flex-preferred-size: 0;
      flex-basis: 0;
      -ms-flex-positive: 1;
      flex-grow: 1;
      max-width: 120px;
      display: inline-flex;
    }
    > .item-qty {
      margin: 8px;
      -ms-flex-preferred-size: 0;
      flex-basis: 0;
      -ms-flex-positive: 1;
      flex-grow: 1;
      max-width: 120px;
      display: inline-flex;
    }
    > .item-total {
      margin: 8px;
      -ms-flex-preferred-size: 0;
      flex-basis: 0;
      -ms-flex-positive: 1;
      flex-grow: 1;
      max-width: 100%;
      display: inline-flex;
    }
    > .item-text > .item-text-line,
    > .item-sizing > .item-text-line,
    > .item-qty > .item-text-line,
    > .item-total > .item-text-line {
      width: 100%;
      display: inline-block;
      > .item-product-name {
        font-size: 16px;
        line-height: 150%;
        margin-bottom: 16px;
        display: grid;
        color: #000000;
        > a {
          font-weight: bold;
        }
      }
      > .item-product-price {
        margin-bottom: 4px;
        > .init-price {
          vertical-align: middle;
          line-height: 150%;
          font-size: 22px;
          color: #dd0001;
          margin-right: 8px;
        }
        > .special-price {
          vertical-align: middle;
          line-height: 150%;
          font-size: 14px;
          color: #a2a1a1;
          text-decoration: line-through;
        }
      }
      .item-label {
        color: #363636;
        font-size: 14px;
        line-height: 150%;
        vertical-align: middle;
        margin-bottom: 4px;
        font-weight: bold;
      }
      > .total-text {
        text-align: right;
        > .total-row {
          font-size: 18px;
          color: #dd0001;
          height: 38px;
          line-height: 38px;
        }
      }
    }
  }
  > .end-line {
    border-bottom: 1px solid #a2a1a1;
    margin: 8px 16px;
  }
`;

const MemoMiniCartItem = React.memo(StyledMiniCartItem);

export { MemoMiniCartItem as MiniCartItem, MemoMiniCartItem as default };
