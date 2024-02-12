import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IosCheckmark from 'react-ionicons/lib/IosCheckmark';
import { map, isEmpty, get as prop, find } from 'lodash';
import withLocales from '../../../utils/decorators/withLocales';
import s from './OrderItems.scss';
import t from './translation.json';
import Price from '../../Price/Price';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const OrderItems = ({ items, giftwarp, translate }) => {
  const productImg = item => {
    const productCustomAttr = prop(
      item,
      'extension_attributes.custom_attributes',
    );
    const productImageObject = find(
      productCustomAttr,
      attribute => attribute.attribute_code === 'image',
    );
    const imgUrl = prop(productImageObject, 'value', '');
    return imgUrl;
  };

  const moduleName = 'PurchasedItems';

  return (
    <div className={s.root}>
      <h3 className={s.mainTitle}>Purchased Items</h3>
      <div className={s.productList}>
        {map(items, item => (
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'Product',
              moduleName,
              prop(item, 'sku', null),
            )}
            className={s.productItem}
            key={item.sku}
          >
            <div className={s.detailCon}>
              <div className={s.imageCon}>
                {!isEmpty(productImg(item)) ? (
                  <img
                    src={`${
                      item.productDetail.base_image_url
                    }catalog/product${productImg(item)}`}
                  />
                ) : (
                  <img src="/static/images/DefaultImage.jpg" />
                )}
              </div>
              <div className={s.contentCon}>
                <div className={s.brand}>
                  {item.productDetail.brand_name_option}
                </div>
                <div
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'ProductName',
                    moduleName,
                    prop(item, 'sku', null),
                  )}
                  className={s.name}
                >
                  {item.name}
                </div>
                <div className={s.attr}>
                  {/* {item.productDetail.color_option} */}
                  {item.productDetail.product_size_simple_option}
                </div>
              </div>
            </div>
            <div className={s.priceMain}>
              <div className={s.qtyCon}>
                {translate('quantity')}:{' '}
                <span
                  id={generateElementId(
                    ELEMENT_TYPE.INFO,
                    ELEMENT_ACTION.VIEW,
                    'Qty',
                    moduleName,
                    prop(item, 'sku', null),
                  )}
                >
                  {item.qty_ordered}
                </span>
              </div>
              <div className={s.priceCon}>
                {/* {item.row_total_incl_tax === 0 ? '' : `฿${item.price_incl_tax}`} */}
                {item.row_total_incl_tax === 0 ? (
                  ''
                ) : (
                  <Price
                    id={generateElementId(
                      ELEMENT_TYPE.INFO,
                      ELEMENT_ACTION.VIEW,
                      'PriceItem',
                      moduleName,
                      prop(item, 'sku', null),
                    )}
                    digit={2}
                    format
                    price={item.price_incl_tax}
                    fontSize={14}
                  />
                )}
              </div>
              <div className={s.totalCon}>
                {/* {item.row_total_incl_tax === 0
                ? 'FREE'
                : `฿${item.row_total_incl_tax}`} */}
                {item.row_total_incl_tax === 0 ? (
                  'FREE'
                ) : (
                  <Price
                    id={generateElementId(
                      ELEMENT_TYPE.INFO,
                      ELEMENT_ACTION.VIEW,
                      'PriceTotal',
                      moduleName,
                      prop(item, 'sku', null),
                    )}
                    digit={2}
                    format
                    price={item.price_incl_tax * item.qty_ordered}
                    fontSize={18}
                    fontWeight="bold"
                  />
                )}
              </div>
            </div>
            {giftwarp && (
              <div className={s.giftwarp}>
                <IosCheckmark
                  icon="ios-checkmark"
                  fontSize="30px"
                  color="#4a90e2"
                />
                {translate('gift_wrapping')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withLocales(t)(withStyles(s)(OrderItems));
