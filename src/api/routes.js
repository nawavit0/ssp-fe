import Express from 'express';
import { cache } from './configRedis';
import productController from './middleware/product';
import customerController from './middleware/customer';
import cartController from './middleware/cart';
import authController from './middleware/auth';
import paymentController from './middleware/payment';
import the1cardController from './middleware/the1card';
import checkoutController from './middleware/checkout';
import searchController from './middleware/search';
import orderHistoryController from './middleware/orderHistory';
import shipmentController from './middleware/shipment';
import wishlistController from './middleware/wishlist';
import addressController from './middleware/address';
import accountController from './middleware/account';
import locationController from './middleware/location';
import trackingController from './middleware/tracking';
import packageStatusController from './middleware/packageStatus';

const router = Express.Router();

// products
router.get('/products', cache, productController.fetch);
router.get('/products/:sku', cache, productController.fetchOne);
router.get('/products/getBySku/:sku', cache, productController.fetchOneBySku);
router.get(
  '/products/getByUrlKey/:slug',
  cache,
  productController.fetchOneByUrlKey,
);
router.get('/get-product-attributes/:sku', productController.fetchAttributes);
router.post('/add-review/:sku', productController.addReview);
router.get('/products/section/:type', productController.fetchSectionByType);
router.get('/products/media/:sku', cache, productController.fetchMedia);
router.get('/products/stocks/:sku', productController.getStockItem);
router.get('/product-you-may-like', productController.fetchYouMayLike);

// customer
router.get('/customer', customerController.fetch);
router.put('/customer', customerController.updateCustomerData);
router.put('/customer/password', customerController.changePassword);

// search
// router.get('/search/improvement', searchController.improvement);
router.get('/search/products', cache, searchController.searchProducts);
// router.get('/search/suggest', searchController.suggest);
// router.get('/search/trending', searchController.trendingSearchItems);

// tracking
router.post('/tracking', trackingController.sendTracking);

// cart
router.get('/cart', cartController.fetch);
router.post('/cart/addToCart', cartController.addToCart);
router.put('/cart/changeItemQty', cartController.changeItemQty);
router.delete('/cart/deleteItem', cartController.deleteItem);
router.post('/cart/estimate-shipping-methods', cartController.estimateShipping);
router.put('/cart/putCoupon', cartController.putCoupon);
router.delete('/cart/deleteCoupon', cartController.deleteCoupon);
router.put('/cart/putGiftWrapping/:optionId', cartController.putGiftWrapping);
router.get('/cart/fetchGiftWrapping/', cartController.fetchGiftWrapping);
router.post('/cart/deleteGiftWrapping', cartController.deleteGiftWrapping);
router.post('/cart/changeGiftMessage/', cartController.changeGiftMessage);
router.post('/cart/promo/add', cartController.addPromo);
router.post('/cart/guest-transfer', cartController.guestCartTransfer);

// payment
router.get('/payment', paymentController.fetch);
router.post('/payment/setPaymentInfo', paymentController.setPaymentInfo);
router.post(
  '/payment/applyCreditCardOntop',
  paymentController.applyCreditCardOntop,
);

//wishlist
router.get('/wishlists', wishlistController.fetchGroup);
router.put('/wishlist', wishlistController.addGroup);
router.delete('/wishlist/deleteGroup', wishlistController.deleteGroup);
router.post('/wishlist/:slug', wishlistController.editGroup);
router.get('/wishlist-item', wishlistController.fetchList);
router.put('/wishlist-item', wishlistController.addList);
router.delete('/wishlist-item/deleteList', wishlistController.deleteList);

//auth
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/fb-auth', authController.fbAuth);
router.post('/forgot_password', authController.forgotPassword);
router.post('/forgot_password/reset', authController.resetPassword);

//account
router.put('/account/profile/:id', accountController.updateProfile);

//address
router.get('/account/address/:id', addressController.fetchOne);
router.post('/account/address', addressController.createAddress);
router.put('/account/address/:id', addressController.updateAddress);
router.delete('/account/address/:id', addressController.deleteAddress);
router.get('/account/addresses', addressController.fetchAddresses);

//route api
router.get('/address/regions', cache, addressController.fetchRegions);
router.get(
  '/address/regions/:regionId',
  cache,
  addressController.fetchDistricts,
);
router.get(
  '/address/regions/:regionId/districts/:districtId',
  cache,
  addressController.fetchSubDistricts,
);
router.get(
  '/address/postcode/:postcode',
  cache,
  addressController.fetchRegionByPostcode,
);

// order-history
router.get('/account/order-history', orderHistoryController.fetch);
router.get('/account/order-history/:id', orderHistoryController.fetchOneV2);
router.get('/account/order-history/:id/shipments', shipmentController.fetch);
router.get(
  '/account/order-history/:id/packageStatus',
  packageStatusController.fetch,
);

//geolocation
router.get(
  '/location/:latitude/:longitude',
  locationController.getAddressByLocation,
);

// T1C
router.post('/t1c/login', the1cardController.loginT1C);
router.put('/t1c/redeem', the1cardController.redeemT1C);
router.delete('/t1c/delete', the1cardController.removePointT1C);

// Checkout
router.post('/checkout/createOrder', checkoutController.createOrder);
router.get('/checkout/getOrderInfo', checkoutController.getOrderInfo);
router.post(
  '/checkout/shipping-information',
  checkoutController.createShippingInfo,
);
router.post(
  '/checkout/billing-information',
  checkoutController.createBillingInfo,
);

export default router;
