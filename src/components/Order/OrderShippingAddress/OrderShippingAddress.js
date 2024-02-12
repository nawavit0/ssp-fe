import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './OrderShippingAddress.scss';
import t from './translation.json';

const OrderShippingAddress = ({
  translate,
  method,
  firstname,
  lastname,
  address,
  phone,
}) => (
  <div className={s.root}>
    <h3 className={s.mainTitle}>{translate('shipping_detail')}</h3>

    <div className={s.infoRow}>
      <div className={s.left}>{method}</div>
    </div>

    <div className={s.infoRow}>
      <div className={s.left}>
        {firstname} {lastname}
      </div>
      <div className={s.left}>{address}</div>
    </div>

    {phone && (
      <div className={s.infoRow}>
        <div className={s.left}>
          {translate('call')} {phone}
        </div>
      </div>
    )}
  </div>
);

export default withLocales(t)(withStyles(s)(OrderShippingAddress));
