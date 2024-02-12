import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
// import Image from '../../Image/';
import s from './OrderPickupAddress.scss';
import t from './translation.json';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const OrderPickupAddress = ({
  firstname,
  lastname,
  address,
  phone,
  translate,
}) => (
  <div className={s.rootOrderPickupAddress}>
    <h3 className={s.mainTitle}>{translate('pickup_location')}</h3>
    <div className={s.infoRow}>
      <div
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'OrderPickup',
          '',
          'name',
        )}
        className={s.locationName}
      >
        {firstname} {lastname}
      </div>
      <div
        id={generateElementId(
          ELEMENT_TYPE.INFO,
          ELEMENT_ACTION.VIEW,
          'OrderPickup',
          '',
          'address',
        )}
        className={s.locationAddress}
      >
        {address}
      </div>
    </div>

    {phone && (
      <div className={s.row}>
        <div className={s.left}>
          <span className={s.titleContact}>{translate('contact_phone')}</span>
        </div>
        <div
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'OrderPickup',
            '',
            'phone',
          )}
          className={s.right}
        >
          {phone}
        </div>
      </div>
    )}
    {/* Remove from comment: wating for api return url link */}
    {/* <button className={s.buttonDirection}>
      <Image
        className={s.getDirectionImage}
        src="/icons/get-direction-icon.png"
      />
      {translate('get_direction')}
    </button> */}
  </div>
);

export default withLocales(t)(withStyles(s)(OrderPickupAddress));
