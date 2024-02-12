import React, { useState, useEffect } from 'react';
import { withLocales, withStoreConfig } from '@central-tech/core-ui';
import { sendGTMProductRemoveFromCartConfigurable } from '../../utils/gtm';
import CartMobile from './components/mobile/CartMobile';
import CartDesktop from './components/desktop/CartDesktop';
import { groupBy } from 'lodash';
import propTypes from 'prop-types';

const CartContainer = (props, { customer }) => {
  const {
    userCartId,
    totalItemQuantity,
    cartItems,
    cartFreeItems,
    shippingCost,
    discountAmount,
    baseGrandTotal,
    subTotalInclTax,
    earnTheOnePoint,
    appliedCoupons,
    giftWrap,
    giftWrapFlag,
    isMobile,
    activeConfig,
    addCouponMutation,
    addCouponResult,
    editCartItem,
    changeSizeItem,
    deleteCoupon,
    addGiftWrapMessage,
    deleteGiftWrapMessage,
    deleteCartItem,
    translate,
  } = props;
  const baseMediaUrl = activeConfig?.base_media_url || '';
  const productUrl = `${baseMediaUrl}catalog/product`;
  const isGuest = !(customer?.id || false);
  const guestCartId = customer?.guest?.cartId || '';
  const cartId = isGuest ? guestCartId : userCartId;
  const cartItemWithSeller = getCartItems(cartItems, cartFreeItems, productUrl);
  const [giftFlag, setGiftFlag] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [promotionCodeErrorFlag, setPromotionCodeErrorFlag] = useState(false);
  const [promotionCode, setPromotionCode] = useState('');
  const [submitPromotionMessage, setSubmitPromotionMessage] = useState('');
  const submittedPromotionCode = appliedCoupons;

  useEffect(() => {
    const validCoupon = addCouponResult?.valid_coupon || [];
    const invalidCoupon = addCouponResult?.invalid_coupon || [];
    if (validCoupon.includes(promotionCode)) {
      setSubmitPromotionMessage(
        `${translate(
          'shopping_bag.you_used_promotion_code',
        )} "${promotionCode}"`,
      );
      setPromotionCodeErrorFlag(false);
    } else if (invalidCoupon.includes(promotionCode)) {
      setSubmitPromotionMessage(
        translate('shopping_bag.invalid_promotion_code'),
      );
      setPromotionCodeErrorFlag(true);
    }
  }, [addCouponResult, promotionCode, translate]);
  useEffect(() => {
    setGiftFlag(giftWrapFlag);
  }, [giftWrapFlag]);

  const submitPromotionHandler = async () => {
    const isDuplicateCode =
      !!appliedCoupons.find(coupon => {
        return coupon?.toLowerCase() === promotionCode?.toLowerCase();
      }) || false;
    if (isDuplicateCode) {
      setSubmitPromotionMessage(
        `${translate('shopping_bag.you_have_entered_code')} "${promotionCode}"`,
      );
      setPromotionCodeErrorFlag(true);
    } else {
      let couponString = '';
      submittedPromotionCode.map(coupon => {
        couponString = couponString.concat(coupon, ',');
      });
      couponString = couponString.concat(promotionCode);
      try {
        await addCouponMutation({
          promotionCode: couponString,
          cartId,
          isGuest,
        });
      } catch (err) {
        setSubmitPromotionMessage(
          translate('shopping_bag.invalid_promotion_code'),
        );
        setPromotionCodeErrorFlag(true);
      }
    }
    setPromotionCode('');
  };
  const promotionCodeHandler = code => {
    setPromotionCode(code);
  };
  const removeSubmittedPromotionCodeHandler = async promotionCode => {
    const removedSubmittedPromotionCode = submittedPromotionCode.filter(
      e => e !== promotionCode,
    );
    try {
      if (removedSubmittedPromotionCode.length) {
        let couponString = '';
        removedSubmittedPromotionCode.map(coupon => {
          couponString = couponString.concat(coupon, ',');
        });
        couponString = couponString.substring(0, couponString.length - 1);
        await addCouponMutation({
          promotionCode: couponString,
          cartId,
          isGuest,
        });
      } else {
        await deleteCoupon({ cartId, isGuest });
      }
      const submittedPromotionCodeList = submittedPromotionCode.slice();
      submittedPromotionCodeList.splice(promotionCode, 1);
      setSubmitPromotionMessage('');
    } catch (err) {}
  };
  const setGiftWrapMessageHandler = async () => {
    const message = giftMessage;
    if (giftFlag) {
      deleteGiftWrapMessage({
        cartId,
        isGuest,
      });
    } else {
      addGiftWrapMessage(message);
    }
    setGiftFlag(!giftFlag);
  };
  const changeGiftWrapMessageHandler = giftMessage => {
    setGiftMessage(giftMessage);
  };
  const deleteCartItemHandler = async (productId, product, qty, parentSku) => {
    await deleteCartItem({ guest: isGuest ? cartId : null, itemId: productId });
    sendGTMProductRemoveFromCartConfigurable({
      childProduct: product,
      parentSku,
      qty,
    });
  };
  const updateProductQtyHandler = async (productId, qty) => {
    await editCartItem({
      input: { qty: qty, quote_id: cartId },
      itemId: productId,
      cartId: cartId,
      isGuest,
    });
  };
  const changeSizeItemHandler = async (
    qty,
    parentSku,
    optionId,
    optionValue,
    currentProductId,
  ) => {
    await changeSizeItem(
      isGuest,
      cartId,
      qty,
      parentSku,
      optionId,
      optionValue,
      currentProductId,
    );
  };
  if (isMobile) {
    return (
      <CartMobile
        earnTheOnePoint={earnTheOnePoint}
        totalItemQuantity={totalItemQuantity}
        cartItemWithSeller={cartItemWithSeller}
        cartId={cartId}
        shippingCost={shippingCost}
        discountAmount={discountAmount}
        baseGrandTotal={baseGrandTotal}
        subTotalInclTax={subTotalInclTax}
        appliedCoupons={appliedCoupons}
        customer={customer}
        giftFlag={giftFlag}
        setGiftFlag={setGiftFlag}
        giftWrap={giftWrap}
        giftMessage={giftMessage}
        setGiftMessage={setGiftMessage}
        promotionCodeErrorFlag={promotionCodeErrorFlag}
        submitPromotionMessage={submitPromotionMessage}
        promotionCode={promotionCode}
        submittedPromotionCode={submittedPromotionCode}
        submitPromotionHandler={submitPromotionHandler}
        promotionCodeHandler={promotionCodeHandler}
        removeSubmittedPromotionCodeHandler={
          removeSubmittedPromotionCodeHandler
        }
        setGiftWrapMessageHandler={setGiftWrapMessageHandler}
        changeGiftWrapMessageHandler={changeGiftWrapMessageHandler}
        deleteCartItemHandler={deleteCartItemHandler}
        updateProductQtyHandler={updateProductQtyHandler}
        changeSizeItemHandler={changeSizeItemHandler}
      />
    );
  }
  return (
    <CartDesktop
      earnTheOnePoint={earnTheOnePoint}
      totalItemQuantity={totalItemQuantity}
      cartItemWithSeller={cartItemWithSeller}
      cartId={cartId}
      giftWrap={giftWrap}
      shippingCost={shippingCost}
      discountAmount={discountAmount}
      baseGrandTotal={baseGrandTotal}
      subTotalInclTax={subTotalInclTax}
      appliedCoupons={appliedCoupons}
      customer={customer}
      giftFlag={giftFlag}
      giftMessage={giftMessage}
      promotionCodeErrorFlag={promotionCodeErrorFlag}
      submitPromotionMessage={submitPromotionMessage}
      promotionCode={promotionCode}
      submittedPromotionCode={submittedPromotionCode}
      submitPromotionHandler={submitPromotionHandler}
      promotionCodeHandler={promotionCodeHandler}
      removeSubmittedPromotionCodeHandler={removeSubmittedPromotionCodeHandler}
      setGiftWrapMessageHandler={setGiftWrapMessageHandler}
      changeGiftWrapMessageHandler={changeGiftWrapMessageHandler}
      deleteCartItemHandler={deleteCartItemHandler}
      updateProductQtyHandler={updateProductQtyHandler}
      changeSizeItemHandler={changeSizeItemHandler}
    />
  );
};

const getCartItems = (cartItems, cartFreeItems, productUrl) => {
  const newCartItems = cartItems.map(item => {
    const sellerName = item?.product?.marketplace?.seller || `Supersports`;
    const isOutOfStock = !item?.product?.extension_attributes?.salable || false;
    const selectedSize =
      item?.extension_attributes?.configurable_product_labels?.[0] || '';
    const parentSku = item?.extension_attributes?.parent_sku || '';
    const productImage = item?.product?.image || false;
    const productImageWithPrefix = productImage
      ? `${productUrl}${productImage}`
      : `/static/images/DefaultImage.jpg`;
    const sizeType = item?.product?.custom_attributes?.size_type || '';
    const freeItems = item?.extension_attributes?.free_items || [];
    const transformedFreeItems = [];
    const productId = item?.item_id || '';
    const product = item?.product || {};
    freeItems.map(item => {
      const productName = item?.product?.name || '';
      const productImage = item?.product?.image || '';
      const productQuantity = item?.qty || 0;
      const isOutOfStock =
        !item?.product?.extension_attributes?.salable || false;
      transformedFreeItems.push({
        productName: productName,
        productImage: `${productUrl}${productImage}`,
        productQuantity: productQuantity,
        isOutOfStock: isOutOfStock,
      });
    });
    let minQty =
      item?.product?.extension_attributes?.stock_item?.min_sale_qty || 0;
    let maxQty =
      item?.product?.extension_attributes?.stock_item?.max_sale_qty || 0;
    const stockQty = item?.product?.extension_attributes?.stock_item?.qty || 0;
    minQty = minQty > stockQty ? stockQty : minQty;
    maxQty = maxQty > stockQty ? stockQty : maxQty;

    const isConfigurable = selectedSize !== '';
    const productSimpleUrl = `/${item?.product?.url_key || '/'}`;
    const productConfigurableUrl = `/product-sku?sku=${parentSku}`;
    const productPath = isConfigurable
      ? productConfigurableUrl
      : productSimpleUrl;

    const cartGroupBySeller = {
      sellerName: sellerName,
      items: {
        productId: productId,
        sku: item?.product?.sku || '',
        productPath,
        productName: item?.product?.name || `Product Name`,
        productImage: productImageWithPrefix,
        sizeType: sizeType,
        priceInclTax: item?.price_incl_tax || 0,
        discountAmount: item?.discountAmount || 0,
        originalPrice: item?.product?.price || 0,
        rowTotalInclTax: item?.row_total_incl_tax || 0,
        isConfigurable,
        qty: item?.qty || 0,
        isOutOfStock: isOutOfStock,
        selectedSize: selectedSize,
        freeItems: transformedFreeItems,
        isFreeItem: false,
        minQty,
        maxQty,
        product,
        parentSku,
      },
    };
    return cartGroupBySeller;
  });
  const newCartFreeItems = cartFreeItems.map(item => {
    const sellerName = item?.product?.marketplace?.seller || `Supersports`;
    const isOutOfStock = !item?.product?.extension_attributes?.salable || false;
    const productImage = item?.product?.image || false;
    const productImageWithPrefix = productImage
      ? `${productUrl}${productImage}`
      : `/static/images/DefaultImage.jpg`;
    return {
      sellerName: sellerName,
      items: {
        productName: item?.product?.name || `Product Name`,
        productImage: productImageWithPrefix,
        price: item?.product?.price || 0,
        qty: item?.qty || 0,
        isOutOfStock: isOutOfStock,
        isFreeItem: true,
      },
    };
  });
  const filterItems = newCartFreeItems.concat(
    newCartItems.filter(item => item?.items?.priceInclTax > 0),
  );
  const cartItemsWithSeller = groupBy(
    filterItems,
    newCartItems => newCartItems.sellerName,
  );
  const newCartItemsWithSeller = Object.keys(cartItemsWithSeller).map(
    (seller, index) => {
      let quantity = 0;
      const itemsValue = Object.values(cartItemsWithSeller)?.[index] || [];
      const listItems = [];
      const listFreeItems = [];
      itemsValue.map(item => {
        const sellerItems = item?.items || {};
        const isOutOfStock = sellerItems?.isOutOfStock || false;
        const isFreeItem = sellerItems?.isFreeItem || false;
        if (isFreeItem) {
          listFreeItems.push(sellerItems);
        } else {
          if (!isOutOfStock) {
            quantity += sellerItems?.qty || 0;
          }
          listItems.push(sellerItems);
        }
      });
      return {
        sellerName: seller,
        items: listItems,
        freeItems: listFreeItems,
        quantity: quantity,
      };
    },
  );
  return newCartItemsWithSeller;
};

CartContainer.contextTypes = {
  customer: propTypes.object,
};

export default withStoreConfig(withLocales(CartContainer));
