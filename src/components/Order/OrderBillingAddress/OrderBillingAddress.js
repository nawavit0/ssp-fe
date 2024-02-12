import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './OrderBillingAddress.scss';
import t from './translation.json';

const OrderBillingAddress = ({
  translate,
  company,
  firstname,
  lastname,
  address,
  taxID,
  branchID,
}) => (
  <div className={s.root}>
    <h3 className={s.mainTitle}>{translate('full_tax_invoice_detail')}</h3>

    <div className={s.infoRow}>
      <div className={s.left}>
        {company ? (
          <p>{company}</p>
        ) : (
          <p>
            {firstname} {lastname}
          </p>
        )}
      </div>
    </div>

    <div className={s.infoRow}>
      <div className={s.left}>{address}</div>
    </div>

    {taxID && (
      <div className={s.infoRow}>
        <div className={s.left}>
          {translate('tax_id')}: {taxID}
        </div>
      </div>
    )}

    {branchID && (
      <div className={s.infoRow}>
        <div className={s.left}>
          {translate('branch_id')}: {branchID}
        </div>
      </div>
    )}
  </div>
);

export default withLocales(t)(withStyles(s)(OrderBillingAddress));
