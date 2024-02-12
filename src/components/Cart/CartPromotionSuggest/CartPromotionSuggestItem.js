import React, { PureComponent } from 'react';
import s from './CartPromotionSuggestItem.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Line } from 'rc-progress';
import { isEmpty, get as prop } from 'lodash';
import Price from '../../Price';
import Image from '../../Image';
import Service from '../../../ApiService';
import { withStoreConfig } from '@central-tech/core-ui';

const calPercent = (total, target) => {
  const percent = (total / target) * 100;
  return percent > 100 ? 100 : percent;
};

const restPriceGetPromotion = (promo, total) =>
  total < promo.target_price ? promo.target_price - total : 0;

const replaceAbnormalDigit = num => num && num.replace('.0000', '');

const isDiscountPercent = discount => discount && discount.includes('%');

const isFreebie = promotion => promotion.promotion_condition_type === 'freebie';

@withStoreConfig
@withStyles(s)
class CartPromotionSuggestItem extends PureComponent {
  state = {};

  componentDidMount() {
    this.fetchFreebieProductDetail();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.promo !== this.props.promo &&
      prevProps.loading &&
      !this.props.loading
    ) {
      this.fetchFreebieProductDetail();
    }
  }

  fetchFreebieProductDetail = async () => {
    const { promo } = this.props;

    if (promo.promotion_condition_type === 'freebie') {
      if (isEmpty(this.state[promo.promo_sku])) {
        const { product } = await Service.get(`/products/${promo.promo_sku}`);
        this.setState({
          [product.sku]: product,
        });
      }
    }
  };

  render() {
    const { promo, activeConfig } = this.props;
    const product = prop(this.state, promo.promo_sku);

    return (
      <div className={s.root} key={promo.rule_id}>
        <div className={s.titleCon}>
          <h3 className={s.title}>
            <p>
              {/* Shop more <strong>฿ {restPriceGetPromotion(promo, total)}</strong>{' '}
              to get{' '} */}
              Shop more{' '}
              <strong className={s.inlineBlockProps}>
                <Price
                  digit={2}
                  format
                  price={restPriceGetPromotion(promo, promo.progress_value)}
                  size={'mini-tiny'}
                />
              </strong>{' '}
              to get{' '}
              <strong>
                {!isDiscountPercent(promo.discount) && !isFreebie(promo) && '฿'}
                {replaceAbnormalDigit(promo.discount)}
              </strong>{' '}
              {isFreebie(promo) ? 'Free gift' : 'discount'}
            </p>
          </h3>
        </div>
        {isFreebie(promo) && product && (
          <div className={s.freebieSection}>
            <div className={s.freebieImage}>
              <Image
                src={`${activeConfig.base_media_url}catalog/product/${product.image}`}
              />
            </div>
            <div className={s.freebieDetail}>
              <div className={s.freebieBrand}>{product.brand_name_option}</div>
              <div className={s.freebieName}>{product.name}</div>
            </div>
          </div>
        )}
        <div className={s.contentCon}>
          <div className={s.progress}>
            <Line
              percent={calPercent(promo.progress_value, promo.target_price)}
              strokeWidth={3}
              trailWidth={3}
              strokeColor="#4a90e2"
              trailColor="#efefef"
            />
          </div>
          <div className={s.progressDetail}>
            <span className={s.start}>
              <Price price={0} format size="small" />
            </span>
            <span className={s.end}>
              <Price price={promo.target_price} format size="small" />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default CartPromotionSuggestItem;
