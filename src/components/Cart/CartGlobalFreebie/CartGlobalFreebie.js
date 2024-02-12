import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { map, get as prop } from 'lodash';
import s from './CartGlobalFreebie.scss';
import CartItem from '../../CartItem';
import t from './translation.json';
import Service from '../../../ApiService';
import IosSync from 'react-ionicons/lib/IosSync';

@withLocales(t)
@withStyles(s)
class CartGlobalFreebie extends React.PureComponent {
  state = {
    show: false,
    freeProductDetails: null,
    loading: false,
  };

  showFreebieItem = async () => {
    this.setState({ show: true });
    this.fetchFreeItemDetail();
  };

  fetchFreeItemDetail = async () => {
    const { freeItems } = this.props;
    const productDetail = {};

    this.setState({ loading: true });

    await Promise.all(
      map(freeItems, async item => {
        const { product } = await Service.get(`/products/${item.sku}`);
        productDetail[product.sku] = product;
      }),
    );

    this.setState({
      loading: false,
      freeProductDetails: productDetail,
    });
  };

  render() {
    const { translate, freeItems } = this.props;
    const { freeProductDetails, loading } = this.state;

    const OutOfStockMessage = ({ item }) => (
      <React.Fragment>
        {item.intent_qty > item.qty && (
          <React.Fragment>
            {item.qty !== 0 ? (
              <div className={s.outOfStockMessage}>
                {translate('not_correct_stock')}
              </div>
            ) : (
              <div className={s.outOfStockMessage}>
                {translate('out_of_stock')}
              </div>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );

    return (
      <div>
        {freeItems && (
          <div className={s.rootCartFreeGift}>
            {!this.state.show ? (
              <div className={s.freeMsg} onClick={this.showFreebieItem}>
                <span className={s.icon}>
                  <img src="/icons/ic-gift-red.svg" alt="free gift icon" />
                </span>
                {translate('free_gift_message')}
              </div>
            ) : (
              <div className={s.freeItems}>
                <div className={s.freeItemsTitle}>
                  {translate('free_title')}
                  {loading && (
                    <span className={s.loading}>
                      <IosSync
                        icon="ios-sync"
                        fontSize="20px"
                        color="#aaaaaa"
                        rotate
                      />
                    </span>
                  )}
                </div>
                {map(freeItems, item => {
                  const productDetail = prop(freeProductDetails, item.sku);
                  const itemData = {
                    ...productDetail,
                    qty: item.qty,
                    price: item.price,
                  };
                  return (
                    productDetail && (
                      <div className={s.freebieItemContainer} key={item.sku}>
                        <CartItem item={itemData} disabled isFreegift />
                        <OutOfStockMessage item={item} />
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default CartGlobalFreebie;
