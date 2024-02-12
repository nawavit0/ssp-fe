import React from 'react';
import pt from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import cx from 'classnames';
import s from './PaymentCounterService.scss';
import t from './translation.json';
import { setPay123 } from '../../../reducers/payment/actions';
import { map } from 'lodash';
import Image from '../../Image';

class PaymentCounterService extends React.PureComponent {
  static propTypes = {
    onChange: pt.func,
  };

  checkCounterList = counterItem => {
    const { translate } = this.props;
    const data = {};
    let counterName = '';
    let counterLogo = '';

    if (counterItem === 'FAMILYMART') {
      counterName = translate('familymart');
      counterLogo = 'Counter_family_mart.svg';
    }
    if (counterItem === 'TESCO') {
      counterName = translate('tesco');
      counterLogo = 'Counter_tesco.svg';
    }
    if (counterItem === 'BIGC') {
      counterName = translate('bigc');
      counterLogo = 'Counter_big_c.svg';
    }
    if (counterItem === 'MPAY') {
      counterName = translate('mpay');
      counterLogo = 'Counter_paystation.svg';
    }
    if (counterItem === 'PAYATPOST') {
      counterName = translate('payatpost');
      counterLogo = 'Counter_pay_at_post.svg';
    }
    if (counterItem === 'TRUEMONEY') {
      counterName = translate('truemoney');
      counterLogo = 'Counter_true_money.svg';
    }
    if (counterItem === 'CENPAY') {
      counterName = translate('cenpay');
      counterLogo = 'Counter_cenpay.svg';
    }

    data.counterName = counterName;
    data.counterLogo = counterLogo;

    return data;
  };

  renderCounterItem = counterList => {
    return map(counterList, counterItem => {
      const data = this.checkCounterList(counterItem.code);
      return (
        <div className={s.counterSection}>
          <div className={s.counterSectionItem}>
            <Image
              className={s.counterLogo}
              width="30"
              height="30"
              src={`/images/payment/counter-servive/${data.counterLogo}`}
            />
            <span>{data.counterName}</span>
          </div>
        </div>
      );
    });
  };

  render() {
    const { className, counterList, onChange } = this.props;
    return (
      <div className={cx(s.root, className)}>
        <label className={s.counterItemWrap}>
          <input
            type="radio"
            value="counter-service"
            name="counter-service-group"
            onChange={() => onChange('CENPAY', 'OVERTHECOUNTER')}
          />
          <div className={s.label}>{this.renderCounterItem(counterList)}</div>
        </label>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  extension: state.payment.extension,
});

const mapDispatchToProps = dispatch => ({
  setPay123: extension => dispatch(setPay123(extension)),
});

export default compose(
  withLocales(t),
  withStyles(s),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(PaymentCounterService);
