import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { get as prop, map, isEmpty, find, filter, head } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { get2c2pImgUrl } from '../../../utils/imgUrl';
import withLocales from '../../../utils/decorators/withLocales';
import {
  setPay123,
  setIPP,
  applyPromoCreditCardOntop,
  setPaymentInfo,
  setPaymentMethod,
  clearAllExtension,
} from '../../../reducers/payment/actions';
import { notRequiredPhone } from '../../../reducers/checkout/actions';
import s from './PaymentMethod.scss';
import t from './translation.json';
import FormInput from '../../FormInput';
import Col from '../../Col';
import Row from '../../Row';
import Image from '../../Image/Image';
import PaymentMethodItems from '../PaymentMethodItems';
import PaymentBankingItem from '../PaymentBankingItem/PaymentBankingItem';
// import Ionicon from 'react-ionicons';
import Link from '../../Link';
import gtmType from '../../../constants/gtmType';
// import { googleTagDataLayer } from '../../../reducers/googleTag/actions';
import ReactTooltip from 'react-tooltip';
import { withStoreConfig } from '@central-tech/core-ui';

const BankOther = {
  OTHER_BANK: '0',
};

@withStoreConfig
class PaymentMethod extends React.PureComponent {
  state = {
    paymentCode: '',
    // bankCode: '',
    agent_code: '',
    agent_channel: '',
    agent_type: '',
    agent_channel_list: {},
    promotionId: '',
    telephone: '',
    isDisablePayByInstallment: false,
  };

  componentDidMount() {
    const { payments, isLockCreditCard } = this.props;
    if (isLockCreditCard) {
      this.handleSetPaymentMethod(payments.payment_methods[0].code);
      this.handlerBankChange(
        null,
        payments.extension_attributes.p2c2p_credit_card_promotions[0]
          .promotion_id,
      );
    }
  }

  componentDidUpdate(prevProps) {
    const { payments, paymentMethod, extension } = this.props;
    const { telephone } = this.state;
    if (prevProps.payments !== payments) {
      this.handleIsDisablePayByInstallment();
    }

    if (
      prevProps.paymentMethod !== paymentMethod &&
      paymentMethod === 'p2c2p_123' &&
      isEmpty(extension) &&
      !isEmpty(telephone)
    ) {
      this.props.setPay123({
        customer_phone: telephone,
      });
    }
  }

  handleIsDisablePayByInstallment() {
    const { payments, paymentMethod } = this.props;
    const totalSegments = prop(payments, 'totals.total_segments', []);

    const t1c = totalSegments.find(segment => segment.code === 't1c');
    const t1cValue = JSON.parse(t1c.value[0]);
    const t1cDiscount = Number(prop(t1cValue, 'discount_amount', 0));
    const disabledMethod = t1cDiscount > 0;
    this.setState({ isDisablePayByInstallment: disabledMethod });

    if (paymentMethod === 'p2c2p_ipp' && disabledMethod) {
      this.setState({ paymentCode: '' });
      this.props.setPaymentMethod('');
    }
  }

  clearExtension = () => {
    this.setState({
      agent_code: '',
      agent_channel: '',
      agent_type: '',
      agent_channel_list: {},
    });

    this.props.notRequiredPhone();
    this.props.clearAllExtension();
  };

  fetchPhoneCustomer(paymentCode) {
    const { customer } = this.props;

    if (paymentCode === 'p2c2p_123' && !isEmpty(customer)) {
      const phone = map(
        filter(prop(customer, 'custom_attributes', []), custom => {
          return custom.attribute_code === 'phone';
        }),
        attr => {
          return attr.value;
        },
      ).toString();

      if (!isEmpty(phone) && phone.length >= 0) {
        this.setState({
          telephone: phone,
        });

        this.props.setPay123({
          customer_phone: phone,
        });
      }
    }
  }

  handleSetPaymentMethod = val => {
    const { paymentCode } = this.state;
    const { isLockCreditCard } = this.props;

    if (paymentCode !== val) {
      // if customer use coupon for credit card. don't need to set payment method again.
      if (isLockCreditCard) {
        this.props.setPaymentMethod(val);
      } else if (val) {
        this.props.setPaymentInfo(val);
      }

      this.setState({
        paymentCode: val,
        promotionId: '',
      });

      this.clearExtension();
      this.fetchPhoneCustomer(val);
    }
  };

  handleSetEwalletMethod = (method, extension) => {
    if (this.state.paymentCode !== extension) {
      this.props.setPaymentInfo(method, extension);
      this.setState({
        paymentCode: extension,
      });
    }
  };

  handlerBankChange = (index, promoCode) => {
    this.setState({
      promotionId: promoCode,
    });

    if (!isEmpty(promoCode) && promoCode) {
      this.props.applyPromoCreditCardOntop(promoCode);
    }
  };

  handleChangeAgent = agent => {
    const { payments, extension } = this.props;
    let channel;
    let filterAgent;
    if (!isEmpty(payments.extension_attributes)) {
      const extension = payments.extension_attributes;
      filterAgent = find(extension.p2c2p_payment_agents, {
        code: agent.value,
      });

      channel = !isEmpty(filterAgent.channel)
        ? filterAgent.channel.split(',')
        : [];
    }

    if (filterAgent.type !== this.state.agent_type) {
      this.props.setPay123({
        ...extension,
        apm_agent_code: agent.value,
        apm_channel_code: '',
      });
    } else {
      this.props.setPay123({
        ...extension,
        apm_agent_code: agent.value,
      });
    }

    this.setState({
      agent_code: agent.value,
      agent_type: agent.type,
      agent_channel_list: channel,
      agent_channel: '',
    });
  };

  handleChangeChannel = channel => {
    const { extension } = this.props;

    this.props.setPay123({
      ...extension,
      apm_channel_code: channel.value,
    });

    this.setState({
      agent_channel: channel.value,
    });
  };

  renderButtonPayNow = txtButton => {
    const { isDisabledButtonPayNow } = this.props;
    const buttonText = `${txtButton} >`;
    return (
      <button
        className={cx(s.button, gtmType.EVENT_CHECKOUT_STEP_THREE)}
        data-checkout-step={3}
        data-checkout-option={'Confirm order'}
        disabled={isDisabledButtonPayNow}
        onClick={() => this.props.onCheckoutClick()}
      >
        {buttonText}
      </button>
    );
  };

  inputNumberChanged = e => {
    const { extension, notRequiredPhone } = this.props;

    const {
      target: { value },
    } = e;

    const validate = /^[0-9]+$/g.test(value) || value === '';

    if (value.length >= 9) {
      notRequiredPhone();
    }

    if (validate) {
      this.setState({
        telephone: value,
      });
    }

    this.props.setPay123({
      ...extension,
      customer_phone: value,
    });
  };

  renderTab = (payment, onTop) => {
    const { translate, payments } = this.props;
    const { paymentCode, isDisablePayByInstallment } = this.state;
    let isShowLabelInstallment = false;
    const isMethodInstallment = payment.code === 'p2c2p_ipp';
    const allowTootipInstallment =
      isMethodInstallment && isDisablePayByInstallment;
    const attribute = {};
    if (isMethodInstallment) {
      attribute['data-tip'] = true;
      attribute['data-for'] = 'disable_pay_by_installment';

      // find 0% installment for show label installment
      const installmentPlans = prop(
        payments,
        'extension_attributes.p2c2p_installment_plans',
        [],
      );
      const findPlanInstallmentZeroInsert = installmentPlans.find(
        plan => Number(plan.customer_rate) === 0,
      );

      isShowLabelInstallment = findPlanInstallmentZeroInsert !== undefined;
    }

    return (
      <div
        {...attribute}
        onClick={() => this.handleSetPaymentMethod(payment.code)}
      >
        <Row>
          <Col
            className={cx(
              s.methodTitle,
              paymentCode === payment.code ? s.active : '',
            )}
            lg={6}
          >
            <Row className={s.title}>
              <label className={s.labelTab}>
                <input
                  className={s.radioMethod}
                  type="radio"
                  name="payment_methods"
                  value={payment.code}
                />
                {translate(payment.code)}
                {payment.code === 'fullpaymentredirect' && !isEmpty(onTop) && (
                  <span className={s.onTopIcon}>
                    {translate('onTopDiscount')}
                  </span>
                )}

                {isShowLabelInstallment && (
                  <span className={s.onTopIcon}>
                    {translate('label_installment')}
                  </span>
                )}
              </label>
            </Row>
          </Col>
          <Col lg={6}>
            {payment.code === 'fullpaymentredirect' && (
              <Row className={s.rowIconPay}>
                {/* <Image
              className={cx(s.iconPay, {
                [s.hidden]:
                  payment.code !== 'cashondelivery',
              })}
              src="/images/payment/cash.svg"
              height="40"
            /> */}
                <Image
                  className={s.iconPay}
                  src="/images/payment/visa.png"
                  height="40"
                />
                <Image
                  className={s.iconPay}
                  src="/images/payment/master.png"
                  height="40"
                />
                {/* <Image
              className={s.iconPay}
              src="/images/payment/jcb.png"
              height="40"
            /> */}
              </Row>
            )}
          </Col>
        </Row>
        {allowTootipInstallment && (
          <ReactTooltip
            id="disable_pay_by_installment"
            type="light"
            effect="solid"
            className={s.tooltip}
          >
            <div>{translate('tootip.pay_by_installment')}</div>
          </ReactTooltip>
        )}
      </div>
    );
  };

  render() {
    const {
      cart,
      payments,
      translate,
      requiredPhone,
      customer,
      isLockCreditCard,
    } = this.props;
    const { paymentCode, promotionId, isDisablePayByInstallment } = this.state;

    let methods;

    if (!isEmpty(filter(payments.payment_methods, { code: 'free' }))) {
      methods = filter(payments.payment_methods, { code: 'free' });
    } else {
      methods = payments.payment_methods;
    }
    let agents;
    let onTop;
    let pay2c2pMethod;
    let paymentOptions;
    if (!isEmpty(payments.extension_attributes)) {
      const extension = payments.extension_attributes;
      agents = prop(extension, 'p2c2p_payment_agents', []);
      paymentOptions = prop(extension, 'p2c2p_payment_options', []);
      onTop = prop(extension, 'p2c2p_credit_card_promotions', []);
      pay2c2pMethod = find(methods, { code: 'fullpaymentredirect' });
    }

    // if customer use coupon for credit card
    if (isLockCreditCard) {
      paymentOptions = prop(
        payments.extension_attributes,
        'p2c2p_credit_card_promotions',
      );
    }

    let shippingMethod;
    if (cart && cart.id) {
      const cartExtension = cart.extension_attributes;
      const shippingAssignment = head(
        prop(cartExtension, 'shipping_assignments', {}),
      );
      shippingMethod =
        prop(shippingAssignment, 'shipping') &&
        prop(shippingAssignment, 'shipping').method;
    }
    return (
      <div>
        {
          <div className={s.tabsWrap}>
            {!isEmpty(payments) &&
              map(methods, payment => {
                return (
                  (!isEmpty(customer) ||
                    (isEmpty(customer) &&
                      payment.code !== 'cashondelivery')) && (
                    <Col
                      className={cx(s.contentWrapper, {
                        [s.hidden]:
                          payment.code === 'cashondelivery' &&
                          shippingMethod === 'pickupatstore_pickupatstore',
                        [s.disabled]:
                          isDisablePayByInstallment &&
                          payment.code === 'p2c2p_ipp',
                      })}
                      lg={12}
                    >
                      <Row className={s.row}>
                        <Col lg={1} className={s.contentIconMethod}>
                          <PaymentMethodItems payMethod={payment} />
                        </Col>
                        <Col className={s.methodWrapper} lg={11}>
                          {this.renderTab(payment, onTop)}
                        </Col>
                      </Row>
                      {payment.code === 'fullpaymentredirect' && (
                        <div
                          className={cx(
                            s.accordionWrapper,
                            paymentCode === 'fullpaymentredirect' ? s.show : '',
                          )}
                        >
                          {!isEmpty(onTop) && (
                            <React.Fragment>
                              <p className={s.smallText}>
                                {translate('select_bank_ontop')}
                              </p>
                              <div className={s.column}>
                                {map(onTop, item => (
                                  <PaymentBankingItem
                                    type="bank"
                                    bankList={item.promotion_id}
                                    bankName={item.card_name}
                                    imageBank={get2c2pImgUrl(
                                      item.card_image,
                                      this.props.activeConfig.base_media_url,
                                    )}
                                    column
                                    bankDesc={
                                      !isEmpty(item.description) &&
                                      item.description
                                    }
                                    onChange={this.handlerBankChange}
                                    active={promotionId}
                                  />
                                ))}

                                {/* hide other bank if customer use coupon for credit card */}
                                {!isLockCreditCard && (
                                  <PaymentBankingItem
                                    type="bank"
                                    bankList={BankOther.OTHER_BANK}
                                    bankName={translate('otherBank')}
                                    onChange={this.handlerBankChange}
                                    active={promotionId}
                                    showImage={false}
                                    column
                                    labelClassName={s.otherBank}
                                  />
                                )}
                              </div>
                              <hr className={s.line} />
                            </React.Fragment>
                          )}
                          <p className={s.smallText}>
                            {translate('remark.pay2c2p')}
                          </p>
                          {this.renderButtonPayNow(translate('button_pay'))}
                        </div>
                      )}

                      {payment.code === 'cashondelivery' && (
                        <div
                          className={cx(
                            s.accordionWrapper,
                            paymentCode === 'cashondelivery' ? s.show : '',
                          )}
                        >
                          <div className={s.inner}>
                            {/* <p className={s.smallText}>
                            Select your payment option.
                          </p>
                          <PaymentBankingItem
                            type="cod"
                            bankList="CASH"
                            showImage={false}
                            onChange={this.handlerBankChange}
                            active={this.state.bankCode}
                            bankDesc="on Delivery or at Pickup Point"
                            cod
                          />
                          <PaymentBankingItem
                            type="cod"
                            bankList="CREDITCARD"
                            showImage={false}
                            onChange={this.handlerBankChange}
                            active={this.state.bankCode}
                            bankDesc="on Delivery or at Pickup Point"
                            cod
                          />
                          <p className={s.smallText}>
                            Our Delivery staff will send the item(s) right to
                            your doorstep, so you can see the item(s) first
                            before you purchase it.
                          </p>
                          <hr className={s.line} /> */}
                            {this.renderButtonPayNow('CONFIRM ORDER')}
                            <p className={s.smallText}>
                              <Link
                                className={s.link}
                                onClick={this.props.onTermsAndConditionClick}
                              >
                                <div>{translate('terms_and_conditions')}</div>
                              </Link>
                              {/* By clicking on Confirm Order, you agree and confirm
                            that you have read our Privacy Policy and Service
                            Condition */}
                            </p>
                          </div>
                        </div>
                      )}
                      {payment.code === 'p2c2p_123' && (
                        <div
                          className={cx(
                            s.accordionWrapper,
                            paymentCode === 'p2c2p_123' ? s.show : '',
                          )}
                        >
                          <div className={s.agentsWrapper}>
                            <div className={s.selectContainer}>
                              <select
                                id={`sel-agentsCode`}
                                className={s.inputField}
                                onChange={val =>
                                  this.handleChangeAgent({
                                    value: val.target.value,
                                  })
                                }
                                value={this.state.agent_code}
                              >
                                <option value="">
                                  {translate('counter_service')}
                                </option>
                                {map(agents, val => {
                                  return (
                                    <option value={val.code}>{val.code}</option>
                                  );
                                })}
                              </select>

                              <span className={s.arrowRight}>
                                {/*<Ionicon*/}
                                {/*  icon="ios-arrow-down"*/}
                                {/*  fontSize="16px"*/}
                                {/*  color="#333333"*/}
                                {/*/>*/}
                                Ionicon
                              </span>
                            </div>
                            <div className={s.selectContainer}>
                              <select
                                id={`sel-agentsChannel`}
                                className={s.inputField}
                                onChange={val =>
                                  this.handleChangeChannel({
                                    value: val.target.value,
                                  })
                                }
                                value={this.state.agent_channel}
                              >
                                <option value="">
                                  {translate('channel_pay')}
                                </option>
                                {map(this.state.agent_channel_list, val => {
                                  return <option value={val}>{val}</option>;
                                })}
                              </select>

                              <span className={s.arrowRight}>
                                {/*<Ionicon*/}
                                {/*  icon="ios-arrow-down"*/}
                                {/*  fontSize="16px"*/}
                                {/*  color="#333333"*/}
                                {/*/>*/}
                                Ionicon
                              </span>
                            </div>
                          </div>
                          <div className={s.formTelephone}>
                            <FormInput
                              className={cx({
                                [s.requiredPhone]: requiredPhone,
                              })}
                              label={translate('phone')}
                              required
                              type="text"
                              name="telephone"
                              value={this.state.telephone}
                              maxLength={10}
                              onChange={e => this.inputNumberChanged(e)}
                            />
                            {requiredPhone && (
                              <p className={s.requiredPhoneMsg}>
                                {translate('required_phone')}
                              </p>
                            )}
                          </div>
                          <p className={s.smallText}>
                            {translate('remark.pay123')}
                          </p>
                          {this.renderButtonPayNow(translate('button_pay'))}
                        </div>
                      )}
                      {payment.code === 'p2c2p_ipp' && (
                        <div
                          className={cx(
                            s.accordionWrapper,
                            paymentCode === 'p2c2p_ipp' ? s.show : '',
                          )}
                        >
                          <p className={s.smallText}>
                            {translate('remark.payIpp')}
                          </p>
                          {this.renderButtonPayNow(translate('button_pay'))}
                        </div>
                      )}
                    </Col>
                  )
                );
              })}

            {!isEmpty(paymentOptions) &&
              !isLockCreditCard &&
              map(paymentOptions, payment => {
                return (
                  <Col className={s.contentWrapper} lg={12}>
                    <Row className={s.row}>
                      <Col lg={1} className={s.contentIconMethod}>
                        <PaymentMethodItems payMethod={payment} />
                      </Col>
                      <Col className={s.methodWrapper} lg={11}>
                        <div
                          onClick={() =>
                            this.handleSetEwalletMethod(
                              pay2c2pMethod.code,
                              payment.code,
                            )
                          }
                        >
                          <Row>
                            <Col
                              className={cx(
                                s.methodTitle,
                                paymentCode === payment.code ? s.active : '',
                              )}
                              lg={12}
                            >
                              <Row className={s.title}>
                                <label className={s.labelTab}>
                                  <input
                                    className={s.radioMethod}
                                    type="radio"
                                    name="payment_methods"
                                    value={payment.code}
                                  />
                                  {payment.payment}
                                </label>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    {payment.code === 'S' && (
                      <div
                        className={cx(
                          s.accordionWrapper,
                          paymentCode === 'S' ? s.show : '',
                        )}
                      >
                        <p className={s.smallText}>
                          {translate('remark.samsung_pay')}
                        </p>
                        {this.renderButtonPayNow(translate('button_pay'))}
                      </div>
                    )}
                    {payment.code === 'N' && (
                      <div
                        className={cx(
                          s.accordionWrapper,
                          paymentCode === 'N' ? s.show : '',
                        )}
                      >
                        <p className={s.smallText}>
                          {translate('remark.line_pay')}
                        </p>
                        {this.renderButtonPayNow(translate('button_pay'))}
                      </div>
                    )}
                  </Col>
                );
              })}
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  customer: state.customer.customer,
  payments: state.payment.payment,
  paymentMethod: state.payment.paymentMethod,
  extension: state.payment.extension,
  requiredPhone: state.checkout.requiredPhone,
  the1card: state.the1card.the1card,
});

const mapDispatchToProps = dispatch => ({
  setPay123: extension => dispatch(setPay123(extension)),
  setIPP: extension => dispatch(setIPP(extension)),
  applyPromoCreditCardOntop: promoCode =>
    dispatch(applyPromoCreditCardOntop(promoCode)),
  setPaymentInfo: (paymentMethod, extension) =>
    dispatch(setPaymentInfo(paymentMethod, extension)),
  notRequiredPhone: () => dispatch(notRequiredPhone()),
  clearAllExtension: () => dispatch(clearAllExtension()),
  // googleTagDataLayer: type => dispatch(googleTagDataLayer(type)),
  setPaymentMethod: method => dispatch(setPaymentMethod(method)),
});

export default compose(
  withStyles(s),
  withLocales(t),
  connect(mapStateToProps, mapDispatchToProps),
)(PaymentMethod);
