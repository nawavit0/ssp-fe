import React from 'react';
import { compose } from 'redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Wishlist.scss';
import t from './translation.json';
import withLocales from '../../utils/decorators/withLocales';
import Container from '../../components/Container';
import Link from '../../components/Link';
import Image from '../../components/Image';
import Button from '../../components/Button';

class Wishlist extends React.PureComponent {
  renderEmptyWishlist() {
    const { translate } = this.props;
    return (
      <div className={s.empty}>
        <div className={s.emptyWishlistIconWrapper}>
          <Image src="/icons/empty-wishlist.svg" />
        </div>
        <label className={s.emptyWishlistLabel}>
          {translate('empty_wishlist')}
        </label>
        <label className={s.emptySaveLogin}>
          {translate('simply_click')}
          <Image
            className={s.iconWishlistSmall}
            src="/icons/wishlist-small.svg"
          />
          {translate('icon_to_save')}
        </label>
        <Link id="lnk-register" to="/">
          <Button
            color="red"
            className={s.goShoppingButton}
            text={translate('go_shopping')}
          />
        </Link>
        <label className={s.labelGoToShopping}>
          {translate('already_save_item')}
          <Link
            className={s.labelGoToShoppingLink}
            id=" lnk-backToHome"
            to="/register"
          >
            {translate('sign_in')}
          </Link>
        </label>
      </div>
    );
  }

  renderWishlsitDesktopTitle() {
    const { translate } = this.props;

    return (
      <div className={s.title}>
        {translate('wishlist_title').toUpperCase()}
        <span className={s.items}> {translate('wishlist_count')}</span>
      </div>
    );
  }

  render() {
    return (
      <Container>
        {this.renderWishlsitDesktopTitle()}
        {this.renderEmptyWishlist()}
      </Container>
    );
  }
}

export default compose(
  withLocales(t),
  withStyles(s),
)(Wishlist);
