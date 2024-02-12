import React from 'react';
import { isEmpty, get as prop } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import s from './OrderSummary.scss';
import t from './translation.json';
import cx from 'classnames';
import Price from '../../Price';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const OrderSummary = ({
  translate,
  sub_total,
  grand_total,
  shipping_method_label,
  shipping_incl_tax,
  giftwarp,
  coupons_applied,
  redeem,
  other_discount,
  creditOnTop,
}) => (
  <div className={s.root}>
    <div className={s.header}>{translate('payment_summary')}</div>
    <div className={s.content}>
      <div className={s.row}>
        <div className={s.item}>
          <div className={s.topic}>{translate('total')}</div>
          <div className={cx(s.value, s.strong)}>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'Price',
                '',
                'sub_total',
              )}
              price={sub_total}
              format
            />
          </div>
        </div>
      </div>
      <div className={s.row}>
        {!isEmpty(coupons_applied) && (
          <React.Fragment>
            <div className={s.item}>
              <div className={s.topic}>{translate('promo_code')}</div>
            </div>
            {coupons_applied.map((val, index) => {
              return (
                <div className={s.item} key={index}>
                  <div className={s.title}>{val.coupon_code}</div>
                  <Price
                    id={generateElementId(
                      ELEMENT_TYPE.INFO,
                      ELEMENT_ACTION.VIEW,
                      'PricePromoCode',
                      '',
                      prop(val, 'coupon_code', null),
                    )}
                    format
                    digit={2}
                    size="small"
                    color="red"
                    price={val.discount_amount}
                    isDiscount
                  />
                </div>
              );
            })}
          </React.Fragment>
        )}
        {other_discount !== 0 && (
          <div className={s.item}>
            <div className={s.title}>{translate('other_discount')}</div>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceDiscount',
                '',
                'other',
              )}
              format
              digit={2}
              size="small"
              color="red"
              price={other_discount}
              isDiscount
            />
          </div>
        )}

        {creditOnTop > 0 && (
          <div className={s.item}>
            <div className={s.topic}>{translate('credit_ontop')}</div>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceDiscount',
                '',
                'credit_ontop',
              )}
              format
              digit={2}
              size="small"
              color="red"
              price={creditOnTop}
              isDiscount
            />
          </div>
        )}
      </div>

      {giftwarp && (
        <div className={s.row}>
          <div className={s.item}>
            <div className={s.topic}>{translate('gift_options')}</div>
          </div>
          <div className={s.item}>
            <div className={s.title}>Gift Wrapping fee</div>
            <div className={cx(s.value)}>
              <Price
                id={generateElementId(
                  ELEMENT_TYPE.INFO,
                  ELEMENT_ACTION.VIEW,
                  'PriceDiscount',
                  '',
                  'gift_wrapping_fee',
                )}
                price={giftwarp}
                format
                digit={2}
                freeMessage
              />
            </div>
          </div>
        </div>
      )}

      {!isEmpty(redeem) && redeem.redeemPoint > 0 && (
        <div className={s.row}>
          <div className={s.item}>
            <div className={s.topic}>{translate('the1_redeem')}</div>
          </div>
          <div className={s.item}>
            <div className={s.title}>
              {translate('redeem_t1', { point: redeem.redeemPoint })}
            </div>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'PriceDiscount',
                '',
                'the1_redeem',
              )}
              format
              digit={2}
              size="small"
              color="red"
              price={redeem.redeemAmount}
              isDiscount
            />
          </div>
        </div>
      )}

      <div className={s.row}>
        <div className={s.item}>
          <div className={s.topic}>{translate('delivery')}</div>
        </div>
        <div className={s.item}>
          <div className={s.title}>{shipping_method_label}</div>
          <div className={cx(s.value)}>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'Price',
                '',
                'delivery',
              )}
              price={shipping_incl_tax}
              format
              digit={2}
              freeMessage
              size="small"
            />
          </div>
        </div>
      </div>

      <hr />

      <div className={s.row}>
        <div className={s.item}>
          <div className={cx(s.topic, s.big)}>{translate('netTotal')}</div>
          <div className={cx(s.value, s.big, s.strong)}>
            <Price
              id={generateElementId(
                ELEMENT_TYPE.INFO,
                ELEMENT_ACTION.VIEW,
                'Price',
                '',
                'grand_total',
              )}
              price={grand_total}
              format
              digit={2}
              size="x-large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default withLocales(t)(withStyles(s)(OrderSummary));
