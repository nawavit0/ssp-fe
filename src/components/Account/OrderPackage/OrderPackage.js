import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { first, map, take, find, get, isEmpty } from 'lodash';
import cx from 'classnames';
import s from './OrderPackage.scss';
import t from './translation.json';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { getProductImgUrl } from '../../../utils/imgUrl';
import Image from '../../Image';
import Link from '../../../components/Link';
import enableMarketplace from '../../../utils/enableMarketplace';
@withStyles(s)
@withLocales(t)
class OrderPackage extends React.PureComponent {
  static propTypes = {
    order: pt.object.isRequired,
  };

  state = {
    isShow: false,
  };

  showPackage = () => {
    this.setState({
      isShow: !this.state.isShow,
    });
  };

  findSellerName = items => {
    let result = 'Central';
    const item = first(items);
    const marketPlaceInfo = get(
      item.detail,
      'extension_attributes.marketplace_info',
      null,
    );
    if (marketPlaceInfo) {
      result = get(marketPlaceInfo, 'seller_info.name', 'Central');
    }

    return result;
  };

  findRetailProduct = items => {
    const item = first(items);
    const marketPlaceType = get(
      item.detail,
      'extension_attributes.marketplace_product_type',
      null,
    );
    if (marketPlaceType) {
      return false;
    }
    return true;
  };

  renderSeller() {
    const { translate, shipments } = this.props;
    const { items } = shipments;
    const sellerName = items.sold_by;
    return (
      <React.Fragment>
        {translate('sold_by')}: <strong>{sellerName}</strong>
      </React.Fragment>
    );
  }

  renderProductImage = product => {
    const findImg = find(
      get(product, 'detail.extension_attributes.custom_attributes'),
      { attribute_code: 'image' },
    );

    const productImageUrl =
      !isEmpty(findImg) && findImg.value !== 'no_selection'
        ? getProductImgUrl(
            findImg.value,
            this.props.activeStoreConfig.base_media_url,
          )
        : '/icons/product-img-empty.svg';

    return (
      <div className={s.prodImg}>
        <Image width="80" src={productImageUrl} />
        <div className={s.prodImgNum}>{product.qty}</div>
      </div>
    );
  };

  renderPackageForMarketplace() {
    const {
      translate,
      shipments,
      index,
      shippingMethod,
      order,
      showOtherItems,
    } = this.props;
    const {
      track_url,
      track_number,
      status,
      products,
      marketplaceInfo,
    } = shipments;

    const packgingStatus = status;
    const isHasPackageStatus =
      packgingStatus !== '' && packgingStatus !== 'canceled';
    const isHasPackageStatusCancel = packgingStatus === 'canceled';

    const isShowPackage = isHasPackageStatus || showOtherItems;

    const hasTrackNumber =
      shippingMethod !== 'pickupatstore_pickupatstore' && track_number;
    const marketplaceType = get(
      marketplaceInfo,
      'marketplace_product_type',
      false,
    );
    const showRefNumber = marketplaceType && isHasPackageStatus;
    const styleProductStatus = {
      completed: s.Completed,
      canceled: s.Cancel,
      delivered: s.Completed,
      collected: s.Completed,
    };

    return (
      <React.Fragment>
        {isShowPackage && (
          <div
            className={cx(s.sectionPackage, {
              [s.noStatus]: !isHasPackageStatus,
            })}
            onClick={this.showPackage}
          >
            <div className={s.packageMobile}>
              <div className={s.package}>
                <div className={s.packageNo}>
                  <Image
                    src="/images/package-icon.png"
                    height="18"
                    width="20"
                  />
                  {isHasPackageStatus ? (
                    <span className={s.packageName}>
                      {translate('package')} {index + 1}
                    </span>
                  ) : isHasPackageStatusCancel ? (
                    <React.Fragment>
                      <span className={s.packageName}>
                        {translate('cancelItem')}
                      </span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <span className={s.packageName}>
                        {translate('other_items')}
                      </span>
                    </React.Fragment>
                  )}
                </div>
                <React.Fragment>
                  {showRefNumber && (
                    <div className={cx(s.refNumber, s.showOnDesktop)}>
                      {': '}
                      {shipments.ref_number}
                    </div>
                  )}

                  <div className={s.packageArrow}>
                    {!this.state.isShow ? (
                      <Image
                        src="/icons/arrow-down.svg"
                        height="18"
                        width="20"
                      />
                    ) : (
                      <Image src="/icons/arrow-up.svg" height="18" width="20" />
                    )}
                  </div>
                </React.Fragment>
              </div>

              {isHasPackageStatus && (
                <React.Fragment>
                  {showRefNumber && (
                    <div className={cx(s.refNumberMobile, s.showOnMobile)}>
                      {shipments.ref_number}
                    </div>
                  )}

                  <div className={cx(s.status, styleProductStatus[status])}>
                    {translate('statusText')}:{' '}
                    <span>{translate(`status.${status}`)}</span>
                  </div>
                </React.Fragment>
              )}
            </div>

            {hasTrackNumber && isHasPackageStatus && (
              <div className={s.trackingNo}>
                <div className={s.trackLabel}>{translate('trackingNo')} </div>
                <span className={cx(s.trackingValue, s.showOnDesktop)}>
                  {track_number && (
                    <Link to={track_url} native external={1} target="_blank">
                      {track_number}
                    </Link>
                  )}
                </span>
                {track_number && (
                  <div className={cx(s.trackingValueMobile, s.showOnMobile)}>
                    <Link to={track_url} native external={1} target="_blank">
                      {track_number}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div
          className={cx(
            s.sectionBoxDetail,
            this.state.isShow ? s.showPackage : '',
            isShowPackage ? '' : s.showPackage,
          )}
        >
          <div className={s.prodImgList}>
            {map(take(products, 3), product =>
              this.renderProductImage(product),
            )}
            {products.length > 3 && (
              <div className={s.prodImgMore}>
                <Link
                  to={`/account/orders/${get(order, 'increment_id')}`}
                  native
                >
                  + {products.length - 3} More
                </Link>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const {
      order,
      activeStoreConfig,
      shipments,
      index,
      translate,
      shippingMethod,
      envConfigs,
    } = this.props;
    const { trackURL, trackNumber, status, items } = shipments;
    const isEnableMarketplace = enableMarketplace(envConfigs);
    const styleProductStatus = {
      completed: s.Completed,
      canceled: s.Cancel,
      delivered: s.Completed,
      collected: s.Completed,
    };

    return (
      <>
        {isEnableMarketplace ? (
          this.renderPackageForMarketplace()
        ) : (
          <div>
            <div className={cx(s.sectionPackage)} onClick={this.showPackage}>
              <div className={s.packageMobile}>
                <div className={s.package}>
                  <Image
                    src="/images/package-icon.png"
                    height="18"
                    width="20"
                  />
                  <span>
                    {' '}
                    {translate('package')}
                    {': '}
                    {index + 1}
                  </span>
                  {!this.state.isShow ? (
                    <Image src="/icons/arrow-down.svg" height="18" width="20" />
                  ) : (
                    <Image src="/icons/arrow-up.svg" height="18" width="20" />
                  )}
                </div>
                <div className={cx(s.status, styleProductStatus[status])}>
                  {translate('statusText')}{' '}
                  <span>{translate(`status.${status}`)}</span>
                </div>
              </div>
              {shippingMethod !== 'pickupatstore_pickupatstore' && (
                <div className={s.trackingNo}>
                  {trackNumber && (
                    <div>
                      <div className={s.trackLabel}>
                        {translate('trackingNo')}
                      </div>{' '}
                      <span>
                        <Link to={trackURL} native external={1} target="_blank">
                          {trackNumber}
                        </Link>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              className={cx(
                s.sectionBoxDetail,
                this.state.isShow ? s.showPackage : '',
              )}
            >
              <div className={s.prodImgList}>
                {map(take(items, 3), product => {
                  const findImg = find(
                    get(
                      product,
                      'detail.extension_attributes.custom_attributes',
                    ),
                    { attribute_code: 'image' },
                  );
                  return (
                    <div className={s.prodImg}>
                      {!isEmpty(findImg) ? (
                        findImg.value !== 'no_selection' ? (
                          <Image
                            width="80"
                            src={getProductImgUrl(
                              findImg.value,
                              activeStoreConfig.base_media_url,
                            )}
                          />
                        ) : (
                          <Image
                            width="80"
                            src="/static/images/DefaultImage.jpg"
                          />
                        )
                      ) : (
                        <Image
                          width="80"
                          src="/static/images/DefaultImage.jpg"
                        />
                      )}
                      <div className={s.prodImgNum}>{product.qty}</div>
                    </div>
                  );
                })}
                {items.length > 3 && (
                  <div className={s.prodImgMore}>
                    <Link
                      to={`/account/orders/${get(order, 'increment_id')}`}
                      native
                    >
                      + {items.length - 3} More
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  envConfigs: state.envConfigs,
});

const matchDispatchToProps = () => ({});

export default connect(mapStateToProps, matchDispatchToProps)(OrderPackage);
