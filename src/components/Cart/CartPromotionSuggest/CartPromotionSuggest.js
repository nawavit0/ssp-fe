import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CartPromotionSuggest.scss';
import { map, slice } from 'lodash';
import CartPromotionSuggestItem from './CartPromotionSuggestItem';

@withStyles(s)
class CartPromotionSuggest extends PureComponent {
  render() {
    const { promotions, loading, total } = this.props;
    return (
      <div className={s.rootPromotionSuggest}>
        {promotions &&
          map(slice(promotions, 0, 2), promo => (
            <CartPromotionSuggestItem
              key={promo.rule_id}
              promo={promo}
              total={total}
              loading={loading}
            />
          ))}
      </div>
    );
  }
}

export default CartPromotionSuggest;
