import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import pt from 'prop-types';
import cx from 'classnames';
import { isEmpty, head, includes, isUndefined } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import withRoutes from '../../utils/decorators/withRoutes';
// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import { closeAlert } from '../../reducers/layout/actions';
import s from './Layout.scss';
import t from './translation.json';
import Header from '../Header';
// import MobileHeader from '../MobileHeader';
// import Footer from '../Footer';
import { UPPER_HEADER_HEIGHT } from '../../constants/styles';
import { fetchCart } from '../../reducers/cart/actions';
// import { fetchCategory } from '../../reducers/category/actions';
import {
  fetchWishlistGroup,
  addWishlistGroup,
} from '../../reducers/wishlistGroup/actions';
import { fetchWishlist } from '../../reducers/wishlist/actions';
import { resolveUrl } from '../../utils/url';
import history from '../../history';
// import { googleTagDataLayer } from '../../reducers/googleTag/actions';
import Popup from '../Popup/Popup';

@withLocales(t)
@withStyles(normalizeCss, s)
class Layout extends React.PureComponent {
  static propTypes = {
    children: pt.node.isRequired,
    addPaddingTop: pt.bool,
    isFullBrandPage: pt.bool,
  };

  static defaultProps = {
    addPaddingTop: true,
  };

  state = {
    isHeaderFixed: false,
    wishlistGroup: [],
    // current_page: 1,
    // filters: 'customer_id',
  };

  componentDidMount() {
    const { cartInitial, fetchCart } = this.props;

    if (cartInitial) {
      fetchCart();
    }

    // if (isEmpty(categories)) {
    //   fetchCategory();
    // }

    window.addEventListener('scroll', this.handleScroll);
    this.initialWishlist();

    this.initialDataLayer();
  }

  initialDataLayer = () => {
    // this.props.googleTagDataLayer(gtmType.LAYOUT);
  };

  initialWishlist = () => {
    const { customer, fetchWishlistGroup } = this.props;
    const { wishlistGroup } = this.state;

    if (!isEmpty(customer) && isEmpty(wishlistGroup)) {
      fetchWishlistGroup();
    }
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    const { wishlistGroups, wishlistGroupsLoading } = this.props;
    if (prevProps.wishlistGroups !== wishlistGroups && !wishlistGroupsLoading) {
      if (isEmpty(wishlistGroups)) {
        this.props.addWishlistGroup('default');
      } else if (!includes(window.location.pathname, 'wishlist')) {
        this.props.fetchWishlist(head(wishlistGroups).wishlist_id, 0);
      } else {
        const { queryParams } = this.props.location;
        this.props.fetchWishlist(
          head(wishlistGroups).wishlist_id,
          6,
          !isUndefined(queryParams.page) ? queryParams.page : 1,
        );
      }
    }
    // if (this.props.location.pathname !== prevProps.location.pathname) {
    //   this.props.googleTagDataLayer(gtmType.EVENT_CLEAR_BATH);
    // }
  }

  handleScroll = () => {
    this.setState({
      isHeaderFixed: pageYOffset >= UPPER_HEADER_HEIGHT,
    });
  };

  goToLogIn = () => {
    const url = resolveUrl(this.props.langCode, '/register');
    history.push(url);
    this.props.closeAlert();
  };

  render() {
    const {
      alert,
      closeAlert,
      isFullBrandPage,
      alertCheckQty,
      customer,
    } = this.props;

    return (
      <div id="layout" className={cx({ [s.fullBrandPage]: isFullBrandPage })}>
        {!customer.isMobile && (
          <React.Fragment>
            <Popup />
            <Header />
            {/* <MobileHeader /> */}
          </React.Fragment>
        )}
        <div
          className={cx(s.contentWrapper, {
            [s.padding]: this.props.addPaddingTop,
            [s.margin]: this.state.isHeaderFixed,
          })}
        >
          {this.props.children}
        </div>
        {/*{!customer.isMobile && <Footer />}*/}
        {!isEmpty(alert) && (
          <SweetAlert
            showCancel
            title={alert.title}
            confirmBtnCssClass={s.confirmBtn}
            cancelBtnCssClass={s.cancleBtn}
            confirmBtnText={this.props.translate('go_to_login')}
            onCancel={() => closeAlert()}
            onConfirm={() => this.goToLogIn()}
          >
            {alert.message}
          </SweetAlert>
        )}
        {!isEmpty(alertCheckQty) && (
          <SweetAlert
            title={alert.title}
            confirmBtnCssClass={s.confirmBtn}
            onConfirm={() => closeAlert()}
          >
            {alertCheckQty.message}
          </SweetAlert>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  wishlistGroups: state.wishlistGroup.wishlistGroups,
  wishlistGroupsLoading: state.wishlistGroup.loading,
  cartInitial: state.cart.initial,
  lang: state.locale.lang,
  // categories: state.category.categories,
  customer: state.customer.customer,
  langCode: state.locale.langCode,
  alert: state.layout.alert,
  alertCheckQty: state.layout.alert,
});

const mapDispatchToProps = dispatch => ({
  fetchCart: () => dispatch(fetchCart()),
  // fetchCategory: () => dispatch(fetchCategory()),
  fetchWishlistGroup: () => dispatch(fetchWishlistGroup()),
  addWishlistGroup: name => dispatch(addWishlistGroup(name)),
  fetchWishlist: (groupId, limit, page) =>
    dispatch(fetchWishlist({ wishlist_id: groupId, limit: limit, page: page })),
  closeAlert: () => dispatch(closeAlert()),
  // googleTagDataLayer: type => dispatch(googleTagDataLayer(type)),
});

export default compose(
  withRoutes,
  connect(mapStateToProps, mapDispatchToProps),
)(Layout);
