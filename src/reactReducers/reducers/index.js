import * as loginControl from './loginControl';
import * as productDetail from './productDetail';
import * as types from '../actions/types';
import { popupAddtoCartBox } from './popupAddtoCartControl';

const createReducer = handlers => (state, action) => {
  if (!handlers.hasOwnProperty(action.type)) {
    return state;
  }
  return handlers[action.type](state, action);
};

export default createReducer({
  [types.OPEN_LOGIN_DESKTOP]: loginControl.openLoginDesktopBox,
  [types.CLOSE_LOGIN_DESKTOP]: loginControl.closeLoginDesktopBox,
  [types.SET_POPUP_ADD_TO_CART]: popupAddtoCartBox,
  [types.SET_PRODUCT_DETAIL]: productDetail.setProductDetail,
});
