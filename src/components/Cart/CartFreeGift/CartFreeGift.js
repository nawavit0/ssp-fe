import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { map, get as prop } from 'lodash';
import s from './CartFreeGift.scss';
import Price from '../../Price';
import t from './translation.json';
import Service from '../../../ApiService';
// import Ionicon from 'react-ionicons';
import { withStoreConfig } from '@central-tech/core-ui';

@withStoreConfig
@withLocales(t)
@withStyles(s)
class CartFreeGift extends React.PureComponent {
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
    const { activeConfig, translate, freeItems } = this.props;
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
                {translate('free_gift_message')}
              </div>
            ) : (
              <div>
                <div className={s.header}>
                  Free Gift with this Purchase
                  {loading && (
                    <span className={s.loading}>
                      {/*<Ionicon*/}
                      {/*  icon="ios-sync"*/}
                      {/*  fontSize="16px"*/}
                      {/*  color="#aaaaaa"*/}
                      {/*  rotate*/}
                      {/*/>*/}
                      Ionicon
                    </span>
                  )}
                </div>
                {map(freeItems, item => {
                  const productDetail = prop(freeProductDetails, item.sku);
                  return (
                    productDetail && (
                      <div key={item.sku} className={s.content}>
                        <div className={s.item}>
                          <div className={s.image}>
                            <img
                              src={`${activeConfig.base_media_url}/catalog/product/${productDetail.image}`}
                              alt={productDetail.name}
                            />
                          </div>
                          <div className={s.detail}>
                            <div className={s.brand}>
                              {productDetail.brand_name_option}
                            </div>
                            <div className={s.name}>{productDetail.name}</div>
                            <div className={s.attrDetail}>
                              <div className={s.attr}>
                                {productDetail.color_option},{' '}
                                {productDetail.size_option}
                              </div>
                              <div className={s.qty}>Qty: {item.qty}</div>
                              <div className={s.price}>
                                <Price
                                  size="custom"
                                  format
                                  digit={2}
                                  price={item.original_price}
                                  freeMessage
                                />
                              </div>
                            </div>
                            <div className={s.outOfStockMessage}>
                              <OutOfStockMessage item={item} />
                            </div>
                          </div>
                        </div>
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

export default CartFreeGift;
