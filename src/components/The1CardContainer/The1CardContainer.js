import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isEmpty, floor, get as prop } from 'lodash';
import IosClose from 'react-ionicons/lib/IosClose';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import { The1CardModel } from '../../model/The1Card/The1CardModel';
import Image from '../Image';
import Button from '../Button';
import FormInput from '../FormInput';
import Input from '../Input';
import SelectDefault from '../Select/SelectDefault';
import {
  the1cardLogin,
  the1cardRedeemPoint,
  the1CardRemovePoint,
} from '../../reducers/the1card/actions';
import { getT1Redeem } from '../../reducers/payment/selectors';
import { getShippingSegment } from '../../reducers/payment/selectors';
import { getStorage } from '../../utils/localStorage';
import s from './The1CardContainer.scss';
import t from './translation.json';

class The1CardContainer extends React.PureComponent {
  state = {
    showT1C: false,
    model: new The1CardModel(),
    errorMsgT1C: '',
    points: '',
    showInputPoint: true,
    optionRedeem: 'usePoint',
    pointInvalid: {
      maxPointToRedeem: false,
      notEnoughPoint: false,
    },
    maxAllowedPoints: null,
    pointFullRedeem: null,
  };

  componentDidMount() {
    if (!isEmpty(getStorage('t1c-email'))) {
      this.setState({
        model: { ...this.state.model, ['email']: getStorage('t1c-email') },
      });
    }

    this.setState({
      maxAllowedPoints: prop(this.props.the1card, 'max_allowed_points', null),
    });
    this.handlePointFullRedeem();
    this.handleIsShowWarningPayByInstallment();
  }

  componentDidUpdate(prevProps, prevState) {
    const { the1card, cart, payment } = this.props;
    const { points, maxAllowedPoints, pointFullRedeem } = this.state;
    const pointsAsNumber = Number(points);

    if (prevProps.cart !== cart || prevProps.the1card !== the1card) {
      this.handlePointFullRedeem();
    }

    if (prevProps.the1card !== the1card) {
      this.setState({
        maxAllowedPoints: prop(the1card, 'max_allowed_points', null),
      });
    }

    if (the1card) {
      if (pointsAsNumber !== Number(prevState.points)) {
        const userPoint = the1card.points;
        if (pointsAsNumber > userPoint) {
          let redeemPoints = userPoint;
          if (pointsAsNumber > pointFullRedeem) {
            redeemPoints = pointFullRedeem;
          }

          const calculatePoint = redeemPoints % the1card.min_allowed_points;
          if (calculatePoint !== 0) {
            redeemPoints = floor(redeemPoints - calculatePoint);
          }

          this.setState(state => ({
            points: redeemPoints,
            pointInvalid: {
              ...state.pointInvalid,
              notEnoughPoint: true,
            },
          }));
        } else if (maxAllowedPoints && pointsAsNumber > maxAllowedPoints) {
          this.setState(state => ({
            points: state.maxAllowedPoints,
            pointInvalid: {
              ...state.pointInvalid,
              maxPointToRedeem: true,
            },
          }));
        }
      }
    }

    if (prevProps.payment !== payment) {
      this.handleIsShowWarningPayByInstallment();
    }
  }

  handleIsShowWarningPayByInstallment() {
    const { payment } = this.props;
    const paymentMethod = prop(payment, 'payment_methods', []);
    const hasInstallment = paymentMethod.some(
      method => method.code === 'p2c2p_ipp',
    );
    this.setState({ IsShowWarningPayByInstallment: hasInstallment });
  }

  inputChanged = e => {
    const {
      target: { name, checked, value, type },
    } = e;
    const val = type === 'checkbox' ? checked : value;

    this.setState({ model: { ...this.state.model, [name]: val } });
  };

  adjustPoints = () => {
    const { the1card } = this.props;
    const { points } = this.state;
    let redeemPoints = points;

    const calculatePoint = redeemPoints % the1card.min_allowed_points;
    if (calculatePoint !== 0) {
      redeemPoints = floor(redeemPoints - calculatePoint);
    }

    this.setState({
      points: redeemPoints,
    });
  };

  resetPointInvalide() {
    this.setState({
      pointInvalid: {
        maxPointToRedeem: false,
        notEnoughPoint: false,
      },
    });
  }

  inputPointChanged = e => {
    const {
      target: { value },
    } = e;

    const validate = /^[0-9]+$/g.test(value) || value === '';
    if (validate) {
      this.resetPointInvalide();
      this.setState({
        points: value,
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { the1cardLogin, translate } = this.props;
    const { model } = this.state;

    if (!isEmpty(model)) {
      const response = the1cardLogin(model.email, model.password);
      response.then(val => {
        if (!isEmpty(val) && val.points_used > 0) {
          this.setState({
            showT1C: false,
            errorMsgT1C: '',
            model: { ...model, ['point']: val.points_used },
          });
        } else {
          this.setState({
            errorMsgT1C: translate('errorMsgT1C'),
          });
        }
      });
    }
  };

  handleT1Change = option => {
    this.resetPointInvalide();
    if (option.key === 1) {
      this.setState({
        optionRedeem: 'usePoint',
        showInputPoint: true,
      });
    } else {
      this.setState({
        optionRedeem: 'fullRedeem',
        showInputPoint: false,
      });
    }
  };

  handleSubmitRedeemPoint = event => {
    event.preventDefault();
    const { the1cardRedeemPoint } = this.props;
    const { model } = this.state;

    if (!isEmpty(model.point)) {
      const response = the1cardRedeemPoint(model.point);
      response.then(val => {
        if (val === 'success') {
          this.setState({
            showT1C: false,
          });
        }
      });
    }
  };

  handleDeleteRedeemPoint = () => {
    const { the1CardRemovePoint } = this.props;
    const response = the1CardRemovePoint();

    response.then(val => {
      if (val === 'success') {
        this.setState({
          showT1C: true,
          model: { ...this.state.model, ['point']: 0 },
        });
      }
    });
  };

  handlePointFullRedeem() {
    const { cart, the1Redeem, shipping, the1card } = this.props;
    const shippingAmount = !isEmpty(shipping) ? shipping.value : 0;
    let t1Redeem = 0;
    const cartBaseGrandTotal = prop(cart, 'base_grand_total', null);

    if (cartBaseGrandTotal) {
      const grandTotalInclDiscountT1 =
        cart.base_grand_total +
        parseFloat(prop(the1Redeem, 'discount_amount', 0));
      t1Redeem =
        (grandTotalInclDiscountT1 - shippingAmount) * the1card.conversion_rate;
    }
    this.setState({
      pointFullRedeem: t1Redeem,
    });
  }

  handleApplyT1 = () => {
    const { the1card, the1cardRedeemPoint } = this.props;
    const { points, optionRedeem, pointFullRedeem } = this.state;
    let usePoint;
    if (optionRedeem === 'usePoint') {
      usePoint = floor(points - (points % the1card.min_allowed_points));
      if (usePoint > pointFullRedeem) {
        usePoint = pointFullRedeem;
      }
    } else if (optionRedeem === 'fullRedeem') {
      usePoint = pointFullRedeem;
    }

    this.resetPointInvalide();
    this.setState({
      points: usePoint,
    });

    if (usePoint > 0) {
      const response = the1cardRedeemPoint(usePoint);
      response.then(val => {
        if (val === 'success') {
          this.setState({
            showT1C: false,
            showInputPoint: true,
            optionRedeem: 'usePoint',
          });
        }
      });
    }
  };

  handleDisconnect = () => {
    window.location.reload();
  };

  disableButtonRedeem = () => {
    const { points, optionRedeem } = this.state;
    const { the1card } = this.props;
    if (optionRedeem !== 'fullRedeem') {
      if (points < the1card.min_allowed_points && optionRedeem === 'usePoint') {
        return true;
      }
    }
    return false;
  };

  renderT1Options = () => {
    const { maxAllowedPoints, pointFullRedeem } = this.state;
    const { translate, the1card } = this.props;
    const t1Options = [{ key: 1, value: translate('redeem_for_discount') }];

    // if maximum_allow_point not null will check if max more than t1Redeem. No add option full redeem.
    if (maxAllowedPoints && pointFullRedeem > maxAllowedPoints) {
      return t1Options;
    }

    if (pointFullRedeem <= the1card.points) {
      t1Options.push({
        key: 2,
        value: translate('redeem_pay_full_amount', {
          points: (+pointFullRedeem).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
        }),
      });
    }
    return t1Options;
  };

  render() {
    const { the1card, loading, translate } = this.props;
    const {
      showT1C,
      model,
      errorMsgT1C,
      showInputPoint,
      maxAllowedPoints,
      pointInvalid,
      IsShowWarningPayByInstallment,
    } = this.state;

    // if dosen't have key max_allowed_points it mean unlimit point to use
    let textMaximumPointToRedeem = 0;
    if (maxAllowedPoints) {
      textMaximumPointToRedeem = (+maxAllowedPoints).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }

    const inputPointInvalid = Object.keys(pointInvalid).find(
      key => pointInvalid[key] === true,
    );

    return (
      <div className={s.t1c}>
        <div className={cx(s.header, s.bgT1c)}>
          <div className={s.left}>
            <Image className={s.logoT1C} src="/icons/t-1-c-logo.svg" />
            <div className={s.headerT1Wrapper}>
              <label className={s.labelTitle}>{`${
                !isEmpty(the1card)
                  ? `${translate('title')}:`
                  : translate('connect_t1_title')
              }`}</label>
              {!isEmpty(the1card) && showT1C && (
                <Button
                  id={`btn-disconnect-t1`}
                  color="custom"
                  className={s.disconnectT1}
                  onClick={this.handleDisconnect}
                >
                  {translate('disconnect_t1')}
                </Button>
              )}
              {!isEmpty(the1card) && !showT1C ? (
                <div className={s.statusT1C}>
                  <label className={s.label}>
                    {translate('current_points', {
                      number: (+the1card.points || 0).toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }),
                    })}
                  </label>
                </div>
              ) : (
                ''
              )}
              <button
                className={cx(
                  s.openT1Form,
                  { [s.hidden]: showT1C },
                  { [s.redeem]: !isEmpty(the1card) },
                )}
                onClick={() => this.setState({ showT1C: true })}
              >
                {!isEmpty(the1card)
                  ? translate('redeem_t1')
                  : translate('connect_t1_account')}
              </button>
            </div>
          </div>
          <div className={s.right}>
            <IosClose
              className={cx(s.iconClose, { [s.hidden]: !showT1C })}
              icon="ios-close"
              fontSize="42px"
              onClick={() => this.setState({ showT1C: false })}
            />
          </div>
        </div>
        <div className={cx(s.content, { [s.hidden]: !showT1C })}>
          {isEmpty(the1card) ? (
            <div className={s.formGroupLogin}>
              <label className={s.loginToYourT1}>
                {translate('login_to_your_t1')}
              </label>
              <label className={s.error}>{errorMsgT1C}</label>
              <form onSubmit={this.handleSubmit} method="post">
                <div className={s.formGroup}>
                  <FormInput
                    label={translate('email')}
                    required
                    type="email"
                    name="email"
                    value={model.email}
                    onChange={e => this.inputChanged(e)}
                  />
                </div>
                <div className={s.formGroup}>
                  <FormInput
                    label={translate('password')}
                    required
                    type="password"
                    name="password"
                    value={model.password}
                    onChange={e => this.inputChanged(e)}
                  />
                </div>
                <a
                  className={s.forgotPassword}
                  href="https://auth.the-1-card.com/forget_password?lang=th"
                >
                  {translate('forgot_password')}
                </a>
                <button
                  className={s.connectT1CButton}
                  type="submit"
                  disabled={loading}
                >
                  {loading && translate('loading')}
                  {!loading && translate('connect_t1c_button')}
                </button>
              </form>
            </div>
          ) : (
            <div className={s.formGroupT1CPoint}>
              <label className={s.formTitle}>
                {translate('current_points', {
                  number: (+the1card.points || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }),
                })}
              </label>

              <div className={s.the1OptionWrapper}>
                <SelectDefault
                  id={`sel-the1Option`}
                  className={cx(s.the1Options)}
                  value={1}
                  height="large"
                  options={this.renderT1Options()}
                  onChange={this.handleT1Change}
                />
                {showInputPoint && (
                  <div
                    className={cx(s.inputPointsWrapper, {
                      [s.inputInvalid]: inputPointInvalid,
                    })}
                  >
                    <Input
                      className={cx(s.inputPoints)}
                      type="text"
                      name="point"
                      size="large"
                      placeholder={translate('placeholder')}
                      value={String(this.state.points)}
                      onChange={e => this.inputPointChanged(e)}
                      onBlur={this.adjustPoints}
                    />
                    <label className={s.labelPoints}>
                      {translate('points')}
                    </label>
                  </div>
                )}
              </div>

              {inputPointInvalid && (
                <div className={s.alertInputPointInvalid}>
                  {pointInvalid.maxPointToRedeem ? (
                    <React.Fragment>
                      {translate('invalid_max_point_redeem', {
                        maxPoint: textMaximumPointToRedeem,
                      })}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {translate('invalid_not_enough_point', {
                        point: (+the1card.points || 0).toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }),
                      })}
                    </React.Fragment>
                  )}
                </div>
              )}
              <div className={s.remarkText}>
                <div>
                  {translate('min_point_redeem', {
                    minPoint: prop(the1card, 'min_allowed_points', 0),
                    targetPoint: Math.floor(
                      prop(the1card, 'min_allowed_points', 0) /
                        prop(the1card, 'conversion_rate', 0),
                    ),
                  })}
                </div>
                {maxAllowedPoints && (
                  <div>
                    {translate('max_point_redeem', {
                      maxPoint: textMaximumPointToRedeem,
                    })}
                  </div>
                )}
                {IsShowWarningPayByInstallment && (
                  <div>{translate('warning_pay_by_installment')}</div>
                )}
              </div>

              <div className={s.the1ButtonWrapper}>
                <Button
                  id={`btn-addRedeemPoint-t1`}
                  color="custom"
                  className={s.applyT1}
                  onClick={this.handleApplyT1}
                  disable={this.disableButtonRedeem()}
                >
                  {translate('apply')}
                </Button>

                <Button
                  id={`btn-disconnect-t1`}
                  color="custom"
                  className={s.disconnectT1}
                  onClick={() => this.props.the1CardRemovePoint()}
                >
                  {translate('disconnect_t1')}
                </Button>
              </div>

              {/* <form onSubmit={this.handleSubmitRedeemPoint} method="post">
                <div className={s.formInput}>
                  <Input
                    type="number"
                    name="point"
                    value={model.point}
                    onChange={e => this.inputChanged(e)}
                  />
                  <label className={s.labelAs}>=</label>
                  <Input
                    type="text"
                    name="baht"
                    readonly
                    value={`฿ ${(model.point || 0) / the1card.conversion_rate}`}
                    onChange={e => this.inputChanged(e)}
                  />
                  <input
                    className={s.useT1CPointButton}
                    type="submit"
                    value="ใช้คะแนน"
                  />
                </div>
              </form> */}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  payment: state.payment.payment,
  the1card: state.the1card.the1card,
  loading: state.the1card.loading,
  cart: state.cart.cart,
  shipping: getShippingSegment(state),
  the1Redeem: getT1Redeem(state),
});

const mapDispatchToProps = dispatch => ({
  the1cardLogin: (email, password) => dispatch(the1cardLogin(email, password)),
  the1cardRedeemPoint: points => dispatch(the1cardRedeemPoint(points)),
  the1CardRemovePoint: () => dispatch(the1CardRemovePoint()),
});

export default compose(
  withLocales(t),
  withStyles(s),
  connect(mapStateToProps, mapDispatchToProps),
)(The1CardContainer);
