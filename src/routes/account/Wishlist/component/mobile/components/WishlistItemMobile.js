import React from 'react';
import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';
import ImageV2 from '../../../../../../components/Image/ImageV2';
import { formatPrice } from '../../../../../../utils/formatPrice';
import {
  getProductCustomAttributesProductPreview,
  GTM_SECTION_WISHLIST,
} from '../../../../../../utils/gtm';

import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../../../../utils/generateElementId';

const WishlistItemMobile = ({
  className,
  imageUrl,
  item,
  itemIndex,
  handleAddToCart,
  handleDeleteFromWishlist,
  addedStatus,
  translate,
}) => {
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
  let sizeSimple = product?.custom_attributes_option?.product_size_simple || '';
  const configurableItemOptions = isConfigurable
    ? {
        option_id:
          product?.extension_attributes?.configurable_product_options[0]?.attribute_id?.toString() ||
          '',
        option_value: parseInt(item?.custom_attributes?.[0]?.value || 0),
      }
    : null;
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
  const salable = product?.extension_attributes?.salable || false;
  return (
    <div className={className} key={itemId}>
      <ImageV2
        id={generateElementId(
          ELEMENT_TYPE.BUTTON,
          ELEMENT_ACTION.REMOVE,
          'Remove',
          'WishlistItemMobile',
          itemId,
        )}
        className="remove"
        src={`/static/icons/CloseIconBold.svg`}
        alt={`close`}
        width={`15px`}
        onClick={() => handleDeleteFromWishlist(itemId)}
      />
      <div className="body">
        <div className="image">
          <ImageV2 src={productImage} alt={productName} />
        </div>
        <div className="content">
          <Link
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              'Brand',
              'WishlistItemMobile',
              itemId,
            )}
            className="brand"
            to={brandUrl}
          >
            {brandName}
          </Link>
          <Link
            id={generateElementId(
              ELEMENT_TYPE.LINK,
              ELEMENT_ACTION.VIEW,
              'Name',
              'WishlistItemMobile',
              itemId,
            )}
            className="name"
            to={productUrl}
            {...gtmCustomAttributes}
          >
            {productName}
          </Link>
          <div className="price">
            <div
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'Price',
                'WishlistItemMobile',
                itemId,
              )}
              className="special-price"
            >
              {`฿${formatPrice(productPrice)}`}
            </div>
            {productSpecialPrice && (
              <div
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'SpecialPrice',
                  'WishlistItemMobile',
                  itemId,
                )}
                className="original-price"
              >
                {`฿${formatPrice(productSpecialPrice)}`}
              </div>
            )}
          </div>
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'Size',
              'WishlistItemMobile',
              itemId,
            )}
            className="size"
          >
            {translate('account_wishlist.size')}
            <span>{sizeType + sizeSimple}</span>
          </div>
        </div>
      </div>
      <div className="footer">
        <button
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.ADD,
            'AddToCart',
            'WishlistItemMobile',
            itemId,
          )}
          className={`cart ${!salable && 'disabled'}`}
          onClick={() =>
            handleAddToCart(product, configurableItemOptions, itemId)
          }
          disabled={!salable || addedStatus}
        >
          {salable
            ? addedStatus
              ? translate('account_wishlist.added_to_cart')
              : translate('account_wishlist.add_to_cart')
            : translate('account_wishlist.out_of_stock')}
        </button>
      </div>
    </div>
  );
};

const StyledWishlistItemMobile = styled(WishlistItemMobile)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 28px 16px 10px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  position: relative;

  > .remove {
    position: absolute;
    top: 12px;
    right: 16px;
    cursor: pointer;
  }

  > .body {
    display: flex;
    flex-direction: row;
    margin-bottom: 8px;

    > .image {
      width: 140px;
      height: 140px;
      margin-right: 10px;
    }

    > .content {
      display: flex;
      flex-direction: column;
      line-height: 1;

      > .brand {
        font-size: 16px;
        color: #000;
        margin-bottom: 4px;
      }

      > .name {
        font-size: 14px;
        color: #474747;
        margin-bottom: 10px;
      }

      > .price {
        margin-bottom: 10px;
        > .special-price {
          font-size: 18px;
          color: #dd0000;
        }

        > .original-price {
          font-size: 12px;
          color: #5c5c5c;
          text-decoration: line-through;
          margin-top: 4px;
        }
      }

      > .size {
        margin-bottom: 4px;
        font-size: 14px;
        color: #363636;

        > span {
          margin-left: 4px;
          font-size: 12px;
          color: #363636;
        }
      }
    }
  }

  > .footer {
    > .cart {
      background: #13283f;
      color: #fff;
      width: 100%;
      font-size: 15px;
      line-height: 2.5;
      text-align: center;
      display: block;
      vertical-align: middle;
      text-transform: uppercase;
      height: 40px;
      -webkit-transition: all 150ms ease;
      -o-transition: all 150ms ease;
      transition: all 150ms ease;
      border: none;
    }
    > .cart.disabled {
      background: #cccccc;
    }
  }
`;

const MemoWishlistItemMobile = React.memo(StyledWishlistItemMobile);

export {
  MemoWishlistItemMobile as WishlistItemMobile,
  MemoWishlistItemMobile as default,
};
