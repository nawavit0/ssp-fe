import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AddEditAddressModal.scss';
import AddressFormCds from '../../Account/AddressForm/AddressFormCDS';

const AddEditAddressModal = ({ address, type }) => (
  <div id="add-edit-address" className={s.root}>
    <div className={s.addressContainer}>
      <AddressFormCds address={address} isBilling={type === 'billing'} />
    </div>
  </div>
);

export default withStyles(s)(AddEditAddressModal);
