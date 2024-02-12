import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import pt from 'prop-types';
import cx from 'classnames';
import { isEmpty, get } from 'lodash';
import s from './CheckoutAddress.scss';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';
import { convertCustomerFormatData } from '../../../utils/convertCustomerFormatData';

class CheckoutAddress extends React.PureComponent {
  static propTypes = {
    address: pt.object,
    className: pt.string,
  };

  static defaultProps = {
    address: {},
    className: '',
  };

  renderAddress = () => {
    const { address, className, emptyMessage } = this.props;
    const {
      address_line,
      address_name,
      building,
      telephone,
      firstname,
      lastname,
      region = {},
      region_name = '',
      district = '',
      subdistrict = '',
      postcode = '',
      customer_address_type,
    } = convertCustomerFormatData(address);
    const line1 = this.formatLine([address_line, building]);
    const regionValue = get(region, 'region', region || '');
    const regionName = region_name || regionValue;
    const line2 = this.formatLine([subdistrict, district]);
    const tempAddressId = get(address, 'id');
    const addressID = tempAddressId
      ? tempAddressId
      : get(address, 'address_id', null);
    return (
      <div className={cx(s.address, className)}>
        {!isEmpty(address) ? (
          <>
            <h4
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'AddressName',
                'Checkout',
                addressID,
              )}
              className={s.title}
            >
              {address_name}{' '}
              {customer_address_type === 'billing' && (
                <span className={s.fullTagInfo}>{'(Full tax info)'}</span>
              )}
            </h4>
            <div
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'AddressCustomerName',
                'Checkout',
                addressID,
              )}
              className={s.name}
            >
              {`${firstname} ${lastname}`}
            </div>
            <div
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'AddressTelephone',
                'Checkout',
                addressID,
              )}
              className={s.telephone}
            >
              {telephone}
            </div>
            <div
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'AddressLine1',
                'Checkout',
                addressID,
              )}
              className={s.address}
            >
              {line1}
            </div>
            <div
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'AddressLine2',
                'Checkout',
                addressID,
              )}
              className={s.address}
            >
              {line2}
              {`, ${regionName} ${postcode}`}
            </div>
          </>
        ) : (
          <p>{emptyMessage}</p>
        )}
      </div>
    );
  };

  formatLine(fields = []) {
    return fields.filter(value => !isEmpty(value)).join(', ');
  }

  render() {
    return (
      <div id="checkout-address" className={s.root}>
        {this.renderAddress()}
      </div>
    );
  }
}

export default withStyles(s)(CheckoutAddress);
