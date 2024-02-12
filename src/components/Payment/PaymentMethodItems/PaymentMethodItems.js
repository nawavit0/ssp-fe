import React from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './PaymentMethodItems.scss';
import t from './translation.json';
import Image from '../../Image';

class PaymentMethodItems extends React.PureComponent {
  static propTypes = {
    payMethod: pt.string,
  };

  checkPaymentMethod = payMethod => {
    const data = {};
    let image = '';
    if (payMethod === 'centralpayment') {
      image = 'centralcard.png';
    }
    if (payMethod === 'fullpaymentredirect') {
      image = 'credit-card.svg';
    }
    if (payMethod === 'cashondelivery') {
      image = 'pod.svg';
    }
    if (payMethod === 'p2c2p_ipp') {
      image = 'installment-pay.svg';
    }
    if (payMethod === 'p2c2p_123') {
      image = 'bank-transfer.svg';
    }
    if (payMethod === 'transfer') {
      image = 'bank-transfer.svg';
    }
    if (payMethod === 'S') {
      image = 'samsung-pay.png';
    }
    if (payMethod === 'N') {
      image = 'linepay.png';
    }
    if (payMethod === 'free') {
      image = 'the1card.png';
    }

    data.image = image;

    return data;
  };

  render() {
    const { payMethod } = this.props;
    let data;
    if (!isEmpty(payMethod)) {
      data = this.checkPaymentMethod(payMethod.code);
    }

    return (
      <Image
        className={cx(
          s.paymentImg,
          { [s.samsung]: payMethod.code === 'S' },
          { [s.line]: payMethod.code === 'N' },
        )}
        src={`/images/payment/${data.image}`}
      />
    );
  }
}

export default compose(
  withLocales(t),
  withStyles(s),
)(PaymentMethodItems);
