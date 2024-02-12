import React from 'react';
import pt from 'prop-types';
import { isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PriceContainer.scss';
import Price from '../Price/Price';

const PriceContainer = ({
  product,
  className,
  mainPriceSize = 'huge',
  discountPriceSize = 'small',
}) => {
  return (
    <div className={className}>
      <div className={s.regularPrice}>
        <Price
          className={s.price}
          bold
          size={mainPriceSize}
          price={
            !isEmpty(product.special_price)
              ? product.special_price
              : product.price
          }
        />
      </div>
      {!isEmpty(product.special_price) && (
        <div>
          <div className={s.discount}>
            <Price size={discountPriceSize} price={product.price} strike />
            <span className={s.discountCount}>
              save{' '}
              <Price
                className={s.price}
                size={discountPriceSize}
                price={product.price - product.special_price}
              />
            </span>
          </div>
          <div className={s.grayDarker}>
            price are valid from 15/03/2018 to 15/04/2018
          </div>
        </div>
      )}
    </div>
  );

  PriceContainer.propTypes = {
    product: pt.object.isRequired,
    className: pt.string,
    mainPriceSize: pt.string,
    discountPriceSize: pt.string,
  };
};

export default withStyles(s)(PriceContainer);
