import React from 'react';
import { first, get as prop, isEmpty, head } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import moment from 'moment/moment';
import t from './translation.json';
import s from './OrderDetailContainer.scss';
import cx from 'classnames';
import ImageLazy from '../../components/Image/ImageLazy';
import IosPrintOutline from 'react-ionicons/lib/IosPrintOutline';
import OrderItem from '../../components/Account/OrderItem';
import Price from '../../components/Price';
import FullPageLoader from '../../components/FullPageLoader';
import OrderStatus from '../../components/OrderStatus';
import TrackingProgressBar from '../../components/TrackingProgressBar';
import Button from '../../components/Button';
import Link from '../../components/Link';

import calculateOtherDiscount from '../../utils/calculateOtherDiscount';
import enableMarketplace from '../../utils/enableMarketplace';
import OrderShipments from '../../components/OrderShipments/OrderShipments';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

@withLocales(t)
@withStyles(s)
class OrderDetailContainer extends React.PureComponent {
  state = {
    showPayment: false,
  };

  getCustomAttr = (address, attrCode) => {
    const customAttr = prop(
      address,
      'extension_attributes.custom_attributes',
      [],
    );
    return head(
      customAttr.filter(attribute => attribute.attribute_code === attrCode),
    ).value;
  };

  generateAddress(address, position) {
    return (
      <div
        id={generateElementId(
          ELEMENT_TYPE.TEXT,
          ELEMENT_ACTION.VIEW,
          'OrderDetail',
          position,
          'Address',
        )}
      >
        <span>
          {this.getCustomAttr(address, 'building')
            ? `${this.getCustomAttr(address, 'building')},`
            : ''}
        </span>
        <span>
          {' '}
          {this.getCustomAttr(address, 'address_line')
            ? `${this.getCustomAttr(address, 'address_line')},`
            : ''}
        </span>
        <span>
          {' '}
          {this.getCustomAttr(address, 'subdistrict')
            ? `${this.getCustomAttr(address, 'subdistrict')},`
            : ''}
        </span>
        <span>
          {' '}
          {this.getCustomAttr(address, 'district')
            ? `${this.getCustomAttr(address, 'district')},`
            : ''}
        </span>
        <span> {this.getCustomAttr(address, 'region')}</span>
        <span> {this.getCustomAttr(address, 'postcode')}</span>
      </div>
    );
  }

  generateBillingAddress() {
    const { translate, order } = this.props;
    const { billing_address } = order;

    return (
      <div className={s.billingInfo}>
        <p className={s.subTitle}>{translate('orderInfo.taxInfo')}</p>
        <p
          id={generateElementId(
            ELEMENT_TYPE.TEXT,
            ELEMENT_ACTION.VIEW,
            'OrderDetail',
            'BillingInfo',
            'Name',
          )}
        >
          {billing_address.firstname} {billing_address.lastname}
        </p>
        <p>{this.getCustomAttr(billing_address, 'address_name')}</p>
        <p>
          {billing_address.vat_id
            ? this.generateAddress(billing_address, 'BillingInfo')
            : '-'}
        </p>
        <br />
        <p>
          {translate('orderInfo.taxId')}:{' '}
          <span
            id={generateElementId(
              ELEMENT_TYPE.TEXT,
              ELEMENT_ACTION.VIEW,
              'OrderDetail',
              'BillingInfo',
              'VatID',
            )}
          >
            {billing_address.vat_id}{' '}
          </span>
        </p>
      </div>
    );
  }

  handelShowPayment = () => {
    this.setState({
      showPayment: !this.state.showPayment,
    });
  };

  handleRepayment = () => {
    const { order } = this.props;
    const payAdditionalInfo = prop(order, 'payment.additional_information', '');
    const paymentMethod = prop(order, 'payment.method', '');

    if (!isEmpty(payAdditionalInfo)) {
      if (paymentMethod === 'fullpaymentredirect') {
        const paymentAdditional = JSON.parse(head(payAdditionalInfo));
        if (!isEmpty(paymentAdditional)) {
          window.location.href = paymentAdditional.url;
        }
      }
    }
  };

  handleReturnOrderClick = () => {
    const { langCode } = this.props;
    langCode === 'th'
      ? window.open(
          'https://drive.google.com/file/d/10RbPJhClatz3SDv0UsJp5d8irPS4wVBX/view?usp=sharing',
        )
      : window.open(
          'https://drive.google.com/file/d/1rkfIUiHH-DLhMkJQ44tEVlt9Nsd1hPBA/view?usp=sharing',
        );
  };

  getOrderWithoutShipment = order => {
    const orderItems = [];

    order.items.map(product => {
      if (product.qty_shipped < product.qty_ordered) {
        orderItems.push(product);
      }
    });

    return orderItems;
  };

  findSellerName = packageItem => {
    let result = 'Central';
    const item = first(packageItem.items);
    const marketPlaceInfo = prop(
      item.detail,
      'extension_attributes.marketplace_info',
      null,
    );
    if (marketPlaceInfo) {
      result = prop(marketPlaceInfo, 'seller_info.name', 'Central');
    }

    return result;
  };

  renderShipments() {
    const { translate, order, envConfigs } = this.props;
    const { extension_attributes, shipments } = order;

    const { gw_id, order_status, shipping_assignments } = extension_attributes;

    const orderStatus = order_status;
    const shippingMethod = head(shipping_assignments).shipping.method;
    const isEnableMarketplace = enableMarketplace(envConfigs);
    return (
      <>
        {shipments.map((packageItem, index) => {
          const packageStatus = packageItem.status || orderStatus;
          return (
            <div>
              <div
                className={cx(s.sectionPackage, {
                  [s.isEnableMarketplace]: isEnableMarketplace,
                })}
              >
                <div className={s.package}>
                  <ImageLazy
                    src="/images/package-icon.png"
                    height="18px"
                    width="20px"
                  />
                  <span className={s.packageNo}>
                    <strong>
                      {translate('package')} {index + 1}
                      {isEnableMarketplace && (
                        <>
                          <span className={s.colonPackage}>{':'}</span>
                        </>
                      )}
                    </strong>
                  </span>
                </div>

                {isEnableMarketplace ? (
                  <>
                    <div className={s.refNumber}>
                      <strong>{packageItem.refNumber}</strong>
                    </div>
                    <div className={s.soldByContainer}>
                      {translate('sold_by')}:{' '}
                      <strong>{this.findSellerName(packageItem)}</strong>
                    </div>

                    {!isEmpty(packageItem.provider) &&
                      shippingMethod !== 'pickupatstore_pickupatstore' && (
                        <div className={s.provider}>
                          <div className={s.providerLabel}>
                            {translate('deliveredBy')}
                          </div>
                          <div className={s.providerName}>
                            {packageItem.provider}
                          </div>
                        </div>
                      )}
                  </>
                ) : (
                  <>
                    {!isEmpty(packageItem.provider) &&
                      shippingMethod !== 'pickupatstore_pickupatstore' && (
                        <div className={cx(s.provider, s.isDefault)}>
                          <div className={s.providerLabel}>
                            {translate('deliveredBy')}
                          </div>
                          <div className={s.providerName}>
                            {packageItem.provider}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
              <div className={s.sectionBoxDetail}>
                <p className={s.title}>
                  {translate('yourOrder')}{' '}
                  {translate(`status.${packageItem.status}`)}
                  {shippingMethod !== 'pickupatstore_pickupatstore' && (
                    <>
                      {translate('dot')} {translate('tracking_number')}
                      {': '}
                      <Link
                        className={s.trackLink}
                        to={packageItem.trackURL ? packageItem.trackURL : '#'}
                        native
                        external={1}
                        target="_blank"
                      >
                        {prop(packageItem, 'trackNumber', null)}
                      </Link>
                    </>
                  )}
                </p>
                <TrackingProgressBar
                  className={s.processBar}
                  status={packageStatus}
                  shippingMethod={shippingMethod}
                  package
                />
                <hr />
                <div className={s.prodWrap}>
                  {packageItem.items.map(product => (
                    <OrderItem
                      product={product}
                      key={product.sku}
                      giftWrap={gw_id}
                      isPackage
                      isEnableMarketplace={isEnableMarketplace}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }

  render() {
    const { translate, order, orderFetchFailed, lang, envConfigs } = this.props;
    const {
      created_at,
      entity_id,
      increment_id,
      customer_firstname,
      customer_lastname,
      extension_attributes,
      shipping_description,
      subtotal_incl_tax,
      shipping_incl_tax,
      grand_total,
      items,
      // payment,
      billing_address,
      discount_amount,
      shipments,
      // status,
    } = order;

    // const paymentMethod = prop(payment, 'method', '');

    if (orderFetchFailed) return <div className={s.root}>Not Found</div>;

    if (!entity_id) return <FullPageLoader show />;

    const {
      t1c_redeem,
      shipping_assignments,
      coupons_applied,
      gw_id,
      gw_price_incl_tax,
      payment_method_label,
      shipping_method_label,
      delivery_status,
      order_status,
      pickup_code,
      credit_card_on_top_discount_amount,
      // payment_url,
    } = extension_attributes;

    const orderStatus = delivery_status || order_status;

    const shippingAddress = head(shipping_assignments).shipping.address;
    const shippingMethod = head(shipping_assignments).shipping.method;

    const otherDiscount = calculateOtherDiscount(
      discount_amount,
      coupons_applied,
      prop(t1c_redeem, 'discount_amount', null),
      credit_card_on_top_discount_amount
        ? credit_card_on_top_discount_amount
        : null,
    );

    let redeemPoint = 0;
    let redeemAmount = 0;
    if (!isEmpty(t1c_redeem)) {
      redeemAmount = parseFloat(t1c_redeem.discount_amount);
      redeemPoint = t1c_redeem.points_redeem;
    }

    const orderFilter = this.getOrderWithoutShipment(order);
    moment.locale(lang);
    const isEnableMarketplace = enableMarketplace(envConfigs);

    return (
      <div className={s.root}>
        <div className={s.OrderHeader}>
          <h3 className={s.OrderTitle}>{translate('orderDetail')}</h3>
        </div>
        <hr />
        <div className={s.sectionBoxTop}>
          <div className={s.orderInfo}>
            <div className={s.orderNo}>
              <p
                className={s.titleOrderNo}
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.VIEW,
                  'OrderDetail',
                  'OrderID',
                )}
              >
                {translate('orderId')}
              </p>
              <div className={cx(s.content, 'increment')}>{increment_id}</div>
            </div>
            <div className={s.orderDate}>
              <div>{translate('placedOn')}</div>
              <div
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.VIEW,
                  'OrderDetail',
                  'OrderDate',
                )}
              >
                {moment(created_at).format('YYYY - MM - DD')}
              </div>
            </div>
          </div>
          <div className={s.orderStatus}>
            <p className={s.title}>{translate('orderStatus')}</p>
            {!isEmpty(orderStatus) && <OrderStatus status={orderStatus} />}
          </div>
          <div className={s.delivery}>
            <p className={s.title}>{translate('deliveryOption')}</p>
            <div
              className={s.content}
              id={generateElementId(
                ELEMENT_TYPE.TEXT,
                ELEMENT_ACTION.VIEW,
                'OrderDetail',
                'DeliveryOption',
              )}
            >
              {shipping_method_label}
            </div>
            {!isEmpty(pickup_code) && (
              <div className={cx(s.desktop, s.content)}>
                {translate('pickup_code')} {pickup_code}{' '}
              </div>
            )}
          </div>

          <div className={cx(s.delivery, s.mobile)}>
            {!isEmpty(pickup_code) && (
              <>
                <p className={cx(s.title)}>{translate('pickup_code')} </p>
                <div className={s.content}>{pickup_code}</div>
              </>
            )}
          </div>
          <div className={s.payment}>
            <p className={s.title}>{translate('payment')} </p>
            <div
              className={s.content}
              id={generateElementId(
                ELEMENT_TYPE.TEXT,
                ELEMENT_ACTION.VIEW,
                'OrderDetail',
                'Payment',
              )}
            >
              {payment_method_label}{' '}
            </div>
          </div>
          <div className={s.totalPrice}>
            <p className={s.title}>{translate('orderAmount')}</p>
            <div
              id={generateElementId(
                ELEMENT_TYPE.TEXT,
                ELEMENT_ACTION.VIEW,
                'OrderDetail',
                'OrderAmount',
              )}
            >
              <Price
                className={s.priceGrandTotal}
                digit={2}
                format
                price={grand_total}
                size={'small'}
                color={`#000000`}
                fontSize={20}
              />
            </div>
          </div>
        </div>

        {isEnableMarketplace ? (
          <>{order.shipments && <OrderShipments />}</>
        ) : (
          <>
            {this.renderShipments()}

            {!isEmpty(orderFilter) && (
              <div>
                {!isEmpty(shipments) && (
                  <div className={cx(s.sectionPackage)}>
                    <div className={s.package}>
                      <ImageLazy
                        src="/images/package-icon.png"
                        height="18px"
                        width="20px"
                      />
                      <span className={s.packageNo}>
                        <strong>{translate('otherItem')}</strong>
                      </span>
                    </div>
                  </div>
                )}
                <div className={s.sectionBoxDetail}>
                  <TrackingProgressBar
                    className={s.processBar}
                    status={order_status}
                    shippingMethod={shippingMethod}
                  />
                  <hr />
                  <div className={s.prodWrap}>
                    {items.map(
                      product =>
                        product.qty_shipped < product.qty_ordered && (
                          <OrderItem
                            product={product}
                            key={product.sku}
                            giftWrap={gw_id}
                          />
                        ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className={s.sectionBoxBottom}>
          <div className={s.BoxBottomLeft}>
            <div className={s.title}>{translate('orderInfo.title')}</div>
            <div className={s.shippingInfo}>
              <p className={s.subTitle}>
                {translate('orderInfo.shippingInfo')}
              </p>
              <p
                id={generateElementId(
                  ELEMENT_TYPE.TEXT,
                  ELEMENT_ACTION.VIEW,
                  'OrderDetail',
                  'ShippingInfo',
                  'Type',
                )}
              >
                {shipping_description}
              </p>
              <p className={s.topic}>{translate('orderInfo.customerInfo')}</p>
              {shippingMethod === 'pickupatstore_pickupatstore' ? (
                <p
                  id={generateElementId(
                    ELEMENT_TYPE.TEXT,
                    ELEMENT_ACTION.VIEW,
                    'OrderDetail',
                    'ShippingInfo',
                    'Name',
                  )}
                >
                  {customer_firstname} {customer_lastname}
                </p>
              ) : (
                <p
                  id={generateElementId(
                    ELEMENT_TYPE.TEXT,
                    ELEMENT_ACTION.VIEW,
                    'OrderDetail',
                    'ShippingInfo',
                    'Name',
                  )}
                >
                  {shippingAddress.company ||
                    `${shippingAddress.firstname} ${shippingAddress.lastname}`}
                </p>
              )}
              <p>{this.generateAddress(shippingAddress, 'ShippingInfo')}</p>
              {shippingMethod === 'pickupatstore_pickupatstore' ? (
                billing_address.telephone !== shippingAddress.telephone && (
                  <p>
                    {translate('orderInfo.tel')}:{' '}
                    <span
                      id={generateElementId(
                        ELEMENT_TYPE.TEXT,
                        ELEMENT_ACTION.VIEW,
                        'OrderDetail',
                        'ShippingInfo',
                        'Telephone',
                      )}
                    >
                      {billing_address.telephone}
                    </span>
                  </p>
                )
              ) : (
                <p>
                  {translate('orderInfo.tel')}:
                  <span
                    id={generateElementId(
                      ELEMENT_TYPE.TEXT,
                      ELEMENT_ACTION.VIEW,
                      'OrderDetail',
                      'ShippingInfo',
                      'Telephone',
                    )}
                  >
                    {shippingAddress.telephone}
                  </span>
                </p>
              )}

              <hr />
              <div className={s.borderShipping} />
            </div>
            {billing_address.vat_id && this.generateBillingAddress()}
          </div>
          <div className={s.BoxBottomRight}>
            <div className={s.title}>{translate('paymentInfo.title')}</div>
            <div className={s.summaryInfoWrap}>
              <div className={cx(s.summaryInfo, s.noPaddingBt)}>
                <span className={cx(s.subTitle)}>
                  {translate('paymentInfo.subTotal')}
                </span>
                <span>
                  {' '}
                  <Price
                    digit={2}
                    format
                    bold
                    price={subtotal_incl_tax}
                    size={'small'}
                    color={`#000000`}
                    fontSize={16}
                    id={generateElementId(
                      ELEMENT_TYPE.TEXT,
                      ELEMENT_ACTION.VIEW,
                      'OrderDetail',
                      'PaymentInfo',
                      'subTotal',
                    )}
                  />
                </span>
              </div>

              {!isEmpty(coupons_applied) && (
                <>
                  <p className={s.subTitle}>
                    {translate('paymentInfo.promoCode')}
                  </p>
                  <div className={s.promoCode}>
                    {coupons_applied.map(coupon => (
                      <div className={s.promoItem}>
                        <span>{coupon.coupon_code}</span>
                        <span>
                          {' '}
                          <Price
                            isDiscount
                            digit={2}
                            format
                            price={coupon.discount_amount}
                            size={'small'}
                            color={`#DD0000`}
                            fontSize={16}
                            id={generateElementId(
                              ELEMENT_TYPE.TEXT,
                              ELEMENT_ACTION.VIEW,
                              'OrderDetail',
                              'PaymentInfo',
                              'promoCode',
                            )}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {otherDiscount !== 0 && (
                <div className={s.promoCode}>
                  <div className={s.promoItem}>
                    <span>{translate('otherDiscount')}</span>
                    <span>
                      {' '}
                      <Price
                        isDiscount
                        digit={2}
                        format
                        price={otherDiscount}
                        size={'small'}
                        color={`#DD0000`}
                        fontSize={16}
                        id={generateElementId(
                          ELEMENT_TYPE.TEXT,
                          ELEMENT_ACTION.VIEW,
                          'OrderDetail',
                          'PaymentInfo',
                          'otherDiscount',
                        )}
                      />
                    </span>
                  </div>
                </div>
              )}

              {credit_card_on_top_discount_amount && (
                <div className={s.promoCode}>
                  <div className={s.promoItem}>
                    <span>
                      <strong>{translate('credit_ontop')}</strong>
                    </span>
                    <span>
                      {' '}
                      <Price
                        isDiscount
                        digit={2}
                        format
                        price={credit_card_on_top_discount_amount}
                        size={'small'}
                        color={`#000000`}
                        fontSize={16}
                        id={generateElementId(
                          ELEMENT_TYPE.TEXT,
                          ELEMENT_ACTION.VIEW,
                          'OrderDetail',
                          'PaymentInfo',
                          'creditCardOnTop',
                        )}
                      />
                    </span>
                  </div>
                </div>
              )}

              {gw_id && (
                <>
                  <p className={s.subTitle}>
                    {translate('paymentInfo.gwOptions')}
                  </p>
                  <div className={s.summaryInfo}>
                    <span>{translate('paymentInfo.gwService')}</span>
                    {gw_price_incl_tax > 0 ? (
                      <span>
                        {' '}
                        <Price
                          format
                          price={gw_price_incl_tax}
                          size={'small'}
                          color={`#000000`}
                          fontSize={16}
                          id={generateElementId(
                            ELEMENT_TYPE.TEXT,
                            ELEMENT_ACTION.VIEW,
                            'OrderDetail',
                            'PaymentInfo',
                            'giftWithOptions',
                          )}
                        />
                      </span>
                    ) : (
                      <span
                        id={generateElementId(
                          ELEMENT_TYPE.TEXT,
                          ELEMENT_ACTION.VIEW,
                          'OrderDetail',
                          'PaymentInfo',
                          'giftWithOptions',
                        )}
                      >
                        {' '}
                        {translate('paymentInfo.gwFree')}
                      </span>
                    )}
                  </div>
                </>
              )}

              {t1c_redeem && (
                <>
                  <p className={s.subTitle}>
                    {translate('paymentInfo.t1cRedempiton')}
                  </p>
                  <div className={s.summaryInfo}>
                    <span>
                      {translate('redeem')} {redeemPoint} {translate('points')}
                    </span>
                    <span>
                      {' '}
                      <Price
                        isDiscount
                        digit={2}
                        format
                        price={t1c_redeem && redeemAmount}
                        size={'small'}
                        color={`#000000`}
                        fontSize={16}
                        id={generateElementId(
                          ELEMENT_TYPE.TEXT,
                          ELEMENT_ACTION.VIEW,
                          'OrderDetail',
                          'PaymentInfo',
                          't1cRedeemPoint',
                        )}
                      />
                    </span>
                  </div>
                </>
              )}

              <p className={s.subTitle}>{translate('paymentInfo.delivery')}</p>
              <div className={s.summaryInfo}>
                <span> {shipping_method_label}</span>
                {shipping_incl_tax > 0 ? (
                  <span>
                    <Price
                      digit={2}
                      format
                      price={shipping_incl_tax}
                      size={'small'}
                      color={`#000000`}
                      fontSize={16}
                      id={generateElementId(
                        ELEMENT_TYPE.TEXT,
                        ELEMENT_ACTION.VIEW,
                        'OrderDetail',
                        'PaymentInfo',
                        'shippingMethod',
                      )}
                    />
                  </span>
                ) : (
                  <span
                    id={generateElementId(
                      ELEMENT_TYPE.TEXT,
                      ELEMENT_ACTION.VIEW,
                      'OrderDetail',
                      'PaymentInfo',
                      'shippingMethod',
                    )}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {translate('paymentInfo.gwFree')}
                  </span>
                )}
              </div>

              <div
                className={cx(
                  s.summaryInfo,
                  s.totalPrice,
                  s.noLine,
                  s.totalLine,
                )}
              >
                <span className={s.subTitle}>
                  {translate('paymentInfo.orderTotal')}
                </span>
                <span>
                  <Price
                    digit={2}
                    format
                    price={grand_total}
                    size={'custom'}
                    color={`#000000`}
                    fontSize={20}
                    id={generateElementId(
                      ELEMENT_TYPE.TEXT,
                      ELEMENT_ACTION.VIEW,
                      'OrderDetail',
                      'PaymentInfo',
                      'orderTotal',
                    )}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={s.btnBottom}>
          <div className={s.left}>
            <Button
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.VIEW,
                'OrderDetail',
                'ReturnOrder',
              )}
              className={cx(s.printBtn, s.hideOnPrint)}
              outline
              onClick={() => this.handleReturnOrderClick()}
            >
              <ImageLazy
                width="18px"
                className={s.icon}
                src="/icons/ic-return.png"
              />
              {translate('returnBtn')}
            </Button>
          </div>

          <div className={s.right}>
            <Button
              id={generateElementId(
                ELEMENT_TYPE.BUTTON,
                ELEMENT_ACTION.VIEW,
                'OrderDetail',
                'PrintOrder',
              )}
              className={cx(s.printBtn, s.hideOnPrint)}
              outline
              onClick={() => print()}
            >
              <IosPrintOutline
                className={s.icon}
                icon="ios-print-outline"
                fontSize="22px"
                color="#333333"
              />
              {translate('printBtn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderDetailContainer;
