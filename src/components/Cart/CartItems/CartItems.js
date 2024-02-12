import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { map } from 'lodash';
import s from './CartItems.scss';
import CartItem from '../../CartItem';

@withStyles(s)
class CartItems extends Component {
  render() {
    const { cart, cartLoading } = this.props;
    return (
      <div className={s.root}>
        {!cartLoading && map(cart.items, item => <CartItem item={item} />)}
      </div>
    );
  }
}

export default CartItems;
