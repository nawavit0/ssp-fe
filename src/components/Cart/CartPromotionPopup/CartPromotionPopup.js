import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { map } from 'lodash';
import s from './CartPromotionPopup.scss';
import t from './translation.json';
import cx from 'classnames';
import pt from 'prop-types';
import Modal from '../../Modal/Modal';

@withStyles(s)
@withLocales(t)
class CartPromotionPopup extends React.PureComponent {
  state = {
    openPopup: false,
  };

  static propTypes = {
    promoDiscounts: pt.array.isRequired,
  };

  changePopupStatus = () => {
    const { openPopup } = this.state;
    this.setState({
      openPopup: !openPopup,
    });
  };

  render() {
    const { promoDiscounts, translate } = this.props;
    const { openPopup } = this.state;
    return (
      <div className={s.root}>
        <span
          className={cx(s.pointer, s.underline)}
          onClick={this.changePopupStatus}
        >
          {translate('view_promo')}
        </span>
        <Modal
          show={openPopup}
          header={translate('modal_title')}
          onModalClose={this.changePopupStatus}
          classNameModal={s.popup}
          classNameModalHeader={s.title}
          className={s.mobileModal}
        >
          <table className={s.promos}>
            <thead>
              <tr>
                <th>
                  <div className={s.underline}>{translate('campaigns')}</div>
                </th>
                <th>
                  <div className={cx(s.underline, s.alignRight)}>
                    {translate('coupon_code')}
                  </div>
                </th>
              </tr>
            </thead>
          </table>
          <div className={s.promoContainer}>
            <table className={s.promos}>
              <tbody>
                {promoDiscounts &&
                  map(promoDiscounts, promo => {
                    if (promo && promo.coupon && promo.coupon.length > 0) {
                      return (
                        <tr key={promo.coupon}>
                          <td>
                            <div>{promo.short_description}</div>
                          </td>
                          <td>
                            <div>{promo.coupon}</div>
                          </td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    );
  }
}

export default CartPromotionPopup;
