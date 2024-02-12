import 'moment-timezone';
import { connect } from 'react-redux';
import { get, isEmpty, map, find, head, orderBy } from 'lodash';
import { submit } from 'redux-form';
import cx from 'classnames';
// import IosArrowForward from 'react-ionicons/lib/IosArrowForward';
// import IosPrintOutline from 'react-ionicons/lib/IosPrintOutline';
import moment from 'moment';
import React, { Fragment } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import CheckoutProgressBar from '../../../components/CheckoutProgressBar';
import Col from '../../../components/Col';
import Row from '../../../components/Row';
import withLocales from '../../../utils/decorators/withLocales';

import s from './OrderComplete.scss';
import t from './translation.json';

// import CompleteOrder from '../../../components/CompleteOrder';
import Container from '../../../components/Container';
import { fetchOrderByIncrementId } from '../../../reducers/order/actions';
import OrderCompleteHeader from '../../../components/Order/OrderCompleteHeader';
import OrderInformation from '../../../components/Order/OrderInformation';
import OrderShippingAddress from '../../../components/Order/OrderShippingAddress';
import OrderCollector from '../../../components/Order/OrderCollector';
import OrderPickupAddress from '../../../components/Order/OrderPickupAddress';
import OrderBillingAddress from '../../../components/Order/OrderBillingAddress';
import GuestOrderCompleteRegister from '../../../components/Order/GuestOrderCompleteRegister';
import OrderItems from '../../../components/Order/OrderItems';
import OrderSummary from '../../../components/Order/OrderSummary';
import Button from '../../../components/Button';
import Price from '../../../components/Price';
import FullPageLoader from '../../../components/FullPageLoader';
import Modal from '../../../components/Modal';
import { addressStringBuilder } from '../../../utils/address';
import { explode } from '../../../utils/customAttributes';
import Service from '../../../ApiService';
import { Link } from '@central-tech/core-ui';
import ImageV2 from '../../../components/Image/ImageV2';
// import {
//   googleTagDataLayer,
//   setPageType,
// } from '../../../reducers/googleTag/actions';
// import gtmType from '../../../constants/gtmType';
import { setCookie, getCookie } from '../../../utils/cookie';

import calculateOtherDiscount from '../../../utils/calculateOtherDiscount';
@withLocales(t)
@withStyles(s)
class OrderComplete extends React.PureComponent {
  state = {
    orderDetail: {
      firstname: '',
      lastname: '',
      orderId: '',
      isGuest: false,
      email: '',
      tel: '',
    },
    orderInfo: {
      created_at: '',
      phone: '',
      method: '',
      status: '',
      t1c: '',
    },
    shippingDetail: null,
    billingDetail: null,
    orderItems: [],
    summaryData: null,
    showSummary: false,
    showCollectModal: false,
  };

  componentDidMount() {
    this.initialOrder();
    // this.props.setPageType(gtmType.ORDER_COMPLETE);
  }

  initialOrder = async () => {
    const { id } = this.props;
    const response = await this.props.fetchOrderByIncrementId(id);
    if (get(response, 'status') === 'error') {
      window.location.href = '/not-found';
    }
    const { order } = this.props;

    if (isEmpty(order)) return;

    this.initialOrderDetail();
    this.orderInfomationMapping();
    this.orderShippindMapping();
    this.orderBillingMapping();
    this.orderItemsMapping();
    this.orderSummaryMapping();
  };

  initialOrderDetail = () => {
    const { order } = this.props;

    const isGuest = order.customer_is_guest === 1;
    const customerEmail = order.customer_email;
    const orderId = order.increment_id;
    const { firstname, lastname, telephone } = order.billing_address;

    const orderDetail = {
      firstname: firstname,
      lastname: lastname,
      orderId: orderId,
      isGuest: isGuest,
      email: customerEmail,
      tel: telephone,
    };

    this.setState({
      orderDetail: orderDetail,
    });
  };

  orderInfomationMapping = () => {
    const { order, translate, lang } = this.props;
    const { shipping_assignments, order_status } = order.extension_attributes;
    const billingData = get(order, 'billing_address');

    moment.locale(lang);
    const newDateFormat =
      get(order, 'created_at', '') &&
      moment(order.created_at)
        .add(25200000, 'ms')
        .format('YYYY-MMM-DD, HH:mm');
    // const newDateFormat = moment
    //   .utc(order.created_at, 'YYYYMMDD HH:mm:ss')
    //   .clone()
    //   .tz('Asia/Bangkok')
    //   .format('YYYY-MMM-DD, HH:mm');

    const paymentMethod = order.extension_attributes.payment_method_label;
    const the1Earn = get(
      order,
      'extension_attributes.t1c_earn_card_number',
      '',
    );
    const orderStatus = translate(`order_status.${order_status}`);
    const shippingAssignment = head(shipping_assignments);
    const shippingMethod = get(shippingAssignment, 'shipping.method');
    const telephone =
      shippingMethod === 'pickupatstore_pickupatstore'
        ? billingData.telephone
        : get(shippingAssignment, 'shipping.address.telephone', '');

    const orderInfo = {
      created_at: newDateFormat,
      phone: telephone,
      method: paymentMethod,
      status: orderStatus,
      t1c: the1Earn,
    };

    this.setState({
      orderInfo: orderInfo,
    });
  };

  orderShippindMapping = () => {
    const { order } = this.props;
    const shippingData = get(
      order,
      'extension_attributes.shipping_assignments[0].shipping',
    );

    if (!shippingData) return;

    const addressData = get(shippingData, 'address');
    const addressDataExplode = {
      ...addressData,
      custom_attributes: get(
        addressData,
        'extension_attributes.custom_attributes',
        {},
      ),
    };
    const formatShippingAddress = addressStringBuilder(addressDataExplode);

    const shippingDetail = {
      method: get(order, 'extension_attributes.shipping_method_label', ''),
      methodCode: shippingData.method,
      firstname: addressData.firstname,
      lastname: addressData.lastname,
      phone: addressData.telephone,
      address: formatShippingAddress,
    };

    this.setState({
      shippingDetail: shippingDetail,
    });
  };

  orderBillingMapping = () => {
    const { order } = this.props;

    const billingData = get(order, 'billing_address');

    if (!billingData) return;

    const billingDataExplode = {
      ...billingData,
      custom_attributes: get(
        billingData,
        'extension_attributes.custom_attributes',
        {},
      ),
    };

    const billingDataExploded = explode(billingDataExplode);
    const formatAddress = addressStringBuilder(billingDataExplode);

    const billingDetail = {
      company: billingData.company,
      firstname: billingData.firstname,
      lastname: billingData.lastname,
      phone: billingData.telephone,
      address: formatAddress,
      taxID: billingDataExploded.vat_id,
      branchID: billingDataExploded.branch_id,
      full_tax_request: billingDataExploded.full_tax_request,
      full_tax_type: billingDataExploded.full_tax_type,
    };
    this.setState({
      billingDetail: billingDetail,
    });
  };

  orderItemsMapping = async () => {
    const { order } = this.props;
    const getCookieOrder = getCookie(`_Transactionid${order.increment_id}`);

    const ids = map(order.items, item => item.product_id);
    const { products = {} } = await Service.get('/search/products', {
      entity_id: ids.join(','),
      limit: 99,
      page: 1,
      priceCheck: '1',
    });
    const orderItems = map(order.items, item => ({
      ...item,
      productDetail: {
        ...find(products.products, product => product.id === item.product_id),
        base_image_url: this.props.baseMediaUrl,
      },
    }));
    if (isEmpty(getCookieOrder) || getCookieOrder !== order.increment_id) {
      // this.props.googleTagDataLayer(gtmType.ORDER_COMPLETE, orderItems);
      setCookie(`_Transactionid${order.increment_id}`, order.increment_id);
    }

    this.setState({
      orderItems: orderItems,
    });
  };

  orderSummaryMapping = () => {
    const { order } = this.props;
    const {
      coupons_applied,
      t1c_redeem,
      credit_card_on_top_discount_amount,
    } = order.extension_attributes;

    const giftWrap = get(order, 'extension_attributes.gw_id');
    let giftwarp = null;

    if (!isEmpty(giftWrap)) {
      giftwarp = get(order, 'extension_attributes.gw_price_incl_tax');
    }

    let redeemPoint = 0;
    let redeemAmount = 0;
    if (!isEmpty(t1c_redeem)) {
      redeemAmount = parseFloat(t1c_redeem.discount_amount);
      redeemPoint = t1c_redeem.points_redeem;
    }

    const otherDiscount = calculateOtherDiscount(
      order.discount_amount,
      coupons_applied,
      get(t1c_redeem, 'discount_amount', null),
      credit_card_on_top_discount_amount
        ? credit_card_on_top_discount_amount
        : null,
    );

    const summaryData = {
      sub_total: order.subtotal_incl_tax,
      grand_total: order.grand_total,
      shipping_description: order.shipping_description,
      shipping_incl_tax: order.shipping_incl_tax,
      discount_amount: order.discount_amount,
      coupons_applied: coupons_applied,
      other_discount: otherDiscount,
      creditOnTop: credit_card_on_top_discount_amount,
      giftwarp: giftwarp,
      shipping_method_label: order.extension_attributes.shipping_method_label,
      redeem: {
        redeemPoint: redeemPoint,
        redeemAmount: redeemAmount,
      },
    };

    this.setState({
      summaryData: summaryData,
    });
  };

  handleShowHideSummary = () => {
    this.setState({ showSummary: !this.state.showSummary });
  };

  renderShippingDetail = () => {
    const { shippingDetail } = this.state;

    if (
      shippingDetail &&
      shippingDetail.methodCode &&
      shippingDetail.methodCode === 'pickupatstore_pickupatstore'
    ) {
      return <OrderPickupAddress {...shippingDetail} />;
    }

    return <OrderShippingAddress {...shippingDetail} />;
  };

  handleShowModalCollect = () => {
    this.setState({
      showCollectModal: true,
    });
  };

  handleCloseClick = () => {
    this.setState({
      showCollectModal: false,
    });
  };

  renderHeaderModalOrderCollect = () => {
    const { translate } = this.props;

    return (
      <div className={s.modalHeader}>
        <div className={s.title}>{translate('confirmation')}</div>
      </div>
    );
  };

  renderContentModalOrderCollect = () => {
    const { order, translate } = this.props;
    const { telephone } = get(order, 'billing_address', {});

    return (
      <div className={s.modalBody}>
        <p className={s.bodyTitle}>{translate('collector_info_modal')}</p>
        <div className={s.bodyContent}>
          <Row className={s.body}>
            <p className={s.title}>{translate('customer_name')}:</p>
            <p
              className={s.value}
            >{`${order.customer_firstname} ${order.customer_lastname}`}</p>
          </Row>
          <Row className={s.body}>
            <p className={s.title}>{translate('customer_email')}:</p>
            <p className={s.value}>{order.customer_email}</p>
          </Row>
          {!isEmpty(telephone) && (
            <Row className={s.body}>
              <p className={s.title}>{translate('customer_tel')}:</p>
              <p className={s.value}>{telephone}</p>
            </Row>
          )}
        </div>
      </div>
    );
  };

  renderModalOrderCollect = () => {
    return (
      <Modal
        classNameModal={s.modalOrderCollect}
        classNameModalHeader={s.headerWrapper}
        classNameBTClose={s.btnClose}
        show={this.state.showCollectModal}
        header={this.renderHeaderModalOrderCollect()}
        onModalClose={this.handleCloseClick}
        closeIconSize={'40px'}
      >
        {this.renderContentModalOrderCollect()}
      </Modal>
    );
  };

  renderOrderCollector = () => {
    const { shippingDetail, orderDetail } = this.state;
    if (
      shippingDetail &&
      shippingDetail.methodCode &&
      shippingDetail.methodCode === 'pickupatstore_pickupatstore'
    ) {
      return (
        <OrderCollector
          handleShowModalCollect={this.handleShowModalCollect}
          {...orderDetail}
        />
      );
    }

    return null;
  };

  renderOrderInfo = () => {
    const { orderInfo, billingDetail } = this.state;
    const showBillingAddress = get(billingDetail, 'full_tax_request') === '1';
    return (
      <Row gutter={30} className={s.fixMobileGutter}>
        <Col className={s.marginCol} lg={4} md={12}>
          <OrderInformation
            handleShowHideSummary={this.handleShowHideSummary}
            {...orderInfo}
          />
        </Col>
        <Col className={s.marginCol} lg={4} md={12}>
          {this.renderShippingDetail()}
        </Col>
        {showBillingAddress && (
          <Fragment>
            <Col className={s.marginCol} lg={4} md={12}>
              <OrderBillingAddress {...billingDetail} />
            </Col>
          </Fragment>
        )}
      </Row>
    );
  };

  renderOrderItem = () => {
    const { orderItems } = this.state;
    const { order } = this.props;
    const isGiftWrap = get(order, 'extension_attributes.gw_id');

    return (
      <OrderItems
        items={orderBy(orderItems, 'row_total_incl_tax', 'desc')}
        giftwarp={!isEmpty(isGiftWrap)}
      />
    );
  };

  renderSummaryDesktop = () => {
    const { translate } = this.props;
    const { summaryData } = this.state;
    return (
      <React.Fragment>
        <Button className={s.printBtn} outline onClick={() => print()}>
          {/*<IosPrintOutline*/}
          {/*  className={s.icon}*/}
          {/*  icon="ios-print-outline"*/}
          {/*  fontSize="22px"*/}
          {/*  color="#333333"*/}
          {/*/>*/}
          <ImageV2
            className={s.icon}
            src="/static/icons/Printer.svg"
            width="20px"
          />
          {translate('print_order')}
        </Button>
        <OrderSummary {...summaryData} />
        <Link to="/" native>
          <Button className={s.continueShopBtn} outline>
            {translate('continue_shopping')} {/*<IosArrowForward*/}
            {/*  icon="ios-arrow-forward"*/}
            {/*  fontSize="16px"*/}
            {/*  color="#333333"*/}
            {/*/>*/}
            <ImageV2
              className={s.icon}
              src="/static/icons/ArrowRight.svg"
              width="20px"
            />
          </Button>
        </Link>
      </React.Fragment>
    );
  };

  renderSummaryMobile = () => {
    // const { translate } = this.props;
    const { summaryData } = this.state;
    return (
      <div>
        <Row gutter={30} className={s.fixMobileGutter}>
          {this.renderOrderInfo()}
        </Row>
        <Row className={s.fixMobileGutter}>
          <Col md={12}>{this.renderOrderItem()}</Col>
        </Row>
        <Row>
          <Col md={12}>
            <OrderSummary {...summaryData} />
          </Col>
        </Row>
        {/* <section className={s.last}>
          <div className={cx(s.continue, s.mobileFooter)}>
            <Link className={s.linkContinueShopBtn} onClick={() => print()}>
              <Button className={s.continueShopBtn} outline>
                <Ionicon
                  icon="ios-download-outline"
                  fontSize="28px"
                  color="#333333"
                />{' '}
                {translate('save_order')}
              </Button>
            </Link>
          </div>
        </section> */}
      </div>
    );
  };

  render() {
    const {
      translate,
      guestRegisterSubmit,
      loading,
      order,
      acceptMessageError,
    } = this.props;
    const { orderDetail } = this.state;

    return (
      <Container className={s.root}>
        <Row className={cx({ [s.hidden]: this.state.showSummary })}>
          <Col lg={12} md={12}>
            <CheckoutProgressBar classWrapper={s.progressbarWrapper} step={3} />
          </Col>
        </Row>
        <Row className={cx({ [s.hidden]: this.state.showSummary })}>
          <Col lg={9} md={12} className={s.sectionOrder}>
            <div className={s.headerCol}>
              <Row>
                <Col lg={12} className={s.printHeader}>
                  <OrderCompleteHeader {...orderDetail} />
                </Col>
              </Row>
              <hr className={s.marginLine} />
              <Row className={s.shortSummary}>
                <Col md={6}>
                  <label className={s.orderTotal}>
                    {translate('order_total')}
                  </label>
                  <Button
                    className={s.viewSummary}
                    onClick={this.handleShowHideSummary}
                  >
                    {translate('view_detail')}
                  </Button>
                </Col>
                <Col className={s.colGrandTotal} md={6}>
                  <Price
                    className={s.priceGrandTotal}
                    format
                    digit={2}
                    bold
                    price={order.grand_total}
                    size="large"
                    color="#dd0000"
                  />
                </Col>
              </Row>
            </div>
            <div className={s.mainCol}>
              {this.renderOrderCollector()}
              <div className={s.orderInfoWrapper}>{this.renderOrderInfo()}</div>
              {orderDetail && orderDetail.isGuest && (
                <Row>
                  <Col lg={12}>
                    <GuestOrderCompleteRegister
                      {...orderDetail}
                      onSubmit={guestRegisterSubmit}
                      errorMsg={acceptMessageError}
                    />
                  </Col>
                </Row>
              )}
              <Row className={s.orderItemsWrapper}>
                <Col lg={12}>{this.renderOrderItem()}</Col>
              </Row>
            </div>
          </Col>
          <Col className={s.summaryWrapper} lg={3} md={12}>
            {this.renderSummaryDesktop()}
          </Col>
          <section className={s.last}>
            <div className={cx(s.continue, s.mobileFooter)}>
              <Link className={s.linkContinueShopBtn} to="/" native>
                <Button className={s.continueShopBtn} outline>
                  {translate('continue_shopping')}
                  <ImageV2
                    className={s.icon}
                    src="/static/icons/ArrowRight.svg"
                    width="20px"
                  />
                </Button>
              </Link>
            </div>
          </section>
        </Row>
        <Row
          className={cx(s.mobileOrderInfo, {
            [s.hidden]: !this.state.showSummary,
          })}
        >
          <Col md={12}>{this.renderSummaryMobile()}</Col>
        </Row>
        <FullPageLoader show={loading} />
        {this.renderModalOrderCollect()}
      </Container>
    );
  }
}

const findMediaImageUrl = storeConfig => {
  const activeConfig = storeConfig.storeConfigs.filter(
    item => storeConfig?.activeConfig?.code === item?.code,
  );
  return activeConfig?.[0]?.base_media_url || '';
};

const mapStateToProps = state => ({
  lang: state.locale.lang,
  order: state.order.order,
  loading: state.order.loading,
  registrationErrorCause: state.auth.registrationErrorCause,
  baseMediaUrl: findMediaImageUrl(state.storeConfig),
  acceptMessageError: state?.form?.guestRegisterForm?.syncErrors?.agree || '',
});

const mapDispatchToProps = dispatch => ({
  fetchOrderByIncrementId: id => dispatch(fetchOrderByIncrementId(id)),
  guestRegisterSubmit: () => dispatch(submit('guestRegisterForm')),
  // googleTagDataLayer: (type, orderItems) =>
  //   dispatch(googleTagDataLayer(type, orderItems)),
  // setPageType: pageType => dispatch(setPageType(pageType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderComplete);
