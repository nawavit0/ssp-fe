import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import pt from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './OrderSummary.scss';
import withLocales from '../../../utils/decorators/withLocales';
import t from './translation.json';
import OrderItem from './OrderItem';
import ImageV2 from '../../Image/Image';
import { isEmpty, map, get, isArray } from 'lodash';
import { explode } from '../../../utils/customAttributes';
import cx from 'classnames';
import Price from '../../Price';
import Button from '../../Button';
import FreeGiftPanel from '../../FreeGiftPanel';
import {
  getCartItems,
  getCartShippingAddress,
  getCartBillingAddress,
  getFormatedCart,
} from '../../../reducers/cart/selectors';
import {
  getShippingSegment,
  getSubTotal,
  getGrandTotal,
  getDiscount,
  getCoupon,
  getT1Redeem,
  getGiftwrapping,
  getCreditCartOnTop,
} from '../../../reducers/payment/selectors';
import { the1CardRemovePoint } from '../../../reducers/the1card/actions';
import { getProductImgUrl } from '../../../utils/imgUrl';
import calculateOtherDiscount from '../../../utils/calculateOtherDiscount';
import { withStoreConfig, Link } from '@central-tech/core-ui';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

@withStoreConfig
export class OrderSummary extends React.PureComponent {
  static propTypes = {
    activeConfig: pt.object.isRequired,
    items: pt.arrayOf(pt.object),
    subTotal: pt.number,
    grandTotal: pt.number,
    checkout: pt.object,
    showShipping: pt.bool,
    shipping: pt.shape({
      titel: pt.string,
      value: pt.oneOfType([pt.string, pt.number]),
    }),
    handleShowHideSummary: pt.func,
  };

  static defaultProps = {
    showShipping: false,
  };

  handleDeleteT1 = () => {
    this.props.the1CardRemovePoint();
  };

  renderCoupon = () => {
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
      get(the1Redeem, 'discount_amount', null),
      get(creditOnTop, 'formatted_discount_amount', null),
    );

    return (
      <React.Fragment>
        {!isEmpty(coupons) && (
          <div className={cx(s.line, s.promoCode)}>
            <h4>{translate('promocode')}</h4>
          </div>
        )}
        {map(coupons, (val, index) => {
          return (
            <div className={cx(s.line, s.couponCode)} key={index}>
              <label>{val.coupon_code}</label>
              <Price
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'PricePromocode',
                  '',
                  get(val, 'coupon_code', null),
                )}
                digit={2}
                className={s.right}
                color="red"
                format
                price={val.coupon_amount}
                size="small"
                isDiscount
              />
            </div>
          );
        })}
        {otherDiscount !== 0 && (
          <div className={cx(s.line, s.couponCode)} key="other_discount">
            <label>{translate('other_discount')}</label>
            <Price
              digit={2}
              className={s.right}
              color="red"
              format
              price={otherDiscount}
              size="small"
              isDiscount
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  renderT1 = () => {
    const { translate, the1Redeem } = this.props;

    return (
      !isEmpty(the1Redeem) &&
      the1Redeem.t1c_points > 0 && (
        <React.Fragment>
          <div className={cx(s.line, s.t1Redeem)}>
            <h4>{translate('the1_redeem')}</h4>
          </div>
          <div className={cx(s.line, s.t1ListRedeem)}>
            <div className={s.left}>
              {translate('redeem_t1', { point: the1Redeem.t1c_points })}
              <Link
                className={s.removeT1}
                onClick={() => this.handleDeleteT1()}
              >
                {translate('remove_t1')}
              </Link>
            </div>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceDiscount',
                '',
                'the1_redeem',
              )}
              className={s.right}
              format
              digit={2}
              color="red"
              price={the1Redeem.formatted_discount_amount}
              size="small"
              isDiscount
            />
          </div>
        </React.Fragment>
      )
    );
  };

  renderCreditOnTop = () => {
    const { translate, creditOnTop } = this.props;
    return (
      !isEmpty(creditOnTop) &&
      creditOnTop.discount_amount > 0 && (
        <React.Fragment>
          <div className={cx(s.line, s.promoCode)}>
            <h4>{translate('credit_ontop')}</h4>

            <Price
              className={s.right}
              format
              digit={2}
              color="red"
              price={creditOnTop.formatted_discount_amount}
              size="small"
              isDiscount
            />
          </div>
        </React.Fragment>
      )
    );
  };

  getAddressLine = (address = {}) => {
    const {
      firstname,
      lastname,
      address_line,
      building,
      subdistrict,
      district,
      region,
      postcode,
      telephone,
      vat_id,
    } = address;

    const addressLine = [
      building && ` ${building} `, //${this.props.translate('building')}
      address_line && `${address_line},`, //${this.props.translate('house_no')}
      subdistrict && `${subdistrict},`,
      district && `${district},`,
      region,
      postcode,
    ]
      .filter(m => !isEmpty(m))
      .join(' ');

    const fullname = `${firstname} ${lastname}`;

    return { fullname, addressLine, telephone, vat_id };
  };

  renderItem(cartItem) {
    const { translate } = this.props;
    const {
      item_id,
      brand_name_option,
      price_incl_tax, // special_price || original_price
      image,
      name,
      qty,
      sku,
      free_items_formated,
    } = cartItem;
    const imageUrl = getProductImgUrl(
      image,
      this.props.activeConfig.base_media_url,
    );
    const itemProps = {
      brandName: brand_name_option,
      price: price_incl_tax,
      imageUrl,
      image,
      name,
      qty,
      sku,
      positionElementID: 'OrderSummary',
    };

    const freeItems = map(free_items_formated, freeItem => ({
      ...freeItem,
      image: getProductImgUrl(
        freeItem.image,
        this.props.activeConfig.base_media_url,
      ),
    }));
    const freeItemCounts = isArray(freeItems) ? freeItems.length : 0;
    const tempTitleFreeItems = `${freeItemCounts} ${translate(
      'free_gift_title',
    )}`;

    return (
      <div className={s.orderItemSection} key={item_id}>
        <OrderItem key={sku} {...itemProps} />

        {freeItems && !isEmpty(freeItems) && (
          <div className={s.freebieSection}>
            <FreeGiftPanel items={freeItems} title={tempTitleFreeItems} />
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      cart,
      subTotal,
      grandTotal,
      discount,
      the1Redeem,
      creditOnTop,
      translate,
      cartShippingAddress,
      cartBillingAddress,
      shipping,
      showShipping,
      handleShowHideSummary,
      giftWrapping,
    } = this.props;
    let flattenAddress = {};
    let flattenBillingAddress = {};
    if (!isEmpty(cartShippingAddress)) {
      flattenAddress = this.getAddressLine(explode(cartShippingAddress));
    }

    let showBillingAddress = false;
    if (!isEmpty(cartBillingAddress)) {
      flattenBillingAddress = this.getAddressLine(explode(cartBillingAddress));
      const { custom_attributes } = cartBillingAddress;
      const fullTaxRequest = custom_attributes.find(
        val => val.attribute_code === 'full_tax_request',
      );

      showBillingAddress =
        get(flattenBillingAddress, 'vat_id') &&
        get(fullTaxRequest, 'value') === '1';
    }

    const giftWrappingID = get(giftWrapping, 'gw_order_id');
    const giftWrappingPrice = get(giftWrapping, 'gw_price_incl_tax');

    return (
      <div className={s.orderSummary}>
        <Button
          className={s.btnClose}
          color="custom"
          onClick={handleShowHideSummary}
        >
          <ImageV2 src="/static/icons/CloseIcon.svg" width="14" height="14" />
        </Button>
        {showShipping && (
          <React.Fragment>
            <div className={cx(s.header, s.line)}>
              <h3 className={cx(s.left, s.headerTitle)}>
                {translate('shippingSummary')}
              </h3>
              <Link
                className={cx(s.right, s.editLink)}
                to={'/checkout?action=edit'}
                id={generateElementId(
                  ELEMENT_TYPE.LINK,
                  ELEMENT_ACTION.EDIT,
                  'ShippingSummary',
                  '',
                )}
                native
              >
                {translate('edit')}
              </Link>
            </div>
            <div className={s.content}>
              <div className={cx(s.line, s.titleShippingAddress)}>
                <h4>{'Shipping Address'}</h4>
              </div>
              <div className={s.line}>
                {!isEmpty(flattenAddress) && (
                  <div className={s.address}>
                    <div
                      id={generateElementId(
                        ELEMENT_TYPE.INFO,
                        ELEMENT_ACTION.VIEW,
                        'ShippingSummary',
                        '',
                        'fullname',
                      )}
                    >
                      {flattenAddress.fullname}
                    </div>
                    <div
                      id={generateElementId(
                        ELEMENT_TYPE.INFO,
                        ELEMENT_ACTION.VIEW,
                        'ShippingSummary',
                        '',
                        'addressLine',
                      )}
                    >
                      {flattenAddress.addressLine}
                    </div>
                    <div
                      id={generateElementId(
                        ELEMENT_TYPE.INFO,
                        ELEMENT_ACTION.VIEW,
                        'ShippingSummary',
                        '',
                        'telephone',
                      )}
                    >
                      {flattenAddress.telephone}
                    </div>
                  </div>
                )}
              </div>

              {showBillingAddress && (
                <React.Fragment>
                  <div className={s.line}>
                    <h4>{'Billing Address'}</h4>
                  </div>
                  <div className={s.line}>
                    <div className={s.address}>
                      <div
                        id={generateElementId(
                          ELEMENT_TYPE.INFO,
                          ELEMENT_ACTION.VIEW,
                          'ShippingSummary',
                          '',
                          'fullname',
                        )}
                      >
                        {flattenBillingAddress.fullname}
                      </div>
                      <div
                        id={generateElementId(
                          ELEMENT_TYPE.INFO,
                          ELEMENT_ACTION.VIEW,
                          'ShippingSummary',
                          '',
                          'addressLine',
                        )}
                      >
                        {flattenBillingAddress.addressLine}
                      </div>
                      <div
                        id={generateElementId(
                          ELEMENT_TYPE.INFO,
                          ELEMENT_ACTION.VIEW,
                          'ShippingSummary',
                          '',
                          'telephone',
                        )}
                      >
                        {flattenBillingAddress.telephone}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}

        <div className={cx(s.header, s.line)}>
          <h3 className={cx(s.left, s.headerTitle)}>
            {translate('orderSummary')}
          </h3>
          <Link className={cx(s.right, s.editLink)} to={'/cart'} native>
            {translate('editBag')}
          </Link>
        </div>
        <div className={s.scrollable}>
          {cart &&
            !isEmpty(cart.items) &&
            map(cart.items, item => this.renderItem(item))}
          {cart && !isEmpty(cart.global_freebies) && (
            <React.Fragment>
              <br />
              <div className={s.freeItemList}>
                {translate('free_item_title')}
              </div>
              {map(cart.global_freebies, item => this.renderItem(item))}
            </React.Fragment>
          )}
        </div>
        <div className={cx(s.header, s.line)}>
          <h3>{translate('paymentSummary')}</h3>
        </div>
        <div className={cx(s.line, s.subTotal)}>
          <h4 className={cx(s.left, s.resultSubTotal)}>
            {translate('subtotal')}
          </h4>
          <Price
            className={cx(s.right, s.resultSubTotal)}
            bold
            format
            digit={2}
            price={subTotal}
            size="small"
          />
        </div>

        {discount !== 0 && this.renderCoupon()}

        {giftWrappingID && (
          <React.Fragment>
            <div className={cx(s.line, s.promoCode)}>
              <h4>{translate('gift_options')}</h4>
            </div>
            <div className={cx(s.line, s.deliveryList)}>
              <div className={s.left}>{translate('gift_wrapping_fee')}</div>
              <Price
                format
                digit={2}
                size="small"
                color="gray"
                price={giftWrappingPrice}
                freeMessage
              />
            </div>
          </React.Fragment>
        )}

        {!isEmpty(the1Redeem) && this.renderT1()}
        {!isEmpty(creditOnTop) && this.renderCreditOnTop()}
        <div className={cx(s.line, s.deliveryTitle)}>
          <h4>{translate('delivery')}</h4>
        </div>
        <div className={cx(s.line, s.deliveryList)}>
          <div className={cx(s.left, s.resultDelivery)}>{shipping.title}</div>
          <Price
            className={cx(s.right, s.resultDelivery)}
            format
            digit={2}
            price={shipping.value}
            size="small"
            freeMessage
          />
        </div>
        <div className={s.line}>
          <hr />
        </div>
        <div className={cx(s.net, s.line, s.grandTotal)}>
          <h4 className={cx(s.left, s.netTotal)}>{translate('netTotal')}</h4>
          <Price
            className={cx(s.right, s.netTotal)}
            format
            digit={2}
            price={grandTotal}
            size="large"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  baseMediaUrl: state.storeConfig.activeConfig.base_media_url,
  cart: getFormatedCart(state),
  items: getCartItems(state),
  cartBillingAddress: getCartBillingAddress(state),
  cartShippingAddress: getCartShippingAddress(state),
  shipping: getShippingSegment(state),
  subTotal: getSubTotal(state),
  grandTotal: getGrandTotal(state),
  discount: getDiscount(state),
  coupons: getCoupon(state),
  the1Redeem: getT1Redeem(state),
  creditOnTop: getCreditCartOnTop(state),
  giftWrapping: getGiftwrapping(state),
});

const mapDispatchToProps = dispatch => ({
  the1CardRemovePoint: () => dispatch(the1CardRemovePoint()),
});

export default compose(
  withStyles(s),
  withLocales(t),
  connect(mapStateToProps, mapDispatchToProps),
)(OrderSummary);
