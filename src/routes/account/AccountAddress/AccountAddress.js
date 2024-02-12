import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AccountAddress.scss';
import t from './translation.json';
import withLocales from '../../../utils/decorators/withLocales';
import { connect } from 'react-redux';
import { map } from 'lodash';
import cx from 'classnames';
import CheckoutAddress from '../../../components/Checkout/CheckoutAddress';
import FullPageLoader from '../../../components/FullPageLoader';
import IosMore from 'react-ionicons/lib/IosMore';
import IosAddCircleOutline from 'react-ionicons/lib/IosAddCircleOutline';
import Link from '../../../components/Link';
import { deleteAddress } from '../../../reducers/address/actions';
import { explode } from '../../../utils/customAttributes';
import addressType from '../../../constants/addressType';
import { saveAddress } from '../../../reducers/address/actions';
import { convertCustomerFormatData } from '../../../utils/convertCustomerFormatData';
@withStyles(s)
@withLocales(t)
class AccountAddress extends PureComponent {
  state = {
    showMore: false,
  };

  onAddressEdit = () => {};

  handleShowEditBox = addressID => {
    let showMoreAddID = addressID;

    if (addressID === this.state.showMore) {
      showMoreAddID = false;
    }

    this.setState({
      showMore: showMoreAddID,
    });
  };

  handleDeleteAddress = addressId => {
    const { translate } = this.props;
    if (confirm(translate('alertDel'))) {
      this.props.deleteAddress(addressId);
    }
  };

  setDefaultBilling = address => {
    if (
      address.customer_address_type !== addressType.BILLING ||
      address.default_billing
    ) {
      return;
    }

    const addressData = {
      ...address,
      default_billing: true,
    };

    this.props.saveAddress(addressData);
  };

  setDefaultShipping = address => {
    if (address.default_shipping) {
      return;
    }

    const addressData = {
      ...address,
      default_shipping: true,
    };

    this.props.saveAddress(addressData);
  };

  render() {
    const { addresses, translate, addressSaving, isMobile } = this.props;
    const addressesExplode = explode(addresses);
    const iconPlusSize = isMobile ? '34px' : '60px';

    return (
      <div className={s.root}>
        <div className={s.AccountHeader}>
          <h3 className={s.AccountTitle}>{translate('title')}</h3>
          <div className={s.addNewAddBtn}>
            <Link to="/account/address/new">+ {translate('add_address')}</Link>
          </div>
        </div>
        <div className={s.accountAddressList}>
          <div className={s.accountAddressList}>
            {map(addressesExplode, address => {
              address = convertCustomerFormatData(address);

              return (
                <div key={address.id} className={cx(s.addressBox)}>
                  <div className={s.addressBoxInside}>
                    <div className={s.moreBtn}>
                      <IosMore
                        icon="ios-more"
                        fontSize="30px"
                        color="#333"
                        onClick={() => this.handleShowEditBox(address.id)}
                      />
                      <div
                        className={cx(s.moreMenu, {
                          [s.show]: this.state.showMore === address.id,
                        })}
                      >
                        <div className={s.moreItem}>
                          <Link to={`/account/address/edit/${address.id}`}>
                            {translate('edit')}
                          </Link>
                        </div>
                        <div
                          className={cx(s.moreItem, s.deleteBtn)}
                          onClick={() => this.handleDeleteAddress(address.id)}
                        >
                          {translate('delete')}
                        </div>
                      </div>
                    </div>
                    <CheckoutAddress address={address} />
                    <div className={s.defaultSection}>
                      <div
                        className={s.defaultItem}
                        onClick={() => this.setDefaultShipping(address)}
                      >
                        <span>
                          <div
                            className={cx(s.curcle, {
                              [s.active]: address.default_shipping,
                            })}
                          />
                        </span>
                        <span>{translate('default_shipping')}</span>
                      </div>
                      <div
                        className={cx(s.defaultItem, {
                          [s.disable]:
                            address.customer_address_type !==
                            addressType.BILLING,
                        })}
                        onClick={() => this.setDefaultBilling(address)}
                      >
                        <span>
                          <div
                            className={cx(s.curcle, {
                              [s.active]: address.default_billing,
                            })}
                          />
                        </span>
                        <span>{translate('default_billing')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className={cx(s.addressBox)}>
              <Link
                className={cx(s.addressBoxInside, s.addNewAddressColumn)}
                to="/account/address/new"
              >
                {!addressesExplode?.length && (
                  <p>{translate('no_any_add_address')}</p>
                )}
                <div className={s.addNewAddressText}>
                  {translate('add_address').toUpperCase()}
                </div>
                <div className={s.addNewAddressIcon}>
                  <IosAddCircleOutline
                    icon="ios-add-circle-outline"
                    fontSize={iconPlusSize}
                    color="#cccccc"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <FullPageLoader show={addressSaving} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addresses: state.customer.customer.addresses,
  addressSaving: state.address.saving,
});

const mapDispatchToProps = dispatch => ({
  deleteAddress: address => dispatch(deleteAddress(address)),
  saveAddress: address => dispatch(saveAddress(address)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountAddress);
