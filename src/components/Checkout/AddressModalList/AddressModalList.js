import React from 'react';
import { compose } from 'redux';
import { map } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import cx from 'classnames';
import CheckoutAddress from '../CheckoutAddress';
import s from './AddressModalList.scss';
import t from './translation.json';
import { explode } from '../../../utils/customAttributes';

const AddressModalList = ({
  addresses,
  activeAddress,
  onAddressClick,
  onAddressEdit,
  type,
  translate,
}) => {
  if (type && type === 'billing') {
    addresses = map(addresses, address => explode(address));
  }
  return (
    <div id="address-modal-list" className={s.root}>
      <div className={s.addressBoxList}>
        {addresses.length > 0 ? (
          map(addresses, address => (
            <div
              key={address.id}
              className={cx(s.addressBox, {
                [s.active]: activeAddress === address.id,
              })}
              onClick={() => onAddressClick(address)}
            >
              <div className={s.addressBoxInside}>
                <button
                  className={s.editBtn}
                  onClick={() => onAddressEdit(address)}
                >
                  {translate('edit')}
                </button>
                <CheckoutAddress address={address} />
              </div>
            </div>
          ))
        ) : (
          <div className={s.noAddress}>{translate('no-address')}</div>
        )}
      </div>
    </div>
  );
};

export default compose(
  withLocales(t),
  withStyles(s),
)(AddressModalList);
