import React from 'react';
import cx from 'classnames';
import pt from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import IosCheckmark from 'react-ionicons/lib/IosCheckmark';
import s from './CheckoutProgressBar.scss';
import t from './translation.json';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

@withStyles(s)
@withLocales(t)
class CheckoutProgressBar extends React.PureComponent {
  static propTypes = {
    step: pt.number,
    classWrapper: pt.string,
  };

  static defaultProps = {
    step: 1,
  };

  render() {
    const { step, translate, classWrapper } = this.props;

    return (
      <div className={cx(s.wrapper, classWrapper)}>
        <div className={s.container}>
          <ul className={s.progressbar}>
            <li
              id={generateElementId(
                ELEMENT_TYPE.LIST,
                ELEMENT_ACTION.VIEW,
                'CheckoutStep',
                '',
                1,
              )}
              className={cx(s.circle, {
                [s.active]: step === 1,
                [s.complete]: step > 1,
              })}
            >
              <div className={s.number}>
                {step > 1 ? (
                  <p className={s.checkMark}>
                    <IosCheckmark
                      icon="ios-checkmark"
                      fontSize="35px"
                      color="#ffffff"
                    />
                  </p>
                ) : (
                  <p>1</p>
                )}
              </div>

              <div className={cx(s.text, s.desktop)}>
                {translate('delivery_detail')}
              </div>
              <div className={cx(s.text, s.mobile)}>
                {translate('delivery')}
              </div>
            </li>

            <li
              id={generateElementId(
                ELEMENT_TYPE.LIST,
                ELEMENT_ACTION.VIEW,
                'CheckoutStep',
                '',
                1,
              )}
              className={cx(s.line, {
                [s.active]: step === 1,
                [s.complete]: step > 1,
              })}
            />

            <li
              id={generateElementId(
                ELEMENT_TYPE.LIST,
                ELEMENT_ACTION.VIEW,
                'CheckoutStep',
                '',
                2,
              )}
              className={cx(s.circle, {
                [s.active]: step === 2,
                [s.complete]: step > 2,
              })}
            >
              <div className={s.number}>
                {step > 2 ? (
                  <p className={s.checkMark}>
                    <IosCheckmark
                      icon="ios-checkmark"
                      fontSize="35px"
                      color="#ffffff"
                    />
                  </p>
                ) : (
                  <p>2</p>
                )}
              </div>
              <div className={s.text}>{translate('payment')}</div>
            </li>

            <li
              id={generateElementId(
                ELEMENT_TYPE.LIST,
                ELEMENT_ACTION.VIEW,
                'CheckoutStep',
                '',
                2,
              )}
              className={cx(s.line, {
                [s.active]: step === 2,
                [s.complete]: step > 2,
              })}
            />

            <li
              id={generateElementId(
                ELEMENT_TYPE.LIST,
                ELEMENT_ACTION.VIEW,
                'CheckoutStep',
                '',
                3,
              )}
              className={cx(s.circle, {
                [s.complete]: step === 3,
              })}
            >
              <div className={s.number}>
                {step === 3 ? (
                  <p className={s.checkMark}>
                    <IosCheckmark
                      icon="ios-checkmark"
                      fontSize="35px"
                      color="#ffffff"
                    />
                  </p>
                ) : (
                  <p>3</p>
                )}
              </div>
              <div className={s.text}>{translate('complete')}</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default CheckoutProgressBar;
