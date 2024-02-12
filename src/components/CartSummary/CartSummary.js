import React, { Fragment } from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { get as prop, find, isEmpty, map } from 'lodash';
import pt from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import Price from '../Price';
import Row from '../Row';
import Button from '../Button';
import Input from '../Input';
import Link from '../Link';
import s from './CartSummary.scss';
import t from './translation.json';
import {
  getGrandTotal,
  getShippingSegment,
  getDiscount,
  getCoupon,
  getT1Redeem,
  getGiftwrapping,
  getCreditCartOnTop,
} from '../../reducers/payment/selectors';
import {
  fetchCart,
  putCoupon,
  deleteCoupon,
  changeGiftMessage,
} from '../../reducers/cart/actions';
import { getFormatedCart } from '../../reducers/cart/selectors';
// import CartPromotionPopup from '../Cart/CartPromotionPopup/CartPromotionPopup';

import calculateOtherDiscount from '../../utils/calculateOtherDiscount';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../utils/generateElementId';

@withLocales(t)
@withStyles(s)
class CartSummary extends React.PureComponent {
  state = {
    coupon: '',
  };

  static propTypes = {
    enableButton: pt.bool,
    enableCoupon: pt.bool,
    isShowSummary: pt.bool,
    giftMessage: pt.string,
    grandTotal: pt.number,
    shipping: pt.shape({
      titel: pt.string,
      value: pt.oneOfType([pt.string, pt.number]),
    }),
    className: pt.string,
    optionCheckout: pt.string,
    stepCheckout: pt.number,
    showWarningPayInstallment: pt.bool,
    showWarningPayInstallmentMessage: pt.string,
  };

  static defaultProps = {
    enableButton: false,
    enableCoupon: false,
    isShowSummary: true,
    giftMessage: '',
  };

  handleCheckoutClick = async () => {
    const { giftMessage, onCheckoutClick, giftWrapping } = this.props;
    if (giftMessage && !isEmpty(giftWrapping.gw_order_id)) {
      await this.props.changeGiftMessage(giftMessage);
    }

    if (onCheckoutClick) {
      this.props.onCheckoutClick();
    }
  };

  handleChangeValue = e => {
    const { value } = e.target;

    this.setState({
      coupon: value,
    });
  };

  handleApplyCoupon = () => {
    const { putCoupon } = this.props;

    if (!isEmpty(this.state.coupon)) {
      putCoupon(this.state.coupon);

      this.setState({
        coupon: '',
      });
    }
  };

  handleMsgCartQty = () => {
    const { translate } = this.props;
    alert(translate('message_out_of_stock'));
  };

  handleDeleteCoupon = couponCode => {
    if (couponCode) {
      this.props.deleteCoupon(couponCode);
    }
  };

  renderDiscount = () => {
    const {
      translate,
      discount,
      coupons,
      the1Redeem,
      creditOnTop,
    } = this.props;

    const otherDiscount = calculateOtherDiscount(
      discount,
      coupons,
      prop(the1Redeem, 'discount_amount', null),
      prop(creditOnTop, 'formatted_discount_amount', null),
    );

    const showCreditOnTop = !!(
      creditOnTop && parseFloat(creditOnTop.discount_amount) > 0
    );
    return (
      <React.Fragment>
        {map(coupons, (val, index) => {
          return (
            <Row key={index} className={s.row}>
              <span>
                {val.coupon_code}
                <Link
                  className={s.removeCoupon}
                  onClick={() => this.handleDeleteCoupon(val.coupon_code)}
                  // onClick={() => this.handleDeleteCoupon(val.coupon_code)}
                >
                  {translate('remove_coupon')}
                </Link>
              </span>
              <Price
                format
                digit={2}
                size="small"
                color="red"
                price={val.coupon_amount}
                isDiscount
              />
            </Row>
          );
        })}
        {otherDiscount !== 0 && (
          <Row className={s.row}>
            <span>{translate('other_discount')}</span>
            <Price
              format
              digit={2}
              size="small"
              color="red"
              price={otherDiscount}
              isDiscount
            />
          </Row>
        )}

        {showCreditOnTop && (
          <Row className={s.row}>
            <span>
              <strong>{translate('credit_ontop')}</strong>
            </span>
            <Price
              format
              digit={2}
              size="small"
              color="red"
              price={creditOnTop.discount_amount}
              isDiscount
            />
          </Row>
        )}
      </React.Fragment>
    );
  };

  render() {
    const {
      translate,
      coupons,
      cart,
      enableButton,
      enableCoupon,
      grandTotal,
      isShowSummary,
      shipping,
      giftWrapping,
      className,
      optionCheckout,
      stepCheckout,
      showWarningPayInstallment,
      showWarningPayInstallmentMessage,
    } = this.props;
    if (!cart) {
      return null;
    }
    const cartQty = prop(cart, 'items_qty', 0);
    const isDisable = find(prop(cart, 'items', []), data => {
      const stockQty = prop(data.extension_attributes, 'stock_item.qty', null);
      return stockQty <= 0;
    });

    const shippingSuggest = prop(
      cart,
      'extension_attributes.free_shipping_offer.message',
    );

    // const promoDiscounts = prop(
    //   cart,
    //   'extension_attributes.promotion_offers.applicable_coupons',
    //   [],
    // );

    const giftWrappingPrice = prop(giftWrapping, 'gw_price_incl_tax');

    return (
      <div id="cart-summary" className={s.summaryWrapper}>
        <div className={s.summary}>
          <div className={cx({ [s.desktopSummary]: !isShowSummary })}>
            <div className={s.couponWrapper}>
              {enableCoupon && (
                <div className={s.promocodeSection}>
                  {/* <div className={s.promocodeSectionTitle}>
                    {translate('promo_code')}
                    {!isUndefined(promoDiscounts) && (
                      <CartPromotionPopup promoDiscounts={promoDiscounts} />
                    )}
                  </div> */}
                  <Input
                    id="txt-promoCode"
                    wrapperClassName={s.promocodeWrapper}
                    className={cx(s.promocode, {
                      [s.inputError]: !isEmpty(this.props.msgError),
                    })}
                    placeholder={translate('coupon_promo_code')}
                    value={this.state.coupon}
                    onChange={this.handleChangeValue}
                    after={
                      <Button
                        id={`btn-addCouponCode-${this.state.coupon}`}
                        color="custom"
                        className={cx(s.applyPromocode, className)}
                        onClick={this.handleApplyCoupon}
                        disable={coupons.length > 0}
                      >
                        {translate('apply')}
                      </Button>
                    }
                  />
                  <label
                    className={cx(s.msgError, {
                      [s.hidden]: isEmpty(this.props.msgError),
                    })}
                  >
                    {/* {!isEmpty(this.props.msgError) && translate('not_apply_it')} */}
                    {!isEmpty(this.props.msgError) &&
                      (this.props.msgError === 'check_coupon'
                        ? translate('check_coupon')
                        : translate('not_apply_it'))}
                  </label>
                </div>
              )}
            </div>
            <div className={s.priceDetails}>
              <Row className={s.row}>
                <span className={s.countProduct}>
                  {`${cartQty}
                  ${
                    cartQty > 1
                      ? translate('items').toUpperCase()
                      : translate('item').toUpperCase()
                  }`}
                </span>
                <Price
                  format
                  bold
                  digit={2}
                  size="small"
                  color="gray"
                  price={cart.subtotal_incl_tax}
                />
              </Row>

              {this.renderDiscount()}

              {!isEmpty(shipping) && (
                <Row className={s.row}>
                  <span className={s.shippingWrapper}>{shipping.title}</span>
                  <Price
                    format
                    digit={2}
                    size="small"
                    price={shipping.value}
                    freeMessage
                  />
                </Row>
              )}

              {!isEmpty(giftWrapping.gw_order_id) && (
                <Fragment>
                  <Row className={s.row}>
                    <span>{translate('gift_wrapping_fee')}</span>
                    <Price
                      format
                      digit={2}
                      size="small"
                      color="gray"
                      price={giftWrappingPrice}
                      freeMessage
                    />
                  </Row>
                </Fragment>
              )}

              <Row className={cx(s.row, s.grandTotal)}>
                <span>{translate('grand_total')}</span>
                <Price
                  className={s.grandTotalPrice}
                  format
                  digit={2}
                  size="x-large"
                  price={grandTotal}
                  uniqueId={generateElementId(
                    ELEMENT_TYPE.LABEL,
                    ELEMENT_ACTION.VIEW,
                    'GrandTotal',
                    'CartPage',
                  )}
                />
              </Row>
            </div>
            {/* <div className={s.t1Wrapper}>
              <Row className={s.row}>
                <span>
                  {translate('earn_point_t1')}
                  <Image className={s.logoT1C} src="/icons/t-1-c-logo.svg" />
                  <label>195,000 Points</label>
                </span>
              </Row>
            </div> */}
            <div className={s.buttonCheckoutWrapper}>
              <div>
                {shippingSuggest && (
                  <div className={s.shipingSuggest}>{shippingSuggest}</div>
                )}
              </div>
              {enableButton ? (
                !isEmpty(isDisable) ? (
                  <Button
                    onClick={this.handleMsgCartQty}
                    className={cx(s.processToCheckout, s.disabled, className)}
                    stepCheckout={stepCheckout}
                    optionCheckout={optionCheckout}
                  >
                    {translate('proceed_to_checkout')}
                  </Button>
                ) : (
                  <Link id="lnk-viewCheckout" to="/checkout" native>
                    <Button
                      className={cx(s.processToCheckout, className)}
                      stepCheckout={stepCheckout}
                      optionCheckout={optionCheckout}
                      onClick={this.handleCheckoutClick}
                    >
                      {translate('proceed_to_checkout')}
                    </Button>
                  </Link>
                )
              ) : (
                ''
              )}
            </div>

            {showWarningPayInstallment && (
              <div className={s.warningPayInstallmentMessageDesktop}>
                {showWarningPayInstallmentMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cart: getFormatedCart(state),
  msgError: state.cart.msgError,
  grandTotal: getGrandTotal(state),
  shipping: getShippingSegment(state),
  discount: getDiscount(state),
  coupons: getCoupon(state),
  the1Redeem: getT1Redeem(state),
  giftWrapping: getGiftwrapping(state),
  creditOnTop: getCreditCartOnTop(state),
  payment: state.payment.payment,
});

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart()),
  putCoupon: coupon => dispatch(putCoupon(coupon)),
  deleteCoupon: coupon => dispatch(deleteCoupon(coupon)),
  changeGiftMessage: message => dispatch(changeGiftMessage(message)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CartSummary);
