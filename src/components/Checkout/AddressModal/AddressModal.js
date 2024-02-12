import { connect } from 'react-redux';
import { find, get } from 'lodash';
import { submit } from 'redux-form';
import IosArrowBack from 'react-ionicons/lib/IosArrowBack';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import AddEditAddressModal from '../AddEditAddressModal';
import AddressModalList from '../AddressModalList';
import Button from '../../Button';
import Modal from '../../Modal';
import withLocales from '../../../utils/decorators/withLocales';

import s from './AddressModal.scss';
import t from './translation.json';

import {
  getCustomerAddresses,
  getCustomerShippingAddresses,
  getCustomerBillingAddresses,
} from '../../../reducers/customer/selectors';
import addressType from '../../../constants/addressType';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

import {
  validateIdCard,
  validateTaxId,
  validateBranchId,
  validateAddressLine,
  validateTelephoneNumber,
} from '../../../utils/validations';

@withLocales(t)
@withStyles(s)
class AddressListModal extends React.PureComponent {
  state = {
    activeAddressID: null,
    activeAddress: null,
    eventType: 'list',
    editAddress: null,
    addressType: null,
  };

  static defaultProps = {
    addresses: [],
  };

  componentDidMount() {
    this.setInitialActiveAddress();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show) {
      this.setInitialActiveAddress();
    }

    if (prevProps.addressSaving && !this.props.addressSaving) {
      this.setEventType('list');
    }
  }

  setInitialActiveAddress = () => {
    const {
      activeAddress,
      type,
      customerBillingAddresses,
      customerShippingAddresses,
    } = this.props;
    const activeAddressID = activeAddress ? activeAddress.id : null;
    let initialEventType;
    if (type === addressType.BILLING) {
      initialEventType =
        customerBillingAddresses && customerBillingAddresses.length > 0
          ? 'list'
          : 'new';
    } else {
      initialEventType =
        customerShippingAddresses && customerShippingAddresses.length > 0
          ? 'list'
          : 'new';
    }
    // const initialEventType = addresses && addresses.length > 0 ? 'list' : 'new';

    this.setState({
      activeAddressID: activeAddressID,
      activeAddress: activeAddress,
      eventType: initialEventType,
      editAddress: null,
      addressType: type,
      addressInValid: false,
    });
  };

  renderModalHeader = () => {
    const { eventType } = this.state;
    const { translate } = this.props;

    switch (eventType) {
      case 'new':
        return (
          <div className={s.modalHeader}>
            <div className={s.add}>
              <button
                id={generateElementId(
                  ELEMENT_TYPE.BUTTION,
                  ELEMENT_ACTION.ADD,
                  'Address',
                  '',
                )}
                className={s.addBtn}
                onClick={() => this.setEventType('list')}
              >
                <IosArrowBack
                  icon="ios-arrow-back"
                  fontSize="16px"
                  color="#4a90e2"
                />
                {translate('address-list')}
              </button>
            </div>
            <div className={s.title}>{translate('add-shipping-title')}</div>
          </div>
        );
        break;
      case 'edit':
        return (
          <div className={s.modalHeader}>
            <div className={s.add}>
              <button
                id={generateElementId(
                  ELEMENT_TYPE.BUTTION,
                  ELEMENT_ACTION.EDIT,
                  'Address',
                  '',
                )}
                className={s.addBtn}
                onClick={() => this.setEventType('list')}
              >
                <IosArrowBack
                  icon="ios-arrow-back"
                  fontSize="16px"
                  color="#4a90e2"
                />
                {translate('address-list')}
              </button>
            </div>
            <div className={s.title}>{translate('edit-address')}</div>
          </div>
        );
        break;
      case 'list':
        const { addressType } = this.state;
        const keyAddressType = `add-${addressType}-address`;
        const keyChangeAddressType = `change-${addressType}-address`;
        return (
          <div className={s.modalHeader}>
            <div className={s.add}>
              <button
                id={generateElementId(
                  ELEMENT_TYPE.BUTTION,
                  ELEMENT_ACTION.ADD,
                  'Address',
                  '',
                )}
                className={s.addBtn}
                onClick={() => this.setEventType('new')}
              >
                {translate(keyAddressType)}
              </button>
            </div>
            <div className={s.title}>{translate(keyChangeAddressType)}</div>
          </div>
        );
        break;
    }
  };

  renderModalFooter = () => {
    const { eventType, addressInValid } = this.state;
    const { translate } = this.props;

    switch (eventType) {
      case 'new':
        return (
          <div className={s.modalFooter}>
            <div className={s.submit}>
              <Button
                id={generateElementId(
                  ELEMENT_TYPE.BUTTION,
                  ELEMENT_ACTION.ADD,
                  'Address',
                  '',
                )}
                className={s.submitBtn}
                onClick={this.props.saveCustomerAddress}
              >
                {translate('save-address')}
              </Button>
            </div>
          </div>
        );
        break;
      case 'edit':
        return (
          <div className={s.modalFooter}>
            <div className={s.submit}>
              <Button
                className={s.submitBtn}
                onClick={this.props.saveCustomerAddress}
              >
                {translate('save-address')}
              </Button>
            </div>
          </div>
        );
        break;
      case 'list':
        return (
          <div className={s.modalFooter}>
            <div className={s.submit}>
              {addressInValid && (
                <span className={s.warningText}>
                  {translate('warning-active-no-tax-id-address')}
                </span>
              )}
              <Button
                className={s.submitBtn}
                onClick={() =>
                  this.props.onSubmit(
                    this.state.activeAddress,
                    this.state.addressType,
                  )
                }
                disable={addressInValid}
              >
                {translate('use-selected-address')}
              </Button>
            </div>
          </div>
        );
        break;
    }
  };

  renderModalBody = () => {
    const { addresses } = this.props;
    const { eventType, activeAddressID, editAddress, addressType } = this.state;

    switch (eventType) {
      case 'new':
        return <AddEditAddressModal type={addressType} />;
        break;
      case 'edit':
        const activeAddr = find(addresses, obj => obj.id === activeAddressID);
        this.handleChangeActive(activeAddr);
        return <AddEditAddressModal address={editAddress} />;
        break;
      case 'list':
        return (
          <AddressModalList
            type={addressType}
            addresses={addresses}
            activeAddress={activeAddressID}
            onAddressClick={this.handleChangeActive}
            onAddressEdit={this.handleEditAddress}
          />
        );
        break;
    }
  };

  setEventType = type => {
    this.setState({
      eventType: type,
    });
  };

  billingHandleActive = address => {
    return this.setState({
      activeAddressID: address.id,
      activeAddress: address,
    });
  };

  checkingFieldValueValid = (address, type) => {
    // return true if valid
    const { custom_attributes, customer_address_type } = address;

    // check address line
    const fieldAddressLine = custom_attributes.find(
      option => option.attribute_code === 'address_line',
    );
    const fieldAddressLineValue = get(fieldAddressLine, 'value');
    if (!validateAddressLine(fieldAddressLineValue)) return false;
    if (!validateTelephoneNumber(get(address, 'telephone'))) return false;

    if (type === 'billing') {
      const vatId = get(address, 'vat_id');
      if (
        customer_address_type &&
        customer_address_type === 'billing' &&
        vatId
      ) {
        const taxType = get(address, 'full_tax_type');
        let result = false;
        if (taxType === 'personal') {
          result = validateIdCard(vatId);
        } else if (taxType === 'company') {
          result = validateTaxId(vatId);
          if (result) {
            // check address line
            const fieldBranch = custom_attributes.find(
              option => option.attribute_code === 'branch_id',
            );
            const fieldBranchId = get(fieldBranch, 'value');
            result = validateBranchId(fieldBranchId);
          }
        }
        return result;
      }
      return false;
    }
    return true;
  };

  shippingHandleActive = address => {
    this.setState({
      activeAddressID: address.id,
      activeAddress: address,
    });
  };

  handleChangeActive = address => {
    const { type } = this.props;
    type === 'billing' && this.billingHandleActive(address);
    type === 'shipping' && this.shippingHandleActive(address);
    const isValid = this.checkingFieldValueValid(address, type);
    this.setState({
      addressInValid: !isValid,
    });
  };

  handleEditAddress = address => {
    this.setEventType('edit');
    this.setState({
      editAddress: address,
    });
  };

  render() {
    const { show, onCloseClick } = this.props;

    return (
      <Modal
        classNameModal={s.root}
        show={show}
        header={this.renderModalHeader()}
        footer={this.renderModalFooter()}
        onModalClose={onCloseClick}
      >
        <div className={s.modalBody}>{this.renderModalBody()}</div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  addressSaving: state.address.saving,
  addresses: getCustomerAddresses(state),
  customerBillingAddresses: getCustomerBillingAddresses(state),
  customerShippingAddresses: getCustomerShippingAddresses(state),
});

const mapDispatchToProps = dispatch => ({
  saveCustomerAddress: () => dispatch(submit('addressForm')),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddressListModal);
