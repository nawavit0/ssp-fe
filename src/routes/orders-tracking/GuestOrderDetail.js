import { connect } from 'react-redux';
import { get, head, isEmpty } from 'lodash';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import { fetchOrderByIncrementId } from '../../reducers/order/actions';
// import { setPageType } from '../../reducers/googleTag/actions';
import Container from '../../components/Container/Container';
// import gtmType from '../../constants/gtmType';
import OrderDetailContainer from '../../components/OrderDetailContainer';
import withLocales from '../../utils/decorators/withLocales';
import withRoutes from '../../utils/decorators/withRoutes';

import s from './GuestOrderDetail.scss';
import t from './translation.json';

@withLocales(t)
@withStyles(s)
@withRoutes
class GuestOrderDetail extends React.PureComponent {
  componentDidMount() {
    const { fetchOrder, location } = this.props;
    const { queryParams } = location;
    // this.props.setPageType(gtmType.OTHER);
    fetchOrder(queryParams.increment_id, queryParams.customer_email);
  }

  getCustomAttr = (address, attrCode) => {
    const customAttr = get(
      address,
      'extension_attributes.custom_attributes',
      [],
    );
    return head(
      customAttr.filter(attribute => attribute.attribute_code === attrCode),
    ).value;
  };

  generateAddress(address) {
    return (
      <Fragment>
        <span>{`${
          this.getCustomAttr(address, 'building')
            ? `${this.getCustomAttr(address, 'building')},`
            : ''
        } ${
          this.getCustomAttr(address, 'address_line')
            ? `${this.getCustomAttr(address, 'address_line')},`
            : ''
        }`}</span>
        <span>
          {`${
            this.getCustomAttr(address, 'address_name')
              ? `${this.getCustomAttr(address, 'address_name')},`
              : ''
          }`}
        </span>
        <span>
          {`${
            this.getCustomAttr(address, 'subdistrict')
              ? `${this.getCustomAttr(address, 'subdistrict')},`
              : ''
          }`}
        </span>
        <span>
          {`${
            this.getCustomAttr(address, 'district')
              ? `${this.getCustomAttr(address, 'district')},`
              : ''
          }`}
        </span>
        <span>
          {`${
            this.getCustomAttr(address, 'region')
              ? this.getCustomAttr(address, 'region')
              : ''
          }`}
        </span>
        {address.postcode && <span> {address.postcode}</span>}
      </Fragment>
    );
  }

  generateBillingAddress() {
    const { translate, order } = this.props;
    const { billing_address } = order;

    return (
      <div className={s.billingInfo}>
        <p className={s.subTitle}>{translate('orderInfo.taxInfo')}</p>
        <p>{this.getCustomAttr(billing_address, 'address_name')}</p>
        <p>
          {billing_address.vat_id ? this.generateAddress(billing_address) : '-'}
        </p>
        <br />
        <p>
          {translate('orderInfo.taxId')}: {billing_address.vat_id}{' '}
        </p>
      </div>
    );
  }

  handelShowPayment = () => {
    this.setState({
      showPayment: !this.state.showPayment,
    });
  };

  handleRepayment = () => {
    const { order } = this.props;
    const payAdditionalInfo = get(order, 'payment.additional_information', '');
    const paymentMethod = get(order, 'payment.method', '');

    if (!isEmpty(payAdditionalInfo)) {
      if (paymentMethod === 'fullpaymentredirect') {
        const paymentAdditional = JSON.parse(head(payAdditionalInfo));
        if (!isEmpty(paymentAdditional)) {
          window.location.href = paymentAdditional.url;
        }
      }
    }
  };

  render() {
    return (
      <Container>
        <OrderDetailContainer {...this.props} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.locale.lang,
  order: state.order.order,
  orderFetchFailed: state.order.orderFetchFailed,
  envConfigs: state.envConfigs,
});

const matchDispatchToProps = dispatch => ({
  fetchOrder: (id, email) => dispatch(fetchOrderByIncrementId(id, email, true)),
  // setPageType: pageType => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, matchDispatchToProps)(GuestOrderDetail);
