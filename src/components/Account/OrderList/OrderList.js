import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { map, take, find, get as prop, isEmpty, head } from 'lodash';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import cx from 'classnames';
import t from './translation.json';
import s from './OrderList.scss';
import { getProductImgUrl } from '../../../utils/imgUrl';
import Link from '../../../components/Link';
import Price from '../../Price';
import ImageLazy from '../../Image/ImageLazy';
import OrderStatus from '../../../components/OrderStatus';
import OrderPackage from '../OrderPackage';

@withLocales(t)
@withStyles(s)
class Orders extends React.PureComponent {
  static propTypes = {
    order: pt.object.isRequired,
  };

  state = {
    isShow: false,
  };

  getOrderWithoutShipment = order => {
    const items = order?.items || [];
    const orderItems = [];

    items.map(product => {
      if (
        product.qty_shipped < product.qty_ordered &&
        product.product_type !== 'configurable'
      ) {
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

  render() {
    const { order, translate, activeStoreConfig, lang } = this.props;
    const shipping_method_label =
      order?.extension_attributes?.shipping_method_label || '';
    const payment_method_label =
      order?.extension_attributes?.payment_method_label || '';
    const order_status = order?.extension_attributes?.order_status || '';
    const delivery_status = order?.extension_attributes?.delivery_status || '';
    const pickup_code = order?.extension_attributes?.pickup_code || '';
    const shipping_assignments =
      order?.extension_attributes?.shipping_assignments || '';
    const shipments = order?.shipments || [];
    const shippingMethod = head(shipping_assignments)?.shipping?.method || '';
    const orderFilter = this.getOrderWithoutShipment(order);
    const deliveryStatus = delivery_status || order_status;
    moment.locale(lang);
    return (
      <div className={s.sectionBox}>
        <div className={s.sectionBoxTop}>
          <div className={cx(s.orderInfo, s.rowTitle)}>
            <div className={s.orderNo}>
              <p className={s.titleOrderNo}>{translate('order_no')}</p>
              <div className={s.content}>{order?.increment_id || ''}</div>
            </div>
            <div className={s.orderDate}>
              <div>{translate('placed_on')}</div>
              <div>
                {prop(order, 'created_at', '') &&
                  moment(order.created_at).format('YYYY - MM - DD')}
              </div>
            </div>
          </div>
          <div className={cx(s.orderStatus, s.rowTitle)}>
            <p className={s.title}>{translate('order_status')}</p>
            {!isEmpty(deliveryStatus) && (
              <OrderStatus status={deliveryStatus} />
            )}
          </div>
          <div className={cx(s.delivery, s.rowTitle)}>
            <p className={s.title}>{translate('delivery_option')}</p>
            <div className={s.content}>{shipping_method_label}</div>
            {!isEmpty(pickup_code) && (
              <p className={s.pickup_code}>
                {translate('pickup_code')} {pickup_code}
              </p>
            )}
          </div>
          <div className={cx(s.payment, s.rowTitle)}>
            <p className={s.title}>{translate('payment')}</p>
            <div className={s.content}>{payment_method_label}</div>
          </div>
          <div className={s.totalPrice}>
            <div className={cx(s.title, s.grandTotal)}>
              <div>{translate('total')}</div>
              <Price
                className={s.priceGrandTotal}
                size="medium"
                digit={2}
                format
                price={order?.base_grand_total || 0}
                color="gray"
              />
            </div>
            <p className={s.description}>
              <Link
                className={s.link}
                to={`/account/orders/${order?.increment_id || '0'}`}
                native
              >
                {translate('view_detail')}
                <ImageLazy
                  src="/static/icons/ArrowRight.svg"
                  height="18px"
                  width="20px"
                />
              </Link>
            </p>
          </div>
          <div className={s.mobileOnly}>
            {!isEmpty(pickup_code) && (
              <p>
                {translate('pickup_code')} {pickup_code}
              </p>
            )}
          </div>
        </div>
        {shipments.map((product, index) => (
          <OrderPackage
            order={order}
            shipments={product}
            index={index}
            activeStoreConfig={activeStoreConfig}
            shippingMethod={shippingMethod}
          />
        ))}
        {!isEmpty(orderFilter) && (
          <div>
            {!isEmpty(shipments) && (
              <div className={cx(s.sectionPackage)} onClick={this.showPackage}>
                <div className={s.packageMobile}>
                  <div className={s.package}>
                    <ImageLazy
                      src="/images/package-icon.png"
                      height="18px"
                      width="20px"
                    />
                    <span>{translate('other_items')}</span>
                    {!this.state.isShow ? (
                      <ImageLazy
                        src="/icons/arrow-down.svg"
                        height="18px"
                        width="20px"
                      />
                    ) : (
                      <ImageLazy
                        src="/icons/arrow-up.svg"
                        height="18px"
                        width="20px"
                      />
                    )}
                  </div>
                  <div className={s.status}>
                    {deliveryStatus && (
                      <>
                        {translate('statusText')}{' '}
                        <span>{translate(`status.${order_status}`)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {}
            <div
              className={cx(
                s.sectionBoxDetail,
                this.state.isShow ? s.showPackage : '',
                isEmpty(shipments) ? s.showDetail : '',
              )}
            >
              <div className={s.prodImgList}>
                {map(take(orderFilter, 3), product => {
                  const findImg = find(
                    prop(product, 'extension_attributes.custom_attributes'),
                    { attribute_code: 'image' },
                  );
                  return (
                    <div className={s.prodImg}>
                      {!isEmpty(findImg) ? (
                        findImg.value !== 'no_selection' ? (
                          <ImageLazy
                            width="80px"
                            src={getProductImgUrl(
                              findImg.value,
                              activeStoreConfig.base_media_url,
                            )}
                          />
                        ) : (
                          <ImageLazy
                            width="80px"
                            src="/static/images/DefaultImage.jpg"
                          />
                        )
                      ) : (
                        <ImageLazy
                          width="80px"
                          src="/static/images/DefaultImage.jpg"
                        />
                      )}
                      <div className={s.prodImgNum}>
                        {product.qty_ordered - product.qty_shipped}
                      </div>
                    </div>
                  );
                })}
                {orderFilter.length > 3 && (
                  <div className={s.prodImgMore}>
                    <Link to={`/account/orders/${order.increment_id}`} native>
                      + {orderFilter.length - 3} More
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  accountInfo: state.account.accountInfo,
  customer: state.customer.customer,
  loading: state.customer.loading,
  activeStoreConfig: state.storeConfig.activeConfig,
});

const matchDispatchToProps = () => ({});

export default connect(mapStateToProps, matchDispatchToProps)(Orders);
