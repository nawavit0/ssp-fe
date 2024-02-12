import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import IosClose from 'react-ionicons/lib/IosClose';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import Image from '../../Image';
import Input from '../../Input';
import Button from '../../Button';
import s from './GiftCard.scss';
import t from './translation.json';

class GiftCard extends React.PureComponent {
  state = {
    showApplyGiftCard: false,
  };

  inputChanged = e => {
    const {
      target: { name, checked, value, type },
    } = e;
    const val = type === 'checkbox' ? checked : value;

    this.setState({ model: { ...this.state.model, [name]: val } });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  handleSubmitRedeemPoint = event => {
    event.preventDefault();
  };

  handleDeleteRedeemPoint = () => {};

  render() {
    const { translate } = this.props;
    const { showApplyGiftCard } = this.state;

    return (
      <div className={s.giftcard}>
        <div className={s.header}>
          <div className={s.left}>
            <Image className={s.logoT1C} src="/icons/giftcard.svg" />
            <label className={s.label}>Apply gift card</label>
            <button
              className={cx(s.openT1Form, { [s.hidden]: showApplyGiftCard })}
              onClick={() => this.setState({ showApplyGiftCard: true })}
            >
              Add gift card
            </button>
          </div>
          <div className={s.right}>
            <IosClose
              className={cx(s.iconClose, { [s.hidden]: !showApplyGiftCard })}
              icon="ios-close"
              fontSize="42px"
              onClick={() => this.setState({ showApplyGiftCard: false })}
            />
          </div>
        </div>
        <div className={cx(s.content, { [s.hidden]: !showApplyGiftCard })}>
          <div className={s.formGroupLogin}>
            <form onSubmit={this.handleSubmit} method="post">
              <div className={s.formGroup}>
                <Input
                  size="huge"
                  wrapperClassName={s.promocodeWrapper}
                  className={s.promocode}
                  placeholder={translate('coupon_promo_code')}
                  value={this.state.coupon}
                  onChange={this.handleChangeValue}
                  after={
                    <Button
                      color="custom"
                      className={s.applyPromocode}
                      onClick={this.handleApplyCoupon}
                    >
                      {translate('apply')}
                    </Button>
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.the1card.loading,
});

export default compose(
  withLocales(t),
  withStyles(s),
  connect(
    mapStateToProps,
    null,
  ),
)(GiftCard);
