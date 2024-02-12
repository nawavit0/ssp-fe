import React from 'react';
import styled from 'styled-components';
import { withLocales, Link } from '@central-tech/core-ui';
import ImageLazy from '../../../../../components/Image/ImageLazy';
import { formatPrice } from '../../../../../utils/formatPrice';
import {
  getProductCustomAttributesProductPreview,
  GTM_SECTION_WISHLIST,
} from '../../../../../utils/gtm';

import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../../utils/generateElementId';

const WishlistDesktopStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 16px 0;
`;
const ProductItemStyled = styled.div`
  width: 50%;
  padding: 8px;
`;
const ProductItemBoxStyled = styled.div`
  border: 1px solid #ccc;
  display: flex;
  flex-direction: row;
  padding: 8px;
  position: relative;
`;
const RemoveWishlistStyled = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`;
const FlexBoxStyled = styled.div`
  display: flex;
  margin: 8px 0;
  width: 100%;
`;
const BlockStyled = styled.div`
  display: block;
  margin: 16px 8px;
  width: 100%;
`;
const ProductFlexBoxBottomStyled = styled.div`
  align-items: baseline;
  display: flex;
`;
const ProductFlexBoxCenterStyled = styled.div`
  display: block;
  line-height: 21px;
  vertical-align: middle;
`;
const ProductImageStyled = styled.div`
  width: 100%;
  height: auto;
  padding: 8px;
  max-width: 200px;
  max-height: 200px;
`;
const ProductContentStyled = styled.div`
  padding: 8px;
  width: 100%;
`;
const ProductBrandStyled = styled.div`
  > a {
    font-size: 18px;
    color: #000;
    line-height: 150%;
  }
`;
const ProductNameStyled = styled.div`
  > a {
    font-size: 14px;
    color: #474747;
    line-height: 150%;
  }
`;
const ProductPriceStyled = styled.div`
  font-size: 20px;
  color: #dd0000;
  line-height: 30px;
  margin-right: 4px;
`;
const ProductSpecialPriceStyled = styled.div`
  font-size: 12px;
  color: #5c5c5c;
  text-decoration: line-through;
`;
const ProductSizeLabelStyled = styled.div`
  font-size: 14px;
  color: #363636;
  margin-right: 6px;
  text-transform: capitalize;
  display: inline-block;
`;
const ProductSizeSimpleStyled = styled.div`
  font-size: 12px;
  color: #363636;
  display: inline-block;
`;
const AddToCartItemStyled = styled.button`
  background: #13283f;
  color: #fff;
  width: 100%;
  cursor: pointer;
  font-size: 15px;
  line-height: 48px;
  text-align: center;
  display: block;
  vertical-align: middle;
  text-transform: uppercase;
  height: 48px;
  -webkit-transition: all 150ms ease;
  -o-transition: all 150ms ease;
  transition: all 150ms ease;
  border: none;
  &:hover {
    background: #1f4166;
  }
`;

const OutOfStockStyled = styled(Link)`
  background: #cccccc;
  color: #fff;
  width: 100%;
  cursor: default;
  font-size: 15px;
  line-height: 48px;
  text-align: center;
  display: block;
  vertical-align: middle;
  text-transform: uppercase;
  height: 48px;
  -webkit-transition: all 150ms ease;
  -o-transition: all 150ms ease;
  transition: all 150ms ease;
`;

const AddToCartAllItemsStyled = styled.button`
  background: #78e723;
  color: #13283f;
  width: 413px;
  max-width: 100%;
  cursor: pointer;
  font-size: 19px;
  line-height: 48px;
  text-align: center;
  vertical-align: middle;
  text-transform: uppercase;
  height: 48px;
  display: block;
  margin: 0 auto;
  -webkit-transition: all 150ms ease;
  -o-transition: all 150ms ease;
  transition: all 150ms ease;
  border: none;
  &:hover {
    background: #6bd918;
  }
`;

const DisableAddToCartAllItemsStyled = styled.button`
  background: #cccccc;
  color: #13283f;
  width: 413px;
  max-width: 100%;
  cursor: default;
  font-size: 19px;
  line-height: 48px;
  text-align: center;
  vertical-align: middle;
  text-transform: uppercase;
  height: 48px;
  display: block;
  margin: 0 auto;
  -webkit-transition: all 150ms ease;
  -o-transition: all 150ms ease;
  transition: all 150ms ease;
  border: none;
`;

const WishlistHeaderStyled = styled.h3`
  color: #373737;
  font-size: 28px;
  margin: 8px 0;
  text-transform: uppercase;
`;
const WishlistIntroStyled = styled.div`
  font-size: 14px;
  color: #484848;
  line-height: 150%;
  > div {
    margin: 8px 0;
    text-align: center;
  }
  img {
    margin: 4px;
  }
`;
const WishlistHeroIconStyled = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const SeparateLineStyled = styled.div`
  border-top: 1px solid #e2e2e2;
  margin: 16px 0;
  width: 100%;
`;

const WishlistItemCountStyled = styled.span`
  color: #949494;
  font-size: 16px;
  margin: 0 8px;
  text-transform: lowercase;
`;

const WishlistNotFoundStyled = styled.div`
  margin: 0 auto;
`;

const ContinueShoppingButtonStyled = styled(Link)`
  background: #13283f;
  color: #fff;
  width: 100%;
  cursor: pointer;
  display: block;
  text-align: center;
  line-height: 48px;
  font-size: 15px;
  vertical-align: middle;
  text-transform: uppercase;
  height: 48px;
  -webkit-transition: all 150ms ease;
  -o-transition: all 150ms ease;
  transition: all 150ms ease;
  &:hover {
    background: #1f4166;
  }
`;

const renderItems = ({
  handleAddToCart,
  handleDeleteFromWishlist,
  items,
  imageUrl,
  addedWishlistStatus,
  translate,
}) => {
  return items.map((item, itemIndex) => {
    const itemId = item?.wishlist_item_id || 0;
    const product = item?.product || {};
    const gtmCustomAttributes = getProductCustomAttributesProductPreview({
      product,
      options: { position: itemIndex + 1, section: GTM_SECTION_WISHLIST },
    });
    const productImage = `${imageUrl}${product?.image || ''}`;
    const productName = product?.name || '';
    const brandName = product?.custom_attributes_option?.brand_name || '';
    const isConfigurable = product?.type_id === 'configurable';
    const brandUrl = `/${product?.extension_attributes?.brand?.url_key || ''}`;
    const sizeType = product?.custom_attributes?.size_type || '';
    const productUrl = `/${product?.url_key || '/'}`;
    let productPrice = product?.price || null;
    let productSpecialPrice = product?.special_price || null;
    let sizeSimple =
      product?.custom_attributes_option?.product_size_simple || '';
    const salable = product?.extension_attributes?.salable || false;
    if (isConfigurable) {
      const customAttribute = item?.custom_attributes || [];
      const childrenProduct = product?.configurable_product_items || [];
      let activeProduct = {};
      childrenProduct.map(child => {
        const attrCode = customAttribute?.[0]?.attribute_code;
        const attrValue = customAttribute?.[0]?.value;
        const productAttrValue = child.custom_attributes?.[attrCode];
        if (productAttrValue === attrValue) {
          activeProduct = child;
        }
      });
      sizeSimple =
        activeProduct?.custom_attributes_option?.product_size_simple || '';
      productPrice = activeProduct?.price || null;
      productSpecialPrice = activeProduct?.special_price || null;
    }
    const configurableItemOptions = isConfigurable
      ? {
          option_id:
            product?.extension_attributes?.configurable_product_options[0]?.attribute_id?.toString() ||
            '',
          option_value: parseInt(item?.custom_attributes?.[0]?.value || 0),
        }
      : null;
    const addedStatus =
      addedWishlistStatus && addedWishlistStatus === item?.wishlist_item_id;

    return (
      <ProductItemStyled key={itemId}>
        <ProductItemBoxStyled>
          <RemoveWishlistStyled
            id={generateElementId(
              ELEMENT_TYPE.BUTTON,
              ELEMENT_ACTION.REMOVE,
              'Remove',
              'WishlistItemDesktop',
              itemId,
            )}
            onClick={() => handleDeleteFromWishlist(itemId)}
          >
            <ImageLazy
              src={`/static/icons/CloseIcon.svg`}
              alt={`close`}
              width={`16px`}
            />
          </RemoveWishlistStyled>
          <ProductImageStyled>
            <Link to={productUrl}>
              <ImageLazy width={`200px`} src={productImage} alt={productName} />
            </Link>
          </ProductImageStyled>
          <ProductContentStyled>
            <FlexBoxStyled>
              <ProductBrandStyled>
                <Link
                  id={generateElementId(
                    ELEMENT_TYPE.LINK,
                    ELEMENT_ACTION.VIEW,
                    'Brand',
                    'WishlistItemDesktop',
                    itemId,
                  )}
                  to={brandUrl}
                >
                  {brandName}
                </Link>
              </ProductBrandStyled>
            </FlexBoxStyled>
            <FlexBoxStyled>
              <ProductNameStyled>
                <Link
                  id={generateElementId(
                    ELEMENT_TYPE.LINK,
                    ELEMENT_ACTION.VIEW,
                    'Name',
                    'WishlistItemDesktop',
                    itemId,
                  )}
                  to={productUrl}
                  {...gtmCustomAttributes}
                >
                  {productName}
                </Link>
              </ProductNameStyled>
            </FlexBoxStyled>
            <FlexBoxStyled>
              <ProductFlexBoxBottomStyled>
                <ProductPriceStyled
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'Price',
                    'WishlistItemDesktop',
                    itemId,
                  )}
                >{`฿${formatPrice(productPrice)}`}</ProductPriceStyled>
                {productSpecialPrice && (
                  <ProductSpecialPriceStyled
                    id={generateElementId(
                      ELEMENT_TYPE.INFO,
                      ELEMENT_ACTION.VIEW,
                      'SpecialPrice',
                      'WishlistItemDesktop',
                      itemId,
                    )}
                  >{`฿${formatPrice(
                    productSpecialPrice,
                  )}`}</ProductSpecialPriceStyled>
                )}
              </ProductFlexBoxBottomStyled>
            </FlexBoxStyled>
            <FlexBoxStyled>
              <ProductFlexBoxCenterStyled>
                <ProductSizeLabelStyled>
                  {translate('account_wishlist.size')}
                </ProductSizeLabelStyled>
                <ProductSizeSimpleStyled
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'Size',
                    'WishlistItemDesktop',
                    itemId,
                  )}
                >
                  {sizeType + sizeSimple}
                </ProductSizeSimpleStyled>
              </ProductFlexBoxCenterStyled>
            </FlexBoxStyled>
            <FlexBoxStyled>
              {salable ? (
                <AddToCartItemStyled
                  id={generateElementId(
                    ELEMENT_TYPE.BUTTON,
                    ELEMENT_ACTION.ADD,
                    'AddToCart',
                    'WishlistItemDesktop',
                    itemId,
                  )}
                  onClick={() =>
                    handleAddToCart(product, configurableItemOptions, itemId)
                  }
                  disabled={addedStatus}
                >
                  {addedStatus
                    ? translate('account_wishlist.added_to_cart')
                    : translate('account_wishlist.add_to_cart')}
                </AddToCartItemStyled>
              ) : (
                <OutOfStockStyled
                  id={generateElementId(
                    ELEMENT_TYPE.BUTTON,
                    ELEMENT_ACTION.ADD,
                    'AddToCart',
                    'WishlistItemDesktop',
                    itemId,
                  )}
                >
                  {translate('account_wishlist.out_of_stock')}
                </OutOfStockStyled>
              )}
            </FlexBoxStyled>
          </ProductContentStyled>
        </ProductItemBoxStyled>
      </ProductItemStyled>
    );
  });
};

const renderWishlistNotFound = props => {
  const { translate } = props;
  return (
    <WishlistNotFoundStyled>
      <WishlistIntroStyled>
        <WishlistHeroIconStyled>
          <ImageLazy
            src={`/static/icons/HeartGray-01.svg`}
            width={`60px`}
            alt={`Heart`}
          />
        </WishlistHeroIconStyled>
        <div
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'EmptyQuote1',
            'WishlistSummaryDesktop',
          )}
        >
          {translate('account_wishlist.empty_wishlist')}
        </div>
        <div
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'EmptyQuote2',
            'WishlistSummaryDesktop',
          )}
        >
          {translate('account_wishlist.intro_01')}
          <ImageLazy
            src={`/static/icons/HeartGray-01.svg`}
            width={`16px`}
            alt={`Heart`}
          />
          {translate('account_wishlist.intro_02')}
        </div>
      </WishlistIntroStyled>
      <ContinueShoppingButtonStyled
        id={generateElementId(
          ELEMENT_TYPE.LINK,
          ELEMENT_ACTION.VIEW,
          'ContinueShopping',
          'WishlistSummaryDesktop',
        )}
        to={`/`}
      >
        {translate('account_wishlist.go_shopping')}
      </ContinueShoppingButtonStyled>
    </WishlistNotFoundStyled>
  );
};

const renderSkeletionLoading = () => {
  return <div>Wishlist Loading...</div>;
};

const WishlistDesktop = props => {
  const {
    loading,
    items,
    wishlistTotal,
    handleAddAllToCart,
    addedAllWishlistStatus,
    translate,
  } = props;
  if (loading) {
    return renderSkeletionLoading();
  }
  const itemSalable = items.filter(
    item => item?.product?.extension_attributes?.salable,
  );
  const canAddAll = itemSalable.length > 0;
  return (
    <WishlistDesktopStyled>
      <BlockStyled>
        <WishlistHeaderStyled>
          {translate('account_wishlist.wishlist')}
          <WishlistItemCountStyled
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'TotalQty',
              'WishlistSummaryDesktop',
            )}
          >
            {`(${wishlistTotal} ${
              wishlistTotal > 1
                ? translate('account_wishlist.items')
                : translate('account_wishlist.item')
            })`}
          </WishlistItemCountStyled>
        </WishlistHeaderStyled>
        <SeparateLineStyled />
        {wishlistTotal > 0 && (
          <WishlistIntroStyled>
            {translate('account_wishlist.intro_01')}
            <ImageLazy
              src={`/static/icons/HeartGray-01.svg`}
              width={`16px`}
              alt={`Heart`}
            />
            {translate('account_wishlist.intro_02')}
          </WishlistIntroStyled>
        )}
      </BlockStyled>
      {wishlistTotal > 0 ? renderItems(props) : renderWishlistNotFound(props)}
      {wishlistTotal > 0 && (
        <FlexBoxStyled>
          {canAddAll ? (
            <AddToCartAllItemsStyled
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.ADD,
                'AddAllToCart',
                'WishlistSummaryDesktop',
              )}
              onClick={() => handleAddAllToCart(itemSalable)}
              disabled={addedAllWishlistStatus}
            >
              {addedAllWishlistStatus
                ? translate('account_wishlist.added_all_items_to_bag')
                : translate('account_wishlist.add_all_items_to_bag')}
            </AddToCartAllItemsStyled>
          ) : (
            <DisableAddToCartAllItemsStyled
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.ADD,
                'AddAllToCart',
                'WishlistSummaryDesktop',
              )}
            >
              {translate('account_wishlist.add_all_items_to_bag')}
            </DisableAddToCartAllItemsStyled>
          )}
        </FlexBoxStyled>
      )}
    </WishlistDesktopStyled>
  );
};

export default withLocales(WishlistDesktop);
