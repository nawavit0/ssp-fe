import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import { isEmpty, get } from 'lodash';
import s from './AddToWishlist.scss';
import t from './translation.json';
import pt from 'prop-types';
import cx from 'classnames';
// import Ionicon from 'react-ionicons';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  addWishlist,
  fetchWishlist,
  deleteWishlist,
} from '../../reducers/wishlist/actions';
import { fetchProductAttributes } from '../../reducers/product/actions';
import { openAlert } from '../../reducers/layout/actions';
import gtmType from '../../constants/gtmType';

class AddToWishlist extends React.PureComponent {
  static propTypes = {
    product: pt.object.isRequired,
    className: pt.string,
    classNameIcon: pt.string,
    classNameCart: pt.string,
    wishlist: pt.array,
    classNameHideTitle: pt.string,
    button: pt.bool,
    isFullWishlistText: pt.bool,
  };
  static defaultProps = {
    wishlist: [],
    isFullWishlistText: false,
    classNameIcon: '',
  };
  state = {
    isCheckWishlist: false,
  };

  componentDidMount() {
    this.chkItem();
  }
  componentDidUpdate(prevProps) {
    //console.log(prevProps.wishlist);
    //console.log(this.props.wishlist);
    if (prevProps.wishlist !== this.props.wishlist) {
      this.chkItem();
    }
    //console.log(prevProps.activeProduct);
    //console.log(this.props.activeProduct);
  }

  chkItem = async () => {
    const {
      product,
      customer,
      wishlist,
      // activeProduct,
      // fetchProductAttributes,
    } = this.props;
    if (!isEmpty(customer)) {
      // let activeAttribute = false;
      // if (product.type_id === 'configurable') {
      //   const prodAttrObj = await fetchProductAttributes(product.sku);
      //   const attributeCode = prodAttrObj[0].attribute_code;
      //
      //   activeAttribute = {
      //     [attributeCode]: get(activeProduct, attributeCode, ''),
      //   };
      // }
      //console.log('prod', product);
      // console.log(activeAttribute);
      // console.log(wishlist);
      // console.log(activeProduct);
      if (
        !isEmpty(wishlist) &&
        !isEmpty(wishlist.find(({ product_id }) => product_id === product.id))
      ) {
        this.setState({
          isCheckWishlist: 2,
        });
      } else {
        this.setState({
          isCheckWishlist: 1,
        });
      }
    }
  };

  handleAddToWishlist = async () => {
    const { customer } = this.props;
    if (!isEmpty(customer)) {
      const {
        product,
        wishlistGroups,
        addWishlist,
        // fetchWishlist,
        fetchProductAttributes,
        // deleteWishlist,
        activeProduct,
      } = this.props;
      if (
        wishlistGroups.length > 0 &&
        wishlistGroups[0].wishlist_id !== undefined
      ) {
        let activeAttribute = false;
        if (product.type_id === 'configurable') {
          const prodAttrObj = await fetchProductAttributes(product.sku);
          const attributeCode = prodAttrObj[0].attribute_code;

          activeAttribute = {
            [attributeCode]: get(activeProduct, attributeCode, ''),
          };
        }

        // const wishlistObj = await fetchWishlist(
        //   wishlistGroups[0].wishlist_id,
        //   product.id,
        // );

        // const duplicateWishlist = find(wishlistObj.lists.items, {
        //   id: product.id,
        // });

        // console.log('dup', duplicateWishlist);
        // if (duplicateWishlist === undefined) {
        addWishlist(
          wishlistGroups[0].wishlist_id,
          product.id,
          wishlistGroups[0].wishlist_id,
          product,
          activeAttribute,
        );
        this.setState({
          isCheckWishlist: 2,
        });
        // } else {
        //   deleteWishlist(
        //     wishlistGroups[0].wishlist_id,
        //     duplicateWishlist.wishlist_item_id,
        //   );
        //   this.setState({
        //     isCheckWishlist: false,
        //   });
        // }
      } else {
        this.props.openAlert(
          this.props.translate('please_login'),
          this.props.translate('confirm_login'),
        );
      }
    }
  };

  renderWishlistBtn = () => {
    const { classNameIcon, classNameCart, button } = this.props;
    const { isCheckWishlist } = this.state;
    if (isCheckWishlist === 2) {
      return <div>isCheckWishlist 2</div>
      // return (
      //   <Ionicon
      //     icon="md-heart"
      //     color="#a6192e"
      //     className={button ? classNameIcon : classNameCart}
      //   />
      // );
    } else if (isCheckWishlist === 1) {
      // return (
      //   <Ionicon
      //     icon="md-heart-outline"
      //     className={button ? classNameIcon : classNameCart}
      //   />
      // );
      return <div>isCheckWishlist 1</div>
    }
    return (
      <div disabled="disabled">
        {/*<Ionicon icon="md-heart-outline" className={classNameIcon} />*/}
        <div>qw</div>
      </div>
    );
  };

  displayFulltext = () => {
    const { isCheckWishlist } = this.state;
    const { translate } = this.props;
    return isCheckWishlist
      ? translate('remove_wishlist_full_text')
      : translate('add_wishlist_full_text');
  };
  render() {
    const {
      className,
      translate,
      classNameHideTitle,
      button,
      isFullWishlistText,
    } = this.props;
    //const { isCheckWishlist } = this.state;
    return (
      <React.Fragment>
        {button ? (
          <button
            className={cx(
              s.buttonAddToWishlist,
              className,
              gtmType.EVENT_ADD_TO_WISHLIST,
            )}
            onClick={this.handleAddToWishlist}
          >
            {this.renderWishlistBtn()}
            <span className={s.wishlist_message}>
              {translate('add_to_wishlist_button')}
            </span>
          </button>
        ) : (
          <div
            className={cx(
              s.addToWishlist,
              className,
              gtmType.EVENT_ADD_TO_WISHLIST,
            )}
            onClick={this.handleAddToWishlist}
          >
            {this.renderWishlistBtn()}
            <span className={cx(s.wishlist_message, classNameHideTitle)}>
              {isFullWishlistText
                ? this.displayFulltext()
                : translate('add_to_wishlist')}
            </span>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  wishlistGroups: state.wishlistGroup.wishlistGroups,
  customer: state.customer.customer,
});

const mapDispatchToProps = dispatch => ({
  fetchProductAttributes: sku => dispatch(fetchProductAttributes(sku)),
  fetchWishlist: (groupId, itemId) =>
    dispatch(fetchWishlist({ wishlist_id: groupId, product_id: itemId })),
  addWishlist: (groupId, itemId, groupIdDefault, product, activeAttribute) =>
    dispatch(
      addWishlist(
        groupId,
        itemId,
        groupIdDefault,
        product,
        activeAttribute,
        'reLoad',
      ),
    ),
  deleteWishlist: (groupId, itemId) =>
    dispatch(deleteWishlist(groupId, itemId)),
  openAlert: (title, message) => dispatch(openAlert(title, message)),
});

export default compose(
  withLocales(t),
  withStyles(s),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(AddToWishlist);
