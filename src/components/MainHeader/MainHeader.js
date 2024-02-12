import React from 'react';
import cx from 'classnames';
import styled from 'styled-components';
import { map, get as prop, isEmpty } from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import Container from '../Container';
import ElementWithPopupMenu from '../ElementWithPopupMenu';
import Link from '../Link';
// import MegaMenu from '../MegaMenu';
// import LogoHeader from '../Icons/LogoHeader';
import MiniCartContainer from '../MiniCart/MiniCartContainer';
import SearchBarDesktop from '../SearchBar/SearchBarDesktop';
import s from './MainHeader.scss';
import t from './translation.json';
import { setHoverActiate } from '../../reducers/hoverEventActivate/actions';
import { getFormatedCart } from '../../reducers/cart/selectors';
import Image from './../Image';
import MiniLogin from '../MiniLogin';
import CustomerMenu from '../CustomerMenu';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

const WrapMainHeader = styled.div`
  padding: 0 0 0 19px;
`;

class MainHeader extends React.PureComponent {
  state = {
    activeCategory: null,
    closeMinicart: false,
    closeMegamenu: false,
  };

  setCategory = category => {
    this.setState({
      activeCategory: category,
    });
  };

  unsetCategory = () => this.setState({ activeCategory: null });

  handleViewCart = () => {
    this.setState({ closeMinicart: true }, () => {
      this.setState({ closeMinicart: false });
    });
  };

  handleClickMegaMenuLink = () => {
    this.setState({ activeCategory: null, closeMegamenu: true }, () => {
      this.setState({ closeMegamenu: false });
    });
  };

  handleLinkToCategory = ({ url_key, url_path }) => {
    if (url_key === 'brands-inspiration') {
      return 'shopbybrand';
    } else if (url_path === 'sales-promotion') {
      return url_path;
    }

    return `/${url_path}`;
  };

  render() {
    const {
      translate,
      category,
      cart,
      showMiniCart,
      setHoverActive,
      customer,
      isHoverActive: { isHoverActive },
    } = this.props;
    const categoryList = category.length > 0 && category.slice(0, 10);
    // const extraCates = ['brand', 'sale', 'gifts'];
    const cartQty = prop(cart, 'items_qty', 0);

    const { activeCategory } = this.state;

    return (
      <div
        className={cx(s.wrapper, {
          [s.hasActiveCate]: activeCategory,
        })}
      >
        <div className={s.mainHeaderContainer}>
          <Container className={s.boxMainHeader} padding="none">
            <WrapMainHeader>
              <div className={s.navbar}>
                <div className={s.navbarLeft}>
                  <div className={s.brandLogo}>
                    {/* lnk-viewHomeOnMainHeader */}
                    <Link
                      id={generateElementId(
                        ELEMENT_TYPE.LINK,
                        ELEMENT_ACTION.VIEW,
                        'Home',
                        'MainHeader',
                      )}
                      className={s.logo}
                      to="/"
                      native
                    >
                      LogoHeader
                    </Link>
                  </div>
                  <div className={s.searchBox}>
                    <SearchBarDesktop key={'desktop'} />
                  </div>
                </div>
                <div className={s.navbarRight}>
                  <div className={s.customerInfo}>
                    {!isEmpty(customer) ? (
                      <ElementWithPopupMenu
                        id="account-button"
                        className={cx(s.popupMenuCustomer)}
                        eventType="click"
                        top="100%"
                        arrowClassName={s.popupArrowCustomer}
                        closeOnLeave={false}
                        timeout={0}
                        element={
                          <a
                            id={generateElementId(
                              ELEMENT_TYPE.BUTTON,
                              ELEMENT_ACTION.VIEW,
                              'CustomerMenu',
                              'MainHeader',
                            )}
                            className={s.customerInfoWrapper}
                            href="javascript:void(0)"
                          >
                            <div className={s.icon}>
                              <Image
                                src="/static/icons/AfterLogin.svg"
                                height="35"
                                width="35"
                                className={s.nonResponsive}
                              />
                            </div>
                            <div className={s.info}>
                              <div>{translate('welcome_customer')}</div>
                              <div className={s.infoName}>
                                {customer.firstname}
                              </div>
                            </div>
                          </a>
                        }
                        popupMenu={<CustomerMenu />}
                        isHoverMenuActive={isHoverActive}
                      />
                    ) : (
                      <ElementWithPopupMenu
                        id="login-button"
                        className={cx(s.popupMenuCustomer)}
                        eventType="click"
                        closeOnLeave={false}
                        top="100%"
                        arrowClassName={s.popupArrowCustomer}
                        onMenuActive={active =>
                          this.setState({ loginActive: active })
                        }
                        element={
                          <a
                            className={s.customerInfoWrapper}
                            href="javascript:void(0)"
                            id={generateElementId(
                              ELEMENT_TYPE.LINK,
                              ELEMENT_ACTION.VIEW,
                              'MiniLogin',
                              'MainHeader ',
                            )}
                          >
                            <div className={s.icon}>
                              <Image
                                src="/static/icons/BeforeLogin.svg"
                                height="35"
                                width="35"
                                className={s.nonResponsive}
                              />
                            </div>
                            <div className={s.info}>
                              <div>{translate('login_and_register')}</div>
                            </div>
                          </a>
                        }
                        popupMenu={
                          <MiniLogin
                            className={s.miniLoginWrapper}
                            loginActive={this.state.loginActive}
                          />
                        }
                        timeout={0}
                        isHoverMenuActive={isHoverActive}
                      />
                    )}
                  </div>

                  <div className={s.wishlist}>
                    {!isEmpty(customer) ? (
                      <Link
                        id={generateElementId(
                          ELEMENT_TYPE.BUTTON,
                          ELEMENT_ACTION.VIEW,
                          'Wishlist',
                          'MainHeader',
                        )}
                        to="/account/wishlist"
                        className={s.wishlistIcon}
                      >
                        <Image
                          src="/static/icons/Wishlist.svg"
                          height="35"
                          width="35"
                        />
                      </Link>
                    ) : (
                      <a
                        href="javascript:void(0)"
                        className={s.wishlistIcon}
                        id={generateElementId(
                          ELEMENT_TYPE.BUTTON,
                          ELEMENT_ACTION.VIEW,
                          'Wishlist',
                          'MainHeader ',
                        )}
                        onClick={() =>
                          this.props.openAlert(
                            this.props.translate('please_login'),
                            this.props.translate('confirm_login'),
                          )
                        }
                      >
                        <Image
                          src="/static/icons/Wishlist.svg"
                          height="35"
                          width="35"
                        />
                      </a>
                    )}
                  </div>

                  <div className={s.miniCart}>
                    <ElementWithPopupMenu
                      id={generateElementId(
                        ELEMENT_TYPE.BUTTON,
                        ELEMENT_ACTION.VIEW,
                        'MiniCart',
                        'MainHeader',
                      )}
                      ref={node => (this.miniCartPopup = node)}
                      eventType="click"
                      closeOnLeave={false}
                      arrowClassName={s.popupArrowMiniCart}
                      timeout={0}
                      top="53"
                      popupMenu={
                        <MiniCartContainer onViewCart={this.handleViewCart} />
                      }
                      close={this.state.closeMinicart}
                      element={
                        <div className={s.miniCartWrapper}>
                          <a
                            id={generateElementId(
                              ELEMENT_TYPE.BUTTON,
                              ELEMENT_ACTION.VIEW,
                              'MiniCart',
                              'MainHeader',
                            )}
                            href="javascript:void(0)"
                            className={s.miniCartIcon}
                          >
                            <Image
                              src="/static/icons/ShoppingBag.svg"
                              height="35"
                              width="35"
                              className={s.iconCart}
                            />
                          </a>
                          {cartQty > 0 && (
                            <span className={s.cartCount}>{cartQty}</span>
                          )}
                        </div>
                      }
                      showMenu={showMiniCart}
                      showOnHover={!showMiniCart}
                      isHoverMenuActive={isHoverActive}
                    />
                  </div>
                </div>
              </div>

              <div className={s.navbarMenu}>
                {category.length > 0
                  ? map(categoryList, cate => (
                      <div className={cx(s.menuItems, s.active)} key={cate.id}>
                        <ElementWithPopupMenu
                          id={`megamenu-button-${cate.id}`}
                          className={s.paddedMenuContainer}
                          arrowClassName={s.popupArrowMenu}
                          top="40"
                          element={
                            <Link
                              id={generateElementId(
                                ELEMENT_TYPE.LINK,
                                ELEMENT_ACTION.VIEW,
                                'Category',
                                'MainHeader',
                                prop(cate, 'id', null),
                              )}
                              className={cx(s.menuLink)}
                              to={this.handleLinkToCategory(cate)}
                              native
                            >
                              {cate.name}
                            </Link>
                          }
                          popupMenu={<div>MegaMenu</div>}
                          onMouseEnter={() => this.setCategory(cate)}
                          onMouseLeave={this.unsetCategory}
                          timeout={300}
                          close={this.state.closeMegamenu}
                          onHoverMenuActive={value => setHoverActive(value)}
                        />
                      </div>
                    ))
                  : ''}
              </div>
            </WrapMainHeader>
          </Container>
        </div>

        {!this.state.closeMegamenu && <div className={s.megamenuBlackDrop} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cart: getFormatedCart(state),
  hideMegamenu: state.layout.hideMegamenu,
  showMiniCart: state.layout.showMiniCart,
  isHoverActive: state.hoverEventActivate,
  customer: state.customer.customer,
});

const mapDispatchToProps = dispatch => ({
  setHoverActive: isActive => dispatch(setHoverActiate(isActive)),
});

export default compose(
  withStyles(s),
  withLocales(t),
  connect(mapStateToProps, mapDispatchToProps),
)(MainHeader);
