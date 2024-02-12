import React from 'react';
import pt from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Counter.scss';
import gtmType from '../../constants/gtmType';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';
import { gtmAttrDataProduct } from '../../utils/gtm/gtmAttrDataProduct';

class Counter extends React.PureComponent {
  static propTypes = {
    sku: pt.string,
    value: pt.number,
    qty: pt.number,
    minQty: pt.number,
    maxQty: pt.number,
    onChange: pt.func.isRequired,
    className: pt.string,
    minusClassName: pt.string,
    plusClassName: pt.string,
    isEnableMarketplace: pt.bool,
  };

  static defaultProps = {
    value: 1,
    sku: null,
  };

  handleDecrease = () =>
    this.props.onChange(
      this.props.sku,
      this.props.value - 1,
      this.props.maxQty,
      this.props.minQty,
    );
  handleIncrease = () =>
    this.props.onChange(
      this.props.sku,
      this.props.value + 1,
      this.props.maxQty,
      this.props.minQty,
    );

  render() {
    const {
      sku,
      qty,
      value,
      className,
      minusClassName,
      plusClassName,
      counterClassName,
      product,
      isEnableMarketplace,
    } = this.props;

    return (
      <div className={cx(s.root, className)}>
        <div
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.REMOVE,
            'Qty',
            '',
            sku,
          )}
          className={cx(
            s.button,
            s.minus,
            minusClassName,
            {
              [s.disabled]: value === 1,
            },
            gtmType.EVENT_TRACK_REMOVE_FROM_CART,
          )}
          onClick={this.handleDecrease}
          {...gtmAttrDataProduct(product, isEnableMarketplace)}
        >
          -
        </div>
        <div
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'Qty',
            '',
            sku,
          )}
          className={cx(s.counter, counterClassName)}
        >
          {value}
        </div>
        <div
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.ADD,
            'Qty',
            '',
            sku,
          )}
          className={cx(
            s.button,
            s.plus,
            plusClassName,
            {
              [s.disabled]: value >= qty,
            },
            gtmType.EVENT_TRACK_ADD_TO_CART,
          )}
          onClick={this.handleIncrease}
          {...gtmAttrDataProduct(product, isEnableMarketplace)}
        >
          +
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Counter);
