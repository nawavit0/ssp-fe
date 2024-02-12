import React from 'react';
import IosClose from 'react-ionicons/lib/IosClose';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './OrderInformation.scss';
import t from './translation.json';
import Button from '../../../components/Button';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const OrderInformation = ({
  translate,
  created_at,
  phone,
  method,
  status,
  t1c,
  handleShowHideSummary,
}) => (
  <div className={s.root}>
    <h3 className={s.mainTitle}>
      {translate('order_info')}
      <Button className={s.btnClose} onClick={handleShowHideSummary}>
        <IosClose icon="ios-close" fontSize="40px" color="#333333" />
      </Button>
    </h3>

    <div className={s.infoRow}>
      <div className={s.left}>{translate('order_date')}</div>
      <div
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'OrderInfo',
          '',
          'created_at',
        )}
        className={s.right}
      >
        {created_at}
      </div>
    </div>

    <div className={s.infoRow}>
      <div className={s.left}>{translate('payment_type')}</div>
      <div
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'OrderInfo',
          '',
          'payment_type',
        )}
        className={s.right}
      >
        {method}
      </div>
    </div>

    <div className={s.infoRow}>
      <div className={s.left}>{translate('payment_status')}</div>
      <div
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'OrderInfo',
          '',
          'payment_status',
        )}
        className={s.right}
      >
        {status}
      </div>
    </div>

    {phone && (
      <div className={s.infoRow}>
        <div className={s.left}>{translate('phone_number')}</div>
        <div
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'OrderInfo',
            '',
            'phone_number',
          )}
          className={s.right}
        >
          {phone}
        </div>
      </div>
    )}

    {t1c && (
      <div className={s.infoRow}>
        <div className={s.left}>{translate('t1_number')}</div>
        <div
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'OrderInfo',
            '',
            't1_number',
          )}
          className={s.right}
        >
          {t1c}
        </div>
      </div>
    )}
  </div>
);

export default withLocales(t)(withStyles(s)(OrderInformation));
