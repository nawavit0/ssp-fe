import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import s from './AccountAddressEdit.scss';
import t from './translation.json';
import AddressForm from '../../../components/Account/AddressForm';
import Button from '../../../components/Button';
import { selectAddressByID } from '../../../reducers/customer/selectors';
import FullPageLoader from '../../../components/FullPageLoader';
import { isEmpty } from 'lodash';

@withStyles(s)
@withLocales(t)
class AccountAddressEdit extends Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.addressForm &&
      prevProps.addressForm &&
      !prevProps.addressForm.submitSucceeded &&
      this.props.addressForm.submitSucceeded
    ) {
      this.handleSubmitSuccess();
    }
  }

  handleSaveAddress = () => {
    const { regionSuggestError } = this.props;
    if (isEmpty(regionSuggestError)) {
      this.props.saveCustomerAddress();
    }
  };

  handleDiscardAddress = () => {
    const { translate } = this.props;
    if (confirm(translate('alertDiscard'))) {
      this.handleBackToAddressList();
    }
  };

  handleBackToAddressList = () => {
    window.location.href = `/${this.props.langCode}/account/address`;
  };

  handleSubmitSuccess = () => {
    const { addressError } = this.props;
    if (addressError) {
      alert(addressError);
    } else {
      this.handleBackToAddressList();
    }
  };

  render() {
    const {
      addressForm = {},
      addresses = [],
      translate,
      addressByID = '',
    } = this.props;

    return (
      <div className={s.root}>
        <div className={s.AccountHeader}>
          <h3 className={s.AccountTitle}>ADDRESS BOOK</h3>
        </div>
        {!addresses?.length && !addressByID && (
          <div className={s.noAddressText}>
            {translate('no_any_add_address')}
          </div>
        )}
        <div className={s.accountContent}>
          <h3 className={s.accountMiniTitle}>
            {!addressByID
              ? translate('add_address_title')
              : translate('edit_address_title')}
          </h3>
          <div className={s.accountForm}>
            <AddressForm address={addressByID} />
            <hr />
            <div className={s.formButton}>
              <Button className={s.submit} onClick={this.handleSaveAddress}>
                SAVE CHANGES
              </Button>
              <Button
                className={s.discard}
                outline
                onClick={this.handleDiscardAddress}
              >
                DISCARD
              </Button>
            </div>
          </div>
        </div>

        <FullPageLoader show={addressForm.submitting} />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  addressSaving: state.address.saving,
  addresses: state.customer.customer.addresses,
  langCode: state.locale.langCode,
  addressByID: selectAddressByID(state, ownProps.addressID),
  addressForm: state.form.addressForm,
  addressError: state.address.error,
  regionSuggestError: state.address.regionSuggestError,
});

const mapDispatchToProps = dispatch => ({
  saveCustomerAddress: () => dispatch(submit('addressForm')),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountAddressEdit);
