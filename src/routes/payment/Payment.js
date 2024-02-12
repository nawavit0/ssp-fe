import React, { Fragment } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { get as prop, isEmpty, find, head, isUndefined } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import t from './translation.json';
import s from './Payment.scss';
import { fetchCart } from '../../reducers/cart/actions';
import { fetchPayment, setPaymentInfo } from '../../reducers/payment/actions';
import { applyPromoCreditCardOntop } from '../../reducers/payment/actions';
import Container from '../../components/Container';
import Row from '../../components/Row';
import Col from '../../components/Col';
import FullPageLoader from '../../components/FullPageLoader';
import { createOrder, requiredPhone } from '../../reducers/checkout/actions';
import { the1CardRemovePoint } from '../../reducers/the1card/actions';
import The1CardContainer from '../../components/The1CardContainer';
import Price from '../../components/Price';
import Button from '../../components/Button';
// import GiftCard from '../../components/Payment/GiftCard';
import Block from '../../components/Block';
import CheckoutProgressBar from '../../components/CheckoutProgressBar';
import PaymentMethod from '../../components/Payment/PaymentMethod';
import OrderSummary from '../../components/Checkout/OrderSummary';
// import {
//   googleTagDataLayer,
//   setPageType,
// } from '../../reducers/googleTag/actions';
import gtmType from '../../constants/gtmType';
import Link from '../../components/Link/Link';
import Modal from '../../components/Modal';
import CMSBlocks from '../../components/CMSBlocks';

class Payment extends React.PureComponent {
  state = {
    showSummary: false,
    // loading: false,
    payMethod: '',
    showTermsConditions: false,
    isDisabledButtonPayNow: true,
  };

  componentDidMount() {
    this.initialCart();
    window.addEventListener('beforeunload', this.removeSettingCreditcard);
  }
  componentWillUnmount() {
    this.removeSettingCreditcard();
    window.removeEventListener('beforeunload', this.removeSettingCreditcard);
  }

  removeSettingCreditcard = async () => {
    const {
      payment,
      the1CardRemovePoint,
      applyPromoCreditCardOntop,
    } = this.props;

    const isLockCreditCard = prop(
      payment,
      'extension_attributes.is_payment_promotion_locked',
      false,
    );

    const creditCardOnTop = find(
      prop(payment, 'totals.total_segments'),
      total => total.code === 'credit_card_on_top',
    );
    if (!isLockCreditCard && creditCardOnTop) {
      await applyPromoCreditCardOntop(0, 'cart');
    }

    const t1c = JSON.parse(
      prop(
        find(
          prop(payment, 'totals.total_segments'),
          total => total.code === 't1c',
        ),
        'value',
      ),
    );
    if (prop(t1c, 'discount_amount')) {
      the1CardRemovePoint();
    }
  };

  componentDidUpdate(prevPros) {
    const { payment, setPaymentInfo, extension } = this.props;
    const { payMethod } = this.state;
    const paymentMethods = head(prop(payment, 'payment_methods'));

    if (
      !isEmpty(paymentMethods) &&
      paymentMethods.code === 'free' &&
      payMethod !== paymentMethods.code
    ) {
      setPaymentInfo(paymentMethods.code);

      this.setState({ payMethod: paymentMethods.code });
    }

    if (
      paymentMethods !== prevPros.paymentMethods ||
      extension !== prevPros.extension
    ) {
      this.handleisDisabledButtonPayNow();
    }
  }

  initialCart = async () => {
    await this.props.fetchCart();
    const { cart } = this.props;
    if (!cart || (cart && cart.items !== undefined && cart.items.length <= 0)) {
      return (window.location.href = '/cart');
    }
    // this.setState({ loading: true });
    this.props.fetchPayment();
  };

  handleShowHideSummary = () => {
    this.setState({
      showSummary: !this.state.showSummary,
    });
  };

  handleCreateOrder = () => {
    const {
      createOrder,
      paymentMethod,
      translate,
      extension,
      isErrorPhone,
      requiredPhone,
    } = this.props;
    // this.props.googleTagDataLayer(gtmType.EVENT_CHECKOUT_STEP_THREE);

    if (!isEmpty(paymentMethod)) {
      if (paymentMethod === 'p2c2p_123') {
        if (!isEmpty(extension.apm_agent_code)) {
          if (
            !isErrorPhone &&
            prop(extension, 'customer_phone', '').length >= 9
          ) {
            createOrder();
          } else {
            requiredPhone();
          }
        } else {
          alert(translate('msg_error_selected_agent'));
        }
      } else {
        createOrder();
      }
    } else {
      alert(translate('please_choose_payment'));
    }
  };

  handleTermsAndConditonsClick = () => {
    this.setState({
      showTermsConditions: true,
    });
  };

  handleisDisabledButtonPayNow() {
    const { paymentMethod, extension } = this.props;
    const { apm_agent_code, apm_channel_code, customer_phone } = extension;
    let result = false;
    const checkExtensionBankTransfer =
      !isEmpty(apm_agent_code) &&
      !isEmpty(apm_channel_code) &&
      !isEmpty(customer_phone) &&
      customer_phone.length > 9;

    if (
      (paymentMethod === 'p2c2p_123' && !checkExtensionBankTransfer) ||
      isEmpty(paymentMethod)
    ) {
      result = true;
    }

    this.setState({ isDisabledButtonPayNow: result });
  }

  renderStockQtyModalHeader = () => {
    const { translate } = this.props;
    return (
      <div className={s.modalHeader}>
        <div className={s.title}>{translate('modal_title')}</div>
      </div>
    );
  };

  renderT1cModalHeader = () => {
    const { translate } = this.props;
    return (
      <div className={s.modalHeader}>
        <div className={s.title}>{translate('modal_title_t1c')}</div>
      </div>
    );
  };

  renderTermsAndConditionModalHeader = () => {
    const { translate } = this.props;
    return (
      <div className={s.modalHeader}>
        <div className={s.title}>{translate('terms_and_conditions')}</div>
      </div>
    );
  };

  onCloseModal = () => {
    window.location.href = '/cart';
  };

  onCloseT1cModal = () => {
    window.location.href = '/checkout/payment';
  };

  renderStockQtyModal() {
    const { translate, checkoutError } = this.props;

    return (
      <Modal
        classNameModal={s.root}
        classNameModalHeader={s.headerWrapper}
        show={!isEmpty(checkoutError)}
        header={this.renderStockQtyModalHeader()}
        onModalClose={this.onCloseModal}
      >
        <div className={s.modalBody}>{translate('cart_message')}</div>
      </Modal>
    );
  }

  renderTermsAndConditionModal() {
    return (
      <Modal
        classNameModal={cx(s.root, s.termsAndConditions)}
        classNameModalHeader={s.headerWrapper}
        show
        header={this.renderTermsAndConditionModalHeader()}
        onModalClose={() => this.setState({ showTermsConditions: false })}
      >
        <CMSBlocks className={s.modalBody} name="terms-and-conditions" fetch />
      </Modal>
    );
  }

  renderT1cModal() {
    const { translate, checkoutError } = this.props;

    return (
      <Modal
        classNameModal={s.root}
        classNameModalHeader={s.headerWrapper}
        show={!isEmpty(checkoutError)}
        header={this.renderT1cModalHeader()}
        onModalClose={this.onCloseT1cModal}
      >
        <div className={s.modalBody}>{translate('t1c_message')}</div>
      </Modal>
    );
  }

  render() {
    const {
      translate,
      loading,
      payment,
      loadingRedeem,
      loadingOntop,
      checkoutError,
      loadingFetchPayment,
    } = this.props;

    const { isDisabledButtonPayNow } = this.state;

    const grandTotal = find(prop(payment, 'totals.total_segments'), segment => {
      return segment.code === 'grand_total';
    });

    const paymentMethod = head(prop(payment, 'payment_methods'));

    const isPaymentPromotion = prop(
      payment,
      'extension_attributes.is_payment_promotion_locked',
    );

    // when customer use coupon code for credit cart. will return true
    const isLockCreditCard = !!(
      isPaymentPromotion && isPaymentPromotion === '1'
    );

    return (
      <Fragment>
        <Container>
          {!isUndefined(checkoutError) &&
            checkoutError ===
              'Points service not available, please try again' &&
            this.renderT1cModal()}
          {!isUndefined(checkoutError) &&
            checkoutError !==
              'Points service not available, please try again' &&
            this.renderStockQtyModal()}

          {this.state.showTermsConditions &&
            this.renderTermsAndConditionModal()}
          <CheckoutProgressBar step={2} />
          <Row className={cx(s.row, s.paymentSection)}>
            <Col
              className={cx({ [s.hidden]: this.state.showSummary })}
              lg={8}
              md={12}
            >
              {!isLockCreditCard && (
                <Col lg={12}>
                  <label className={s.title}>
                    {translate('use_point_and_giftcard_title')}
                  </label>
                  <The1CardContainer />
                  {!isEmpty(paymentMethod) && paymentMethod.code === 'free' && (
                    <React.Fragment>
                      <hr />
                      <button
                        className={s.button}
                        onClick={this.handleCreateOrder}
                      >
                        {translate('pay_now')}
                      </button>
                    </React.Fragment>
                  )}
                </Col>
              )}

              {!loadingFetchPayment &&
                isEmpty(paymentMethod) &&
                !isLockCreditCard && (
                  <Col lg={12}>
                    <div className={s.textPaymentEmpty}>
                      {translate('payment_empty')}
                    </div>
                  </Col>
                )}

              {!isEmpty(paymentMethod) && paymentMethod.code !== 'free' && (
                <Col lg={12}>
                  <div className={s.titleSelectWrapper}>
                    <label className={cx(s.title, s.titleDesktop)}>
                      {translate('choose_payment_method')}
                    </label>
                    <div className={s.titleMobile}>
                      <Block
                        className={s.blockTitle}
                        clearMargin
                        title={translate('choose_payment_method')}
                      />
                    </div>
                  </div>
                  <PaymentMethod
                    isLockCreditCard={isLockCreditCard}
                    isDisabledButtonPayNow={isDisabledButtonPayNow}
                    onCheckoutClick={this.handleCreateOrder}
                    onTermsAndConditionClick={this.handleTermsAndConditonsClick}
                  />
                </Col>
              )}
            </Col>
            <Col className={s.orderSummary} lg={4} md={12}>
              <React.Fragment>
                <Col
                  className={cx(s.summary, {
                    [s.hidden]: !this.state.showSummary,
                  })}
                  lg={12}
                >
                  <OrderSummary
                    handleShowHideSummary={this.handleShowHideSummary}
                    showShipping
                  />
                </Col>
                <section
                  className={cx(s.last, { [s.hidden]: this.state.showSummary })}
                >
                  <div className={cx(s.continue, s.mobileFooter)}>
                    <div className={s.policy}>
                      {translate('textBeforePolicy')}
                      <Link to="#" className={s.link}>
                        {translate('policy')}
                      </Link>
                      {translate('and')}
                      <Link to="#" className={s.link}>
                        {translate('service')}
                      </Link>
                    </div>
                    <div className={s.boxMobileFooterSum}>
                      <div className={cx(s.left, s.sum)}>
                        <Price
                          format
                          digit={2}
                          bold
                          price={
                            prop(grandTotal, 'value') ||
                            prop(payment, 'totals.base_grand_total')
                          }
                          size="small"
                          color="gray"
                        />
                        <Button
                          className={s.viewSummary}
                          onClick={this.handleShowHideSummary}
                        >
                          {translate('view_detail')}
                        </Button>
                      </div>
                      <div className={s.right}>
                        <Button
                          className={cx(
                            s.btn,
                            gtmType.EVENT_CHECKOUT_STEP_THREE,
                          )}
                          stepCheckout={3}
                          disable={isDisabledButtonPayNow}
                          optionCheckout={'Confirm order'}
                          onClick={this.handleCreateOrder}
                        >
                          {translate('pay_now')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </React.Fragment>
            </Col>
          </Row>
          <FullPageLoader show={loading || loadingRedeem || loadingOntop} />
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.locale.lang,
  payment: state.payment.payment,
  paymentMethod: state.payment.paymentMethod,
  extension: state.payment.extension,
  loading: state.checkout.loading,
  loadingOntop: state.payment.loading,
  loadingFetchPayment: state.payment.loadingFetchPayment,
  cartInitial: state.cart.initial,
  loadingRedeem: state.the1card.redeemLoading,
  cart: state.cart.cart,
  checkoutError: state.checkout.error,
  isErrorPhone: state.checkout.requiredPhone,
  the1card: state.the1card.the1card,
});

const mapDispatchToProps = dispatch => ({
  fetchPayment: () => dispatch(fetchPayment()),
  fetchCart: () => dispatch(fetchCart()),
  createOrder: () => dispatch(createOrder()),
  // googleTagDataLayer: type => dispatch(googleTagDataLayer(type)),
  // setPageType: pageType => dispatch(setPageType(pageType)),
  requiredPhone: () => dispatch(requiredPhone()),
  setPaymentInfo: (paymentMethod, extension) =>
    dispatch(setPaymentInfo(paymentMethod, extension)),
  applyPromoCreditCardOntop: (promoCode, noRefresh) =>
    dispatch(applyPromoCreditCardOntop(promoCode, noRefresh)),
  the1CardRemovePoint: noRefresh => dispatch(the1CardRemovePoint(noRefresh)),
});

export default compose(
  withLocales(t),
  withStyles(s),
  connect(mapStateToProps, mapDispatchToProps),
)(Payment);
