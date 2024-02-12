import { get as prop, map, remove, filter, find, sortBy, concat } from 'lodash';

export function getFormatedCart(state) {
  const cart = prop(state, 'cart.cart');

  if (!cart) {
    return null;
  }

  const cartItems = cart.items;
  const cartExcludeFreebie = [];
  const freebieItems = [];
  const itemQty = cart.items_qty;

  try {
    map(
      cartItems,
      item => {
        const thisIsFreebie = item.price === 0;

        if (!thisIsFreebie) {
          cartExcludeFreebie.push(item);
        } else {
          freebieItems.push(item);
        }
      },
      [],
    );

    let freebieQty = 0;
    map(freebieItems, item => (freebieQty += item.qty));
    const removedFreebieQty = itemQty - freebieQty;

    const prepairDeleteFreeItemSku = [];
    const cartIncludeFreebie = map(cartExcludeFreebie, item => ({
      ...item,
      free_items_formated: filter(freebieItems, freeItem => {
        const freeItemAdded = prop(
          item,
          'extension_attributes.free_items_added',
        );

        const isThisPartOfThisItem = find(
          freeItemAdded,
          addedItem => String(addedItem.sku) === String(freeItem.sku),
        );

        if (isThisPartOfThisItem) {
          prepairDeleteFreeItemSku.push(freeItem.sku);
          return freeItem;
        }
      }),
    }));

    map(prepairDeleteFreeItemSku, sku => {
      remove(freebieItems, {
        sku: sku,
      });
    });

    return {
      ...cart,
      items: cartIncludeFreebie,
      global_freebies: freebieItems,
      items_qty: removedFreebieQty,
    };
  } catch (error) {
    return cart;
  }
}

export const getCart = state => prop(state, 'cart.cart');

export const getCartItems = state => prop(state, 'cart.cart.items', []);

export const getCartSubTotal = state =>
  prop(state, 'cart.cart.subtotal_incl_tax', 0);

export const getCartTotal = state =>
  prop(state, 'cart.cart.base_grand_total', 0);

export const getCartShippingAmount = state =>
  prop(state, 'cart.cart.shipping_amount', 0);

export const getCartShippingMethod = state => {
  const cart = getCart(state);
  if (!cart) return null;

  return prop(
    cart,
    'extension_attributes.shipping_assignments[0].shipping.method',
  );
};

export const getCartShippingAddress = state => {
  const cart = getCart(state);

  if (!cart) return null;

  const shippingAddress = prop(
    cart,
    'extension_attributes.shipping_assignments[0].shipping.address',
  );

  if (
    !shippingAddress ||
    !shippingAddress.region_id ||
    !shippingAddress.postcode
  ) {
    return null;
  }

  return shippingAddress;
};

export const getCartBillingAddress = state => {
  const cart = getCart(state);

  if (!cart) return null;

  const billingAddress = prop(cart, 'billing_address');

  if (
    !billingAddress ||
    !billingAddress.region_id ||
    !billingAddress.postcode
  ) {
    return null;
  }

  return billingAddress;
};

export const getPromotionSuggest = state => {
  const cart = getCart(state);
  const filterAvailableItem = item => item.display_on_cart === true;

  //
  // Add Discount type for discount suggest
  // ------------------------
  let suggestDiscount =
    prop(cart, 'extension_attributes.promotion_offers.discounts') || [];
  suggestDiscount = map(suggestDiscount, discount => ({
    ...discount,
    promotion_condition_type: 'discount',
  }));

  //
  // Add Discount type for freebie
  // ------------------------
  let suggestFreebies =
    prop(cart, 'extension_attributes.promotion_offers.freebies') || [];
  suggestFreebies = map(suggestFreebies, discount => ({
    ...discount,
    promotion_condition_type: 'freebie',
  }));

  const promotionSuggestions = concat(suggestDiscount, suggestFreebies);
  const filterAvailable = filter(promotionSuggestions, filterAvailableItem);
  const sortedPromotionSuggestions = sortBy(filterAvailable, [
    'priority',
    'rule_id',
  ]);
  return sortedPromotionSuggestions;
};
