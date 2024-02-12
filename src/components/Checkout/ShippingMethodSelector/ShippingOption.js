import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ShippingOption.scss';
import cx from 'classnames';
import { get } from 'lodash';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

/**
 * Pure render components. do nothing but render only
 * @param {[type]} props [description]
 */
const ShippingOption = props => {
  const { key, selected, shipping, onClick } = props;
  const rootCss = cx(s.option, { [s.active]: selected });
  const inputCss = cx(s.input, { [s.selected]: selected });
  const handleClick = () => onClick(shipping);

  return (
    <div
      id={generateElementId(
        ELEMENT_TYPE.RADIO,
        ELEMENT_ACTION.ADD,
        'ShippingMethod',
        '',
        get(shipping, 'method_code', null),
      )}
      key={key}
      className={rootCss}
      onClick={handleClick}
    >
      <div className={s.inputBox}>
        <input
          type="radio"
          id={key}
          name="shippingMethod"
          className={inputCss}
          checked={selected}
          readOnly
        />
      </div>
      <div className={s.title}>{shipping.method_title}</div>
      <div
        id={generateElementId(
          ELEMENT_TYPE.RADIO,
          ELEMENT_ACTION.ADD,
          'ShippingMethodFee',
          '',
          get(shipping, 'method_code', null),
        )}
        className={s.fee}
      >
        ฿{shipping.amount}
      </div>
    </div>
  );
};

export default withStyles(s)(ShippingOption);
