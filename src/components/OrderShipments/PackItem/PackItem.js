import { head, get, isEmpty, find, size, isUndefined } from 'lodash';
import cx from 'classnames';
import MdCheckmark from 'react-ionicons/lib/MdCheckmark';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { getProductImgUrl } from '../../../utils/imgUrl';
import Image from '../../../components/Image';
import Link from '../../../components/Link';
import Price from '../../../components/Price/Price';
import TrackingProgressBar from '../../../components/TrackingProgressBar';
import withLocales from '../../../utils/decorators/withLocales';

import s from './../OrderShipments.scss';
import t from './../translation.json';

const PackItem = ({
  order,
  packaging,
  index,
  activeStoreConfig,
  translate,
  showOtherItems,
}) => {
  const renderProduct = product => {
    const { gw_id } = order.extension_attributes;
    const productDetail = get(product, 'detail');
    if (isUndefined(productDetail)) return null;

    const { extension_attributes, price_incl_tax } = productDetail;

    const qty = get(product, 'qty', 1);
    const price = price_incl_tax * qty;

    const findImg = find(get(extension_attributes, 'custom_attributes'), {
      attribute_code: 'image',
    });

    const productImage = getProductImgUrl(
      get(findImg, 'value', ''),
      activeStoreConfig.base_media_url,
    );

    const productBrandName = find(
      get(extension_attributes, 'custom_attributes'),
      {
        attribute_code: 'brand_name',
      },
    );

    const productColor = find(get(extension_attributes, 'custom_attributes'), {
      attribute_code: 'color',
    });

    const productSize = find(get(extension_attributes, 'custom_attributes'), {
      attribute_code: 'size',
    });

    const styleProductStatus = {
      completed: s.Completed,
      canceled: s.Cancel,
      delivered: s.Completed,
      collected: s.Completed,
    };
    const hasProductImage =
      !isEmpty(findImg) && findImg.value !== 'no_selection';

    const packagingStatus = get(packaging, 'status', false);
    const productStatus = get(product, 'status');
    let status = false;
    if (packagingStatus) {
      status = packagingStatus;
    } else if (productStatus === 'canceled') {
      status = productStatus;
    } else {
      status = false;
    }

    const statusKey = `status.${status}`;
    const productColorValue = get(productColor, 'value');
    const productSizeValue = get(productSize, 'value');
    const hasProductOptions = productColorValue || productSizeValue;
    const item = (
      <div className={s.ProductContainer}>
        {status && (
          <div
            className={cx(
              s.ProductStatus,
              s.isMobile,
              s.showOnMobile,
              styleProductStatus[status],
            )}
          >
            {translate(statusKey)}
          </div>
        )}

        <div className={s.Product}>
          <div className={s.ColLeft}>
            <div className={s.ProductImage}>
              <Image
                width="80"
                src={
                  hasProductImage
                    ? productImage
                    : '/icons/product-img-empty.svg'
                }
              />
            </div>
          </div>
          <div className={s.ColRight}>
            <div className={s.ProductInfo}>
              {productBrandName && (
                <p className={s.ProductBrandName}>
                  <strong>{productBrandName.value}</strong>
                </p>
              )}
              <p>{productDetail.name}</p>
              {hasProductOptions && (
                <p>
                  {productColorValue ? productColorValue : ''}
                  {productColorValue && productSizeValue ? ', ' : ''}
                  {productSizeValue ? productSizeValue : ''}
                </p>
              )}

              <div className={s.showOnMobile}>
                {qty} x{' '}
                <Price
                  className={s.ProductPriceMobile}
                  digit={2}
                  format
                  price={price}
                  size={'small'}
                />
              </div>

              {gw_id && (
                <p className={s.giveWrapping}>
                  <MdCheckmark icon="md-checkmark" width="20" color="#4a90e2" />
                  {translate('gift_wrapping')}
                </p>
              )}
            </div>

            <div className={cx(s.ProductQty, s.showOnDesktop)}>
              {translate('quantity')}: {qty}
            </div>

            <div className={cx(s.ProductPrice, s.showOnDesktop)}>
              <Price digit={2} format price={price} size={'small'} />
            </div>

            {status && (
              <div
                className={cx(
                  s.ProductStatus,
                  s.showOnDesktop,
                  styleProductStatus[status],
                )}
              >
                {translate(statusKey)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
    return item;
  };

  const { extension_attributes } = order;
  const { shipping_assignments, order_status } = extension_attributes;

  const tempShippingAssignment = head(shipping_assignments);
  const shippingMethod = get(tempShippingAssignment, 'shipping.method', null);
  const isHasTrackingNumber =
    get(packaging, 'track_number') && get(packaging, 'shipment_provider');

  const packgingStatus = get(packaging, 'status');
  const isHasPackageStatus =
    packgingStatus !== '' && packgingStatus !== 'canceled';
  const isHasPackageStatusCancel = packgingStatus === 'canceled';

  const packagingStatusTracking =
    packgingStatus !== '' ? packgingStatus : order_status;
  const isShowRefNumber = get(packaging, 'marketplaceInfo', false);
  const isShowPackage = isHasPackageStatus || showOtherItems;

  const renderPackageBar = () => {
    const packageBar = (
      <>
        {isShowPackage && (
          <div className={s.PackagingNo}>
            <div className={s.PackagingTitle}>
              <span className={s.PackageIcon}>
                <Image src="/images/package-icon.png" height="18" width="20" />
              </span>

              {isHasPackageStatus ? (
                <>
                  {translate('package')} {index + 1}
                  {isShowRefNumber && (
                    <span>
                      {': '} {packaging.ref_number}
                    </span>
                  )}
                </>
              ) : isHasPackageStatusCancel ? (
                <>{translate('cancelItem')}</>
              ) : (
                <>{translate('otherItem')}</>
              )}
            </div>

            {isHasTrackingNumber && (
              <div className={s.PackagingProvider}>
                <div className={s.Label}>{translate('deliveredBy')}</div>
                <div className={s.Provider}>{packaging.shipment_provider}</div>
              </div>
            )}
          </div>
        )}
      </>
    );
    return packageBar;
  };

  const renderItems = (items, status) => {
    const htmlItems = (
      <>
        <div className={s.PackagingProgress}>
          <TrackingProgressBar
            className={s.PackagingProcessBar}
            status={status}
            shippingMethod={shippingMethod}
            package
          />
        </div>
        <div className={s.PackagingProductContainer}>
          {items.map(product => renderProduct(product))}
        </div>
      </>
    );
    return htmlItems;
  };

  const renderOtherItems = packaging => {
    const itemCanceled = packaging.products.filter(
      product => product.status === 'canceled',
    );
    const itemNoStatus = packaging.products.filter(
      product => product.status !== 'canceled',
    );

    const htmlOtherItems = (
      <>
        {size(itemCanceled) > 0 && renderItems(itemCanceled, null)}
        {size(itemNoStatus) > 0 &&
          renderItems(itemNoStatus, packagingStatusTracking)}
      </>
    );
    return htmlOtherItems;
  };

  return (
    <div className={s.Packaging}>
      {renderPackageBar()}
      {isHasPackageStatus ? (
        <>
          <div className={s.PackagingProgress}>
            {packaging.track_number && (
              <div className={s.PackagingTrackNumber}>
                {translate('yourOrder')}{' '}
                {translate(`status.${packaging.status}`)}
                {shippingMethod !== 'pickupatstore_pickupatstore' && (
                  <>
                    {translate('dot')} {translate('tracking_number')}
                    {': '}
                    <Link
                      className={s.trackLink}
                      to={packaging.track_url ? packaging.track_url : '#'}
                      native
                      external={1}
                      target="_blank"
                    >
                      {packaging.track_number}
                    </Link>
                  </>
                )}
              </div>
            )}

            <TrackingProgressBar
              className={s.PackagingProcessBar}
              status={packagingStatusTracking}
              shippingMethod={shippingMethod}
              package
            />
          </div>
          <div className={s.PackagingProductContainer}>
            {packaging.products.map(product => renderProduct(product))}
          </div>
        </>
      ) : (
        <>{renderOtherItems(packaging)}</>
      )}
    </div>
  );
};

export default withLocales(t)(withStyles(s)(PackItem));
