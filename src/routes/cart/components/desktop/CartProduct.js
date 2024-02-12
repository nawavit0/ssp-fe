import React, { useState } from 'react';
import styled from 'styled-components';
import { withLocales, Link } from '@central-tech/core-ui';
import ImageV2 from '../../../../components/Image/ImageV2';
import { formatPrice } from '../../../../utils/formatPrice';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../utils/generateElementId';
import SizeBox from '../SizeBox';
import DeleteCartItem from '../DeleteCart';
import QuantityBox from '../QuantityBox';
import FreeGiftCard from './FreeGiftCard';
import {
  getProductCustomAttributesProductPreview,
  GTM_SECTION_CART,
} from '../../../../utils/gtm';

const CartDesktopProductStyled = styled.div`
  padding: 30px 0px;
  background-color: #fff;
`;
const CartDesktopProductDetailStyled = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  grid-gap: 40px;
  margin-bottom: 10px;
`;
const CartDesktopProductDetailImageStyled = styled(ImageV2)`
  width: 100%;
`;
const CartDesktopProductDetailDescriptionStyled = styled.div`
  position: relative;
  h3 {
    font-size: 14px;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const CartDesktopProductDetailDescriptionName = styled.p`
  font-size: 16px;
  margin: 0 0 20px;
  padding-right: 20px;
  line-height: 1.6;
  color: #474747;
  font-weight: bold;
`;
const CartDesktopProductDetailDescriptionPrice = styled.div`
  font-size: 12px;
  margin: 0 0 15px;
  display: flex;
`;
const CartDesktopProductDetailDescriptionPriceOriginal = styled.p`
  text-decoration: line-through;
  font-size: 14px;
  margin: 8px 0 0 0;
  font-weight: bold;
  color: #5c5c5c;
`;
const CartDesktopProductDetailDescriptionPriceFinal = styled.p`
  color: #dd0000;
  font-size: 22px;
  margin: 0 10px 0 0;
  font-weight: bold;
`;
const CartDesktopProductSummaryStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const CartDesktopProductSummaryInputStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;
const CartDesktopProductSummaryPriceStyled = styled.div`
  text-align: right;
  p {
    margin: 0;
    font-weight: bold;
  }
`;
const CartDesktopProductSummaryPriceLabelStyled = styled.p`
  color: #363636;
  font-size: 14px;
  font-weight: bold;
`;
const CartDesktopProductSummaryPriceDataStyled = styled.p`
  color: #dd0000;
  font-size: 22px;
  font-weight: bold;
`;
const CartDesktopProductSummaryInputSizingStyled = styled.div`
  min-width: 162px;
  margin-right: 80px;
  display: flex;
  p {
    font-size: 14px;
    color: #474747;
    font-weight: bold;
    margin-right: 10px;
    margin-top: 10px;
  }
`;
const CartDesktopProductDeleteStyled = styled.div`
  position: absolute;
  right: 0;
  top: 2px;
  width: 17px;
  height: 23px;
`;
const QuantityBoxStyled = styled.div`
  display: flex;
  p {
    font-size: 14px;
    color: #474747;
    font-weight: bold;
    margin-right: 10px;
    margin-top: 10px;
  }
`;
const FreeGiftStyled = styled.div`
  margin-top: 20px;
`;
const FreeGiftTitleStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 160px;
  padding-bottom: 10px;
  p {
    margin: 0;
    font-size: 16px;
    color: #171717;
    font-weight: bold;
  }
`;
const OutOfStockStyled = styled.p`
  padding-top: 5px;
  color: #5c5c5c;
  font-size: 18px;
  font-weight: bold;
`;
const ArrowStyled = styled.img`
  transform: ${props => (props.openFlag ? 'rotate(0deg)' : 'rotate(180deg)')};
  margin-right: 5px;
  cursor: pointer;
`;
const CartDesktopProduct = ({
  productId,
  productName,
  productImage,
  sizeType,
  parentSku,
  sku,
  priceInclTax,
  originalPrice,
  rowTotalInclTax,
  isConfigurable,
  qty,
  minQty,
  maxQty,
  selectedSize,
  isOutOfStock,
  freeGift,
  productPath,
  product,
  deleteCartItemHandler,
  updateProductQtyHandler,
  changeSizeItemHandler,
  translate,
  itemIndex,
}) => {
  const [showFreeGiftFlag, setShowFreeGiftFlag] = useState(false);
  const gtmCustomAttributes = getProductCustomAttributesProductPreview({
    product,
    options: { position: itemIndex + 1, section: GTM_SECTION_CART },
  });
  return (
    <CartDesktopProductStyled>
      <CartDesktopProductDetailStyled>
        <Link to={productPath} {...gtmCustomAttributes}>
          <CartDesktopProductDetailImageStyled
            id={generateElementId(
              ELEMENT_TYPE.IMAGE,
              ELEMENT_ACTION.VIEW,
              'ImageProductItem',
              'CartDesktop',
              sku,
            )}
            src={productImage}
            alt={productName}
          />
        </Link>
        <CartDesktopProductDetailDescriptionStyled>
          <CartDesktopProductDeleteStyled>
            <DeleteCartItem
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.REMOVE,
                'DeleteProductItem',
                'CartDesktop',
                sku,
              )}
              deleteCartItemHandler={deleteCartItemHandler}
              productId={productId}
              product={product}
              parentSku={parentSku}
              qty={qty}
            />
          </CartDesktopProductDeleteStyled>
          <Link to={productPath} {...gtmCustomAttributes}>
            <CartDesktopProductDetailDescriptionName
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'NameProductItem',
                'CartDesktop',
                sku,
              )}
            >
              {productName}
            </CartDesktopProductDetailDescriptionName>
          </Link>
          <CartDesktopProductDetailDescriptionPrice>
            <CartDesktopProductDetailDescriptionPriceFinal
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceIncTaxProductItem',
                'CartDesktop',
                sku,
              )}
            >
              ฿{formatPrice(priceInclTax, 2)}
            </CartDesktopProductDetailDescriptionPriceFinal>
            {originalPrice !== priceInclTax ? (
              <CartDesktopProductDetailDescriptionPriceOriginal
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'PriceOriginalProductItem',
                  'CartDesktop',
                  sku,
                )}
              >
                ฿{formatPrice(originalPrice, 2)}
              </CartDesktopProductDetailDescriptionPriceOriginal>
            ) : null}
          </CartDesktopProductDetailDescriptionPrice>
          <CartDesktopProductSummaryStyled>
            <CartDesktopProductSummaryInputStyled>
              <CartDesktopProductSummaryInputSizingStyled>
                <p>{translate('shopping_bag.size')}</p>
                <SizeBox
                  sku={sku}
                  qty={qty}
                  productId={productId}
                  parentSku={parentSku}
                  changeSizeItemHandler={changeSizeItemHandler}
                  deleteCartItemHandler={deleteCartItemHandler}
                  isConfigurable={isConfigurable}
                  disableFlag={false}
                  selectedSize={selectedSize}
                  id={generateElementId(
                    ELEMENT_TYPE.SELECT,
                    ELEMENT_ACTION.EDIT,
                    'SelectSizeProductItem',
                    'CartDesktop',
                    sku,
                  )}
                  sizeType={sizeType}
                  fontSize="14px"
                  width="120px"
                />
              </CartDesktopProductSummaryInputSizingStyled>
              <QuantityBoxStyled>
                <p>{translate('shopping_bag.quantity')}</p>
                <QuantityBox
                  inputId={generateElementId(
                    ELEMENT_TYPE.SELECT,
                    ELEMENT_ACTION.EDIT,
                    'QuantityBoxProductItem',
                    'CartDesktop',
                    sku,
                  )}
                  disableBoxFlag={isOutOfStock}
                  productId={productId}
                  qty={qty}
                  minQty={minQty}
                  maxQty={maxQty}
                  updateProductQtyHandler={updateProductQtyHandler}
                />
              </QuantityBoxStyled>
            </CartDesktopProductSummaryInputStyled>
            <CartDesktopProductSummaryPriceStyled>
              <CartDesktopProductSummaryPriceLabelStyled>
                {translate('shopping_bag.total')}
              </CartDesktopProductSummaryPriceLabelStyled>
              {isOutOfStock ? (
                <OutOfStockStyled
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'PriceSummaryProductItem',
                    'CartDesktop',
                    sku,
                  )}
                >
                  {translate('shopping_bag.out_of_stock')}
                </OutOfStockStyled>
              ) : (
                <CartDesktopProductSummaryPriceDataStyled
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'PriceSummaryProductItem',
                    'CartDesktop',
                    sku,
                  )}
                >
                  ฿{formatPrice(rowTotalInclTax, 2)}
                </CartDesktopProductSummaryPriceDataStyled>
              )}
            </CartDesktopProductSummaryPriceStyled>
          </CartDesktopProductSummaryStyled>
        </CartDesktopProductDetailDescriptionStyled>
      </CartDesktopProductDetailStyled>{' '}
      {freeGift.length !== 0 && (
        <FreeGiftStyled>
          <FreeGiftTitleStyled>
            <p>{translate('shopping_bag.free_gift_item')}</p>
            <ArrowStyled
              onClick={() => setShowFreeGiftFlag(!showFreeGiftFlag)}
              src="/static/icons/ArrowUp.svg"
              height="30px"
              width="35px"
              openFlag={showFreeGiftFlag}
            />
          </FreeGiftTitleStyled>
          {showFreeGiftFlag &&
            freeGift.map((item, index) => {
              const freeGiftName =
                item?.productName || translate('shopping_bag.free_gift');
              const freeGiftImagePath = item?.productImage || '';
              const freeGiftIsOutOfStock = item?.isOutOfStock || false;
              const freeGiftQty = item?.productQuantity || 0;
              return (
                <FreeGiftCard
                  freeGiftName={freeGiftName}
                  freeGiftImagePath={freeGiftImagePath}
                  freeGiftIsOutOfStock={freeGiftIsOutOfStock}
                  freeGiftQty={freeGiftQty}
                  key={index}
                />
              );
            })}
        </FreeGiftStyled>
      )}
    </CartDesktopProductStyled>
  );
};

export default withLocales(CartDesktopProduct);
