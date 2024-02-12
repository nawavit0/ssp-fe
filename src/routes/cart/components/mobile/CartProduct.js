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

const CardMobileProductStyled = styled.div`
  padding: 0;
`;
const CardMobileProductDetailStyled = styled.div`
  display: grid;
  grid-template-columns: minmax(120px, 20%) 1fr;
  grid-gap: 10px;
  margin-bottom: 10px;
`;
const CardMobileProductDetailImageStyled = styled(ImageV2)`
  width: 100%;
`;
const CardMobileProductDetailDescriptionStyled = styled.div`
  position: relative;
  h3 {
    font-size: 14px;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;
const CardMobileProductDetailDescriptionName = styled.p`
  color: #474747;
  font-size: 12px;
  margin: 0 0 20px;
  padding-right: 20px;
  line-height: 1.6;
  font-weight: bold;
`;
const CardMobileProductDetailDescriptionPrice = styled.div`
  font-size: 12px;
  margin: 0 0 10px;

  display: grid;
`;
const CardMobileProductDetailDescriptionPriceOriginal = styled.p`
  text-decoration: line-through;
  margin: 0;
  color: #5c5c5c;
  font-size: 11px;
`;
const CardMobileProductDetailDescriptionPriceFinal = styled.p`
  color: #dd0000;
  font-size: 17px;
  margin: 0;
  font-weight: 300;
`;
const CardMobileProductSummaryStyled = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const CardMobileProductSummaryInputStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;
const CardMobileProductSummaryPriceStyled = styled.div`
  text-align: right;
  p {
    margin: 0;
    font-weight: bold;
  }
`;
const CardMobileProductSummaryPriceLabelStyled = styled.p`
  color: #3d3d3d;
  font-size: 9px;
  font-weight: bold;
`;
const CardMobileProductSummaryPriceDataStyled = styled.p`
  color: #dd0a0a;
  font-size: 18px;
  font-weight: bold;
`;
const CardMobileProductSummaryInputSizingStyled = styled.div`
  margin-right: 20px;
  p {
    margin-top: 0;
    margin-bottom: 3px;
    color: #474747;
    font-weight: bold;
    font-size: 9px;
  }
`;
const CardMobileProductDeleteStyled = styled.div`
  position: absolute;
  right: 0;
  top: -1px;
  width: 12px;
  height: 12px;
`;
const QuantityBoxStyled = styled.div`
  p {
    margin-top: 0;
    margin-bottom: 3px;
    font-weight: bold;
    font-size: 9px;
    color: #474747;
  }
`;
const FreeGiftStyled = styled.div`
  margin-top: 20px;
`;
const FreeGiftTitleStyled = styled.div`
  display: flex;
  justify-content: space-between;
  p {
    margin: 0;
    font-size: 13px;
    color: #171717;
    font-weight: bold;
  }
`;
const OutOfStockStyled = styled.p`
  padding-top: 15px;
  color: #5c5c5c;
  font-size: 13px;
  font-weight: bold;
`;
const ArrowStyled = styled.img`
  transform: ${props => (props.openFlag ? 'rotate(0deg)' : 'rotate(180deg)')};
`;
const CardMobileProduct = ({
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
    <CardMobileProductStyled>
      <CardMobileProductDetailStyled>
        <Link to={productPath} {...gtmCustomAttributes}>
          <CardMobileProductDetailImageStyled
            id={generateElementId(
              ELEMENT_TYPE.IMAGE,
              ELEMENT_ACTION.VIEW,
              'ImageProductItem',
              'CartMobile',
              sku,
            )}
            src={productImage}
            alt={productName}
          />
        </Link>
        <CardMobileProductDetailDescriptionStyled>
          <CardMobileProductDeleteStyled>
            <DeleteCartItem
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.REMOVE,
                'DeleteProductItem',
                'CartMobile',
                sku,
              )}
              deleteCartItemHandler={deleteCartItemHandler}
              productId={productId}
              product={product}
              parentSku={parentSku}
              qty={qty}
            />
          </CardMobileProductDeleteStyled>
          <Link to={productPath} {...gtmCustomAttributes}>
            <CardMobileProductDetailDescriptionName
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'NameProductItem',
                'CartMobile',
                sku,
              )}
            >
              {productName}
            </CardMobileProductDetailDescriptionName>
          </Link>
          <CardMobileProductDetailDescriptionPrice>
            <CardMobileProductDetailDescriptionPriceFinal
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceIncTaxProductItem',
                'CartMobile',
                sku,
              )}
            >
              ฿{formatPrice(priceInclTax, 2)}
            </CardMobileProductDetailDescriptionPriceFinal>
            {originalPrice !== priceInclTax ? (
              <CardMobileProductDetailDescriptionPriceOriginal
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'PriceOriginalProductItem',
                  'CartMobile',
                  sku,
                )}
              >
                ฿{formatPrice(originalPrice, 2)}
              </CardMobileProductDetailDescriptionPriceOriginal>
            ) : null}
          </CardMobileProductDetailDescriptionPrice>
        </CardMobileProductDetailDescriptionStyled>
        <CardMobileProductSummaryInputStyled>
          <CardMobileProductSummaryInputSizingStyled>
            <p>{translate('shopping_bag.size')}</p>
            <SizeBox
              changeSizeItemHandler={changeSizeItemHandler}
              qty={qty}
              sku={sku}
              productId={productId}
              parentSku={parentSku}
              disableFlag={false}
              selectedSize={selectedSize}
              isConfigurable={isConfigurable}
              id={generateElementId(
                ELEMENT_TYPE.SELECT,
                ELEMENT_ACTION.EDIT,
                'SelectSizeProductItem',
                'CartMobile',
                sku,
              )}
              sizeType={sizeType}
              fontSize="11px"
              width="105px"
            />
          </CardMobileProductSummaryInputSizingStyled>
        </CardMobileProductSummaryInputStyled>
        <CardMobileProductSummaryStyled>
          <QuantityBoxStyled>
            <p>{translate('shopping_bag.quantity')}</p>
            <QuantityBox
              inputId={generateElementId(
                ELEMENT_TYPE.SELECT,
                ELEMENT_ACTION.EDIT,
                'QuantityBoxProductItem',
                'CartMobile',
                sku,
              )}
              productId={productId}
              disableBoxFlag={isOutOfStock}
              qty={qty}
              minQty={minQty}
              maxQty={maxQty}
              fontSize="11px"
              layoutWidth="103px"
              buttonWidth="33px"
              inputWidth="36px"
              updateProductQtyHandler={updateProductQtyHandler}
            />
          </QuantityBoxStyled>
          <CardMobileProductSummaryPriceStyled>
            <CardMobileProductSummaryPriceLabelStyled>
              {translate('shopping_bag.total')}
            </CardMobileProductSummaryPriceLabelStyled>
            {isOutOfStock ? (
              <OutOfStockStyled
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'PriceSummaryProductItem',
                  'CartMobile',
                  sku,
                )}
              >
                {translate('shopping_bag.out_of_stock')}
              </OutOfStockStyled>
            ) : (
              <CardMobileProductSummaryPriceDataStyled
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'PriceSummaryProductItem',
                  'CartMobile',
                  sku,
                )}
              >
                ฿{formatPrice(rowTotalInclTax, 2)}
              </CardMobileProductSummaryPriceDataStyled>
            )}
          </CardMobileProductSummaryPriceStyled>
        </CardMobileProductSummaryStyled>
      </CardMobileProductDetailStyled>
      {freeGift.length !== 0 && (
        <FreeGiftStyled>
          <FreeGiftTitleStyled>
            <p>{translate('shopping_bag.free_gift_item')}</p>
            <ArrowStyled
              onClick={() => setShowFreeGiftFlag(!showFreeGiftFlag)}
              src="/static/icons/ArrowUp.svg"
              height="18"
              width="20"
              openFlag={showFreeGiftFlag}
            />
          </FreeGiftTitleStyled>
          {showFreeGiftFlag &&
            freeGift.map((item, index) => {
              const freeGiftName =
                item?.productName || translate('shopping_bag.free_gift');
              const freeGiftImagePath = item?.productImage || '';
              const freeGiftIsOutOfStock = item?.isOutOfStock || false;
              return (
                <FreeGiftCard
                  freeGiftName={freeGiftName}
                  freeGiftImagePath={freeGiftImagePath}
                  freeGiftIsOutOfStock={freeGiftIsOutOfStock}
                  index={index}
                />
              );
            })}
        </FreeGiftStyled>
      )}
    </CardMobileProductStyled>
  );
};

export default withLocales(CardMobileProduct);
