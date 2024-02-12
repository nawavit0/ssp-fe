import React from 'react';
import pt from 'prop-types';
import { find, get as prop, isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { getProductImgUrl } from '../../../utils/imgUrl';
import cx from 'classnames';
import t from './translation.json';
import s from './OrderItem.scss';
import ImageLazy from '../../Image/ImageLazy';
import Price from '../../Price/Price';
import { withStoreConfig } from '@central-tech/core-ui';

@withStoreConfig
@withLocales(t)
@withStyles(s)
class OrderItem extends React.PureComponent {
  static propTypes = {
    product: pt.object.isRequired,
    giftWrap: pt.object,
    isPackage: pt.bool,
  };

  static defaultProps = {
    isPackage: false,
  };

  render() {
    const {
      translate,
      activeConfig,
      product,
      giftWrap,
      isPackage,
    } = this.props;

    let findImg, imageUrl, brandProd, prodSize, name, detail, qty, price;

    if (isPackage) {
      name = product.name;
      detail = product.detail;
      qty = product.qty;

      price = detail.price_incl_tax;

      findImg = find(
        prop(product, 'detail.extension_attributes.custom_attributes'),
        { attribute_code: 'image' },
      );
      imageUrl = getProductImgUrl(
        prop(findImg, 'value', ''),
        activeConfig.base_media_url,
      );
      brandProd = find(
        prop(product, 'detail.extension_attributes.custom_attributes'),
        { attribute_code: 'brand_name' },
      );
      prodSize = find(
        prop(product, 'detail.extension_attributes.custom_attributes'),
        { attribute_code: 'product_size_simple' },
      );
    } else {
      name = product.name;
      price = product.price_incl_tax;
      qty = product.qty_ordered - product.qty_shipped;

      findImg = find(prop(product, 'extension_attributes.custom_attributes'), {
        attribute_code: 'image',
      });
      imageUrl = getProductImgUrl(
        prop(findImg, 'value', ''),
        activeConfig.base_media_url,
      );
      brandProd = find(
        prop(product, 'extension_attributes.custom_attributes'),
        { attribute_code: 'brand_name' },
      );
      prodSize = find(prop(product, 'extension_attributes.custom_attributes'), {
        attribute_code: 'product_size_simple',
      });
    }

    return (
      <div className={s.prodItem}>
        <div>
          <div className={s.prodImg}>
            {!isEmpty(findImg) ? (
              findImg.value !== 'no_selection' ? (
                <ImageLazy width="80px" src={imageUrl} />
              ) : (
                <ImageLazy width="80px" src="/static/images/DefaultImage.jpg" />
              )
            ) : (
              <ImageLazy width="80px" src="/static/images/DefaultImage.jpg" />
            )}
          </div>
        </div>
        <div className={s.prodItemDetail}>
          <div className={s.prodName}>
            {brandProd && brandProd.value && (
              <p className={s.title}>{brandProd.value}</p>
            )}
            <p>{name}</p>
            <p>{prodSize ? prodSize.value : ''}</p>
            <p className={cx(s.mobileOnly)}>
              {qty} x &nbsp;
              {price > 0 ? (
                <Price
                  color={`#000000`}
                  fontSize={16}
                  digit={2}
                  format
                  price={price}
                  size={'small'}
                />
              ) : (
                <div style={{ textTransform: 'uppercase' }}>Free</div>
              )}
            </p>
            {giftWrap && (
              <p className={s.giveWrapping}>
                <ImageLazy
                  src={`/static/icons/CheckMark.svg`}
                  alt={`checkmark`}
                  width={`14px`}
                />
                {translate('gift_wrapping')}
              </p>
            )}
          </div>
          <div className={cx(s.prodQty, s.desktopOnly)}>
            <p>
              {translate('quantity')} {qty}
            </p>
          </div>
          <div className={cx(s.prodPrice, s.desktopOnly)}>
            {price > 0 ? (
              <Price
                color={`#000000`}
                fontSize={16}
                digit={2}
                format
                price={price}
                size={'small'}
              />
            ) : (
              <div style={{ textTransform: 'uppercase' }}>Free</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default OrderItem;
