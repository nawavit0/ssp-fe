import { combineReducers } from 'redux';
import cart from './cart';
import payment from './payment';
import customer from './customer';
import locale from './locale';
import product from './product';
import layout from './layout';
import storeConfig from './storeConfig';
import the1card from './the1card';
import wishlistGroup from './wishlistGroup';
import wishlist from './wishlist';
import auth from './auth';
import address from './address';
import account from './account';
import checkout from './checkout';
import order from './order';
import hoverEventActivate from './hoverEventActivate';
import guestAddress from './guestAddress';
import tracking from './tracking';

import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  account,
  cart,
  payment,
  customer,
  locale,
  product,
  layout,
  storeConfig,
  the1card,
  wishlistGroup,
  wishlist,
  auth,
  address,
  checkout,
  order,
  form: formReducer,
  hoverEventActivate,
  guestAddress,
  tracking,
});
