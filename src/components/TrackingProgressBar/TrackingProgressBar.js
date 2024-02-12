import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import s from './TrackingProgressBar.scss';
import t from './translation';

@withLocales(t)
@withStyles(s)
class TrackingProgressBar extends React.PureComponent {
  static propTypes = {
    status: PropTypes.string,
    shippingMethod: PropTypes.string,
  };

  getStep() {
    const { status } = this.props;

    switch (status) {
      case 'awaiting_payment':
        return 1;
      case 'processing':
        return 2;
      case 'ready_to_ship':
        return 3;
      case 'shipping':
      case 'in_transit':
        return 4;
      case 'ready_to_collect':
        return 5;
      case 'successful':
      case 'delivered':
      case 'partial_delivered':
      case 'collected':
        return 6;
      case 'payment_fail':
      case 'canceled':
      case 'delivery_fail':
      default:
        return 0;
    }
  }

  render() {
    const { className, translate, shippingMethod } = this.props;
    const step = this.getStep();

    return (
      <div className={cx(s.wrapper, className)}>
        <div className={s.container}>
          <ul className={s.progressbar}>
            <li
              className={cx(s.circle, {
                [s.complete]: step >= 1,
              })}
            >
              {step >= 1 && <div className={s.checkMark} />}

              <div className={s.text}>
                <p className={step >= 2 && s.fontWeightBold}>
                  {translate('payment')}
                </p>
              </div>
            </li>

            <li
              className={cx(s.line, {
                [s.complete]: step > 1,
              })}
            />

            <li
              className={cx(s.circle, {
                [s.complete]: step >= 2,
              })}
            >
              {step >= 2 && <div className={s.checkMark} />}
              <div className={cx(s.text, s.textTop)}>
                <p className={step >= 2 && s.fontWeightBold}>
                  {translate('processing')}
                </p>
              </div>
            </li>

            <li
              className={cx(s.line, {
                [s.complete]: step > 2,
              })}
            />

            <li
              className={cx(s.circle, {
                [s.complete]: step >= 3,
              })}
            >
              {step >= 3 && <div className={s.checkMark} />}
              <div className={s.text}>
                <p className={step >= 2 && s.fontWeightBold}>
                  {translate('ready_to_ship')}
                </p>
              </div>
            </li>
            <li
              className={cx(s.line, {
                [s.complete]: step > 3,
              })}
            />

            <li
              className={cx(s.circle, {
                [s.complete]: step >= 4,
              })}
            >
              {step >= 4 && <div className={s.checkMark} />}
              <div className={cx(s.text, s.textTop)}>
                <p className={step >= 2 && s.fontWeightBold}>
                  {translate('shipping')}
                </p>
              </div>
            </li>
            {shippingMethod === 'pickupatstore_pickupatstore' && (
              <React.Fragment>
                <li
                  className={cx(s.line, {
                    [s.complete]: step > 4,
                  })}
                />
                <li
                  className={cx(s.circle, {
                    [s.complete]: step >= 5,
                  })}
                >
                  {step >= 5 && <div className={s.checkMark} />}
                  <div className={cx(s.text, s.textTop)}>
                    <p className={step >= 2 && s.fontWeightBold}>
                      {translate('ready_to_collect')}
                    </p>
                  </div>
                </li>
              </React.Fragment>
            )}

            <li
              className={cx(s.line, {
                [s.complete]: step > 5,
              })}
            />

            <li
              className={cx(s.circle, {
                [s.complete]: step === 6,
              })}
            >
              {step === 6 && <div className={s.checkMark} />}
              <div className={s.text}>
                <p className={step >= 2 && s.fontWeightBold}>
                  {translate('complete')}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default TrackingProgressBar;
