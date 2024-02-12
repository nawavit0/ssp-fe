import React from 'react';
import pt from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './OrderItem.scss';
import t from './translation.json';
import Price from '../../Price';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

@withStyles(s)
@withLocales(t)
export class OrderItem extends React.PureComponent {
  static propTypes = {
    sku: pt.string,
    brandName: pt.string,
    imageUrl: pt.string,
    name: pt.string,
    price: pt.number,
    qty: pt.number,
    positionElementID: pt.string,
  };

  static defaultProps = {
    sku: null,
    positionElementID: null,
  };

  render() {
    const {
      sku,
      brandName,
      imageUrl,
      name,
      price,
      qty,
      translate,
      image,
      positionElementID,
    } = this.props;

    return (
      <div
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'Product',
          positionElementID,
          sku,
        )}
        className={s.root}
      >
        <div className={s.thumbnail}>
          {image && image !== 'no_selection' ? (
            <img className={s.image} src={imageUrl} />
          ) : (
            <img className={s.image} src="/icons/product-img-empty.svg" />
          )}
        </div>
        <div className={s.details}>
          <div className={s.brand}>{brandName}</div>
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'ProductName',
              positionElementID,
              sku,
            )}
            className={s.name}
          >
            {name}
          </div>
          <div className={s.cartInfo}>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'Price',
                positionElementID,
                sku,
              )}
              className={s.price}
              price={price}
              format
              bold
              digit={2}
              size="small"
              freeMessage
            />
            <div className={s.qty}>
              {translate('quantity')}
              <span
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'Qty',
                  positionElementID,
                  sku,
                )}
              >
                {qty}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderItem;
