import React from 'react';
import { map, isEmpty } from 'lodash';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import cx from 'classnames';
import t from './translation.json';
import s from './OrderList.scss';
//import { getProductImgUrl } from '../../../utils/imgUrl';
import Link from '../../../components/Link';
import Price from '../../Price';
//import Image from '../../Image';
import OrderStatus from '../../../components/OrderStatus';
// import OrderEmpty from '../../../components/Account/OrderEmpty';
//import OrderPackage from '../OrderPackage';
import { withStoreConfig } from '@central-tech/core-ui';
import { Skeleton } from '@central-tech/core-ui';

@withStoreConfig
@withLocales(t)
@withStyles(s)
class Orders extends React.PureComponent {
  // static propTypes = {
  //   orders: pt.object.isRequired,
  // };

  state = {
    isShow: false,
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

  showPackage = () => {
    this.setState({
      isShow: !this.state.isShow,
    });
  };

  renderBlockLoading = () => {
    return (
      <div key={0} className={s.sectionBox}>
        <div className={s.sectionBoxTop}>
          <div className={cx(s.orderInfo, s.rowTitle)}>
            <div>
              <Skeleton
                time={1}
                width="80%"
                borderRadius={0}
                height="16px"
                margin="0 0 8px 0"
              />
            </div>
            <div>
              <Skeleton
                time={1}
                width="50%"
                borderRadius={0}
                height="16px"
                margin="0 0 8px 0"
              />
            </div>
          </div>
          <div className={cx(s.orderStatus, s.rowTitle)}>
            <Skeleton
              time={1}
              width="50%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
            <Skeleton
              time={1}
              width="80%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
          </div>
          <div className={cx(s.delivery, s.rowTitle)}>
            <Skeleton
              time={1}
              width="50%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
            <Skeleton
              time={1}
              width="80%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
          </div>
          <div className={cx(s.payment, s.rowTitle)}>
            <Skeleton
              time={1}
              width="50%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
            <Skeleton
              time={1}
              width="80%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
          </div>
          <div className={cx(s.totalPrice, s.rowTitle)}>
            <Skeleton
              time={1}
              width="80%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
            <Skeleton
              time={1}
              width="40%"
              borderRadius={0}
              height="16px"
              margin="0 0 8px 0"
            />
          </div>
          {/*<div className={s.mobileOnly}>*/}
          {/*  {!isEmpty(pickup_code) && (*/}
          {/*    <p>*/}
          {/*      {translate('pickup_code')} {pickup_code}*/}
          {/*    </p>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
      </div>
    );
  };

  renderOrderItem(key, order) {
    const { translate, lang } = this.props;
    const orderExtensionAttributes = order?.extension_attributes || {};
    const shippingMethodLabel =
      orderExtensionAttributes?.shipping_method_label || '-';
    const paymentMethodLabel =
      orderExtensionAttributes?.payment_method_label || '';
    const orderStatus = orderExtensionAttributes?.order_status || '';
    const deliveryStatus =
      orderExtensionAttributes?.delivery_status || orderStatus;
    const pickupCode = orderExtensionAttributes?.pickup_code || '';
    // const shippingAssignments =
    //   orderExtensionAttributes?.shipping_assignments || '';
    // const { shipments } = order;
    //const shippingMethod = head(shippingAssignments).shipping.method;
    //const orderFilter = this.getOrderWithoutShipment(order);
    const orderIncrementId = order?.increment_id || '-';
    const grandTotal = order?.grand_total || 0;
    const itemsTotal = order?.items?.length || 0;
    const orderDate = order?.created_at || '-';
    moment.locale(lang);
    return (
      <div key={key} className={s.sectionBox}>
        <div className={s.sectionBoxTop}>
          <div className={cx(s.orderInfo, s.rowTitle)}>
            <div className={s.textTitle}>{translate('order_no')}</div>
            <div className={s.textOrderNo}>{orderIncrementId}</div>
            <div className={s.textTotalItems}>{`${translate(
              'total_items',
            )} : ${itemsTotal}`}</div>
            <div className={s.textOrderDate}>{translate('order_date')}</div>
            <div className={s.textContent}>
              {moment(orderDate).format('YYYY - MM - DD')}
            </div>
          </div>
          <div className={cx(s.orderStatus, s.rowTitle)}>
            <div className={s.textTitle}>
              {translate('current_order_status')}
            </div>
            <div className={s.textContent}>
              <OrderStatus status={deliveryStatus} />
            </div>
            {/*<p className={s.title}>{translate('current_order_status')}</p>*/}
            {/*<div className={s.orderStatusIcon}>*/}
            {/*  {!isEmpty(deliveryStatus) && (*/}
            {/*    <span className={cx(s.orderStatusText, s.completed)}>*/}
            {/*      <OrderStatus status={deliveryStatus} />*/}
            {/*    </span>*/}
            {/*  )}*/}
            {/*</div>*/}
          </div>
          <div className={cx(s.delivery, s.rowTitle)}>
            <div className={s.textTitle}>{translate('delivery_type')}</div>
            <div className={s.textContent}>{shippingMethodLabel}</div>
            <div>
              {!isEmpty(pickupCode) && (
                <p className={s.pickup_code}>
                  {translate('pickup_code')} {pickupCode}
                </p>
              )}
            </div>
          </div>
          <div className={cx(s.payment, s.rowTitle)}>
            <div className={s.textTitle}>{translate('payment_method')}</div>
            <div className={s.textContent}>{paymentMethodLabel}</div>
          </div>
          <div className={cx(s.totalPrice, s.rowTitle)}>
            <div className={s.textTitle}>{translate('order_total')}</div>
            <div>
              <Price
                className={s.priceGrandTotal}
                size="17px"
                digit={2}
                format
                price={grandTotal}
                color="#232323"
              />
            </div>
            <div>
              <Link
                className={s.link}
                to={`/account/orders/${orderIncrementId}`}
                native={false}
              >
                {`${translate('more_detail')} >`}
              </Link>
            </div>
          </div>
          {/*<div className={s.mobileOnly}>*/}
          {/*  {!isEmpty(pickupCode) && (*/}
          {/*    <p>*/}
          {/*      {translate('pickup_code')} {pickupCode}*/}
          {/*    </p>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
        <div className={s.progressBox}>
          <div className={s.active}>
            <div className={s.circleBox}></div>
            <div className={s.progressStatus}>Payment</div>
          </div>
          <div className={s.progressLine}></div>
          <div className={s.active}>
            <div className={s.circleBox}></div>
            <div className={s.progressStatus}>Processing</div>
          </div>
          <div className={s.progressLine}></div>
          <div>
            <div className={s.circleBox}></div>
            <div className={s.progressStatus}>In-Transit</div>
          </div>
          <div className={s.progressLine}></div>
          <div>
            <div className={s.circleBox}></div>
            <div className={s.progressStatus}>Complete</div>
          </div>
        </div>
        {/*{shipments.map((product, index) => (*/}
        {/*  <OrderPackage*/}
        {/*    order={order}*/}
        {/*    shipments={product}*/}
        {/*    index={index}*/}
        {/*    activeStoreConfig={activeConfig}*/}
        {/*    shippingMethod={shippingMethod}*/}
        {/*  />*/}
        {/*))}*/}
        {/*{!isEmpty(orderFilter) && (*/}
        {/*  <div>*/}
        {/*    {!isEmpty(shipments) && (*/}
        {/*      <div className={cx(s.sectionPackage)} onClick={this.showPackage}>*/}
        {/*        <div className={s.packageMobile}>*/}
        {/*          <div className={s.package}>*/}
        {/*            <Image*/}
        {/*              src="/images/package-icon.png"*/}
        {/*              height="18"*/}
        {/*              width="20"*/}
        {/*            />*/}
        {/*            <span>{translate('other_items')}</span>*/}
        {/*            {!this.state.isShow ? (*/}
        {/*              <Image*/}
        {/*                src="/icons/arrow-down.svg"*/}
        {/*                height="18"*/}
        {/*                width="20"*/}
        {/*              />*/}
        {/*            ) : (*/}
        {/*              <Image src="/icons/arrow-up.svg" height="18" width="20" />*/}
        {/*            )}*/}
        {/*          </div>*/}
        {/*          <div className={s.status}>*/}
        {/*            {translate('statusText')}{' '}*/}
        {/*            <span>{translate(`status.${order_status}`)}</span>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    )}*/}
        {/*    {}*/}
        {/*    <div*/}
        {/*      className={cx(*/}
        {/*        s.sectionBoxDetail,*/}
        {/*        this.state.isShow ? s.showPackage : '',*/}
        {/*        isEmpty(shipments) ? s.showDetail : '',*/}
        {/*      )}*/}
        {/*    >*/}
        {/*      <div className={s.prodImgList}>*/}
        {/*        {map(take(orderFilter, 3), product => {*/}
        {/*          const findImg = find(*/}
        {/*            product?.extension_attributes?.custom_attributes || {*/}
        {/*              attribute_code: 'image',*/}
        {/*            },*/}
        {/*          );*/}
        {/*          return (*/}
        {/*            <div className={s.prodImg}>*/}
        {/*              {!isEmpty(findImg) ? (*/}
        {/*                findImg.value !== 'no_selection' ? (*/}
        {/*                  <Image*/}
        {/*                    width="80"*/}
        {/*                    src={getProductImgUrl(*/}
        {/*                      findImg.value,*/}
        {/*                      activeConfig.base_media_url,*/}
        {/*                    )}*/}
        {/*                  />*/}
        {/*                ) : (*/}
        {/*                  <Image*/}
        {/*                    width="80"*/}
        {/*                    src="/icons/product-img-empty.svg"*/}
        {/*                  />*/}
        {/*                )*/}
        {/*              ) : (*/}
        {/*                <Image width="80" src="/icons/product-img-empty.svg" />*/}
        {/*              )}*/}
        {/*              <div className={s.prodImgNum}>*/}
        {/*                {product.qty_ordered - product.qty_shipped}*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*          );*/}
        {/*        })}*/}
        {/*        {orderFilter.length > 3 && (*/}
        {/*          <div className={s.prodImgMore}>*/}
        {/*            <Link*/}
        {/*              to={`/account/orders/${order.increment_id}`}*/}
        {/*              native={false}*/}
        {/*            >*/}
        {/*              + {orderFilter.length - 3} More*/}
        {/*            </Link>*/}
        {/*          </div>*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
    );
  }

  render() {
    const { orders, loading } = this.props;
    const renderBlock = [];
    for (let i = 0; i < 1; i++) {
      renderBlock.push(this.renderBlockLoading());
    }
    if (loading) return renderBlock;
    if (orders && orders.length > 0) {
      return map(orders, val => {
        return this.renderOrderItem(val.increment_id, val);
      });
    }
    return null;
    // return <OrderEmpty />;
  }
}

export default Orders;
