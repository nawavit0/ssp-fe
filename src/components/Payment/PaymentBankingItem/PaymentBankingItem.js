import React from 'react';
import pt from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import cx from 'classnames';
import s from './PaymentBankingItem.scss';
import t from './translation.json';
import { setPay123 } from '../../../reducers/payment/actions';
import Image from '../../Image';

class PaymentMethodItems extends React.PureComponent {
  static propTypes = {
    type: pt.string,
    imageBank: pt.string,
    bankList: pt.string,
    bankName: pt.string,
    active: pt.string,
    onChange: pt.func,
    column: pt.string,
    installment: pt.bool,
    showImage: pt.bool,
    cod: pt.bool,
    labelClassName: pt.string,
  };

  static defaultProps = {
    showImage: true,
    installment: false,
    cod: false,
    imageBank: '',
    labelClassName: '',
  };

  checkBankList = bankList => {
    const { translate } = this.props;
    const data = {};
    let bankName = '';
    let bankLogo = '';

    if (bankList === 'BAY') {
      bankName = translate('bay');
      bankLogo = 'bank_BAY.png';
    }
    if (bankList === 'BBL') {
      bankName = translate('bbl');
      bankLogo = 'bank_BBL.png';
    }
    if (bankList === 'SCB') {
      bankName = translate('scb');
      bankLogo = 'bank_SCB.png';
    }
    if (bankList === 'KBANK') {
      bankName = translate('kbank');
      bankLogo = 'bank_KBANK.png';
    }
    if (bankList === 'KTB') {
      bankName = translate('ktb');
      bankLogo = 'bank_KTB.svg';
    }
    if (bankList === 'TMB') {
      bankName = translate('tmb');
      bankLogo = 'bank_TMB.svg';
    }
    if (bankList === 'UOB') {
      bankName = translate('uob');
      bankLogo = 'bank_UOB.svg';
    }
    if (bankList === 'TBANK') {
      bankName = translate('tbank');
      bankLogo = 'bank_TBANK.svg';
    }
    if (bankList === 'CIMB') {
      bankName = translate('cimb');
      bankLogo = 'bank_CIMB.svg';
    }
    if (bankList === 'OTHER') {
      bankName = translate('other');
      bankLogo = '';
    }
    if (bankList === 'CASH') {
      bankName = translate('cash');
      bankLogo = '';
    }
    if (bankList === 'CREDITCARD') {
      bankName = translate('creditcard');
      bankLogo = '';
    }
    if (bankList === 'OTHERBANK') {
      bankName = translate('otherBank');
      bankLogo = '';
    }

    data.bankName = bankName;
    data.bankLogo = bankLogo;
    return data;
  };

  render() {
    const {
      className,
      refID,
      imageBank,
      bankName,
      bankList,
      active,
      onChange,
      type,
      column,
      bankDesc,
      showImage,
      installment,
      cod,
      labelClassName,
    } = this.props;
    const data = this.checkBankList(bankList);

    return (
      <div
        className={cx(
          s.root,
          className,
          { [s.column]: column },
          { [s.installment]: installment },
          { [s.cod]: cod },
        )}
      >
        <label className={s.bankItem}>
          <div
            className={cx(
              s.label,
              labelClassName,
              active === bankList ? s.active : '',
            )}
          >
            <input
              type="radio"
              value={bankList}
              name={`${type}-service-group`}
              checked={active === bankList}
              onChange={() => onChange(refID, bankList)}
            />
            {showImage && (
              <Image className={s.bankLogo} width="40" src={imageBank} />
            )}

            {cod && (
              <div>
                <strong>{data.bankName}</strong> {bankDesc}
              </div>
            )}

            {installment && (
              <div className={s.descWrap}>
                <div>
                  <span>{bankName}</span>
                  {bankDesc && <p className={s.textDesc}>{bankDesc}</p>}
                </div>
                {/* <div className={s.textRight}>
                  <p>12 months</p>
                  <p>฿3,000/month</p>
                </div> */}
              </div>
            )}

            {!cod && !installment && (
              <div class={s.boxTextDescription}>
                <span>{bankName}</span>
                <p className={s.textDesc}>{bankDesc}</p>
              </div>
            )}
          </div>
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
)(PaymentMethodItems);
