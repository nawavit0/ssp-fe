import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { isEmpty, map } from 'lodash';
import cx from 'classnames';
import pt from 'prop-types';
import queryString from 'query-string';
import React, { Fragment } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../utils/decorators/withLocales';
import s from './Checkout.scss';
import t from './translation.json';
import Container from '../../components/Container';
import Row from '../../components/Row';
import Col from '../../components/Col';
import { Link } from '@central-tech/core-ui';
import CheckoutProgressBar from '../../components/CheckoutProgressBar';
import CustomerInfo from '../../components/Checkout/CustomerInfo';
import CheckoutAddressCds from '../../components/Checkout/CheckoutAddress/CheckoutAddressCDS';
import CustomerInfoForm from '../../components/Checkout/CustomerInfoForm';
import GuestAddressForm from '../../components/Checkout/GuestAddressForm';
import ShippingMethodSelector from '../../components/Checkout/ShippingMethodSelector';
import StoreContainer from '../../components/StoreContainer/StoreContainer';
import DeliveryOption from '../../components/Checkout/DeliveryOption';
import OrderSummary from '../../components/Checkout/OrderSummary';
import Price from '../../components/Price';
import AddressModal from '../../components/Checkout/AddressModal';
import FullPageLoader from '../../components/FullPageLoader';
import ToggleSwitch from '../../components/Form/ToggleSwitch';
import ImageV2 from '../../components/Image/ImageV2';
import history from '../../history';
import {
  getCartShippingAddress,
  getCartTotal,
  getCartItems,
} from '../../reducers/cart/selectors';
import {
  getCustomerBillingAddresses,
  getCustomerShippingAddresses,
} from '../../reducers/customer/selectors';

import {
  canContinueToPay,
  getAvailableShippingMethods,
  getCustomerInfo,
  getGmapApiKey,
  getStoreLocations,
  // Comment for : Old Cds's code.
  // getSkyboxLocations,
  hasCompletedShipping,
  getGuestInfo,
  getIsDeliveryAvailable,
  getIsPickAtStoreAvailable,
  getCheckoutInitial,
  isUserLoggedIn,
} from '../../reducers/checkout/selectors';

import {
  beginCheckout,
  continueToPay,
  selectDeliveryOption,
  setCurrentShippingMethod,
  setPickupLocation,
  estimateMemberShipment,
  submitGuestInfo,
  submitGuestAddress,
  saveShippingInfo,
  saveBillingInfo,
  toggleFullTaxInvoiceMember,
  toggleFullTaxInvoice,
  saveSelectedMapLocation,
} from '../../reducers/checkout/actions';

import { getStockItems } from '../../reducers/product/actions';

import AddressType from '../../model/Address/AddressType';
import DeliveryType from '../../model/Checkout/DeliveryType';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal';
import GuestBillingAddressForm from '../../components/Checkout/GuestBillingAddressForm';
import gtmType from '../../constants/gtmType';
// import {
//   googleTagDataLayer,
//   setPageType,
// } from '../../reducers/googleTag/actions';
import { fetchCart } from '../../reducers/cart/actions';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

@withStyles(s)
@withLocales(t)
export class Checkout extends React.PureComponent {
  static propTypes = {
    canContinue: pt.bool,
    cartTotal: pt.number,
    checkout: pt.object,
    customerInfo: pt.object,
    cartShippingAddress: pt.object,
    loading: pt.bool,
    shippingMethods: pt.arrayOf(pt.object),
    pickupLocations: pt.arrayOf(pt.object),
    // Comment for : Old Cds's code.
    // skyboxLocations: pt.arrayOf(pt.object),
  };

  static contextTypes = {
    customer: pt.object,
  };

  state = {
    showAddressModal: false,
    addressModalType: null,
    showSummary: false,
    cartMessages: null,
    showModal: false,
    cartItems: null,
  };

  async componentDidMount() {
    this.props.beginCheckout();
    this.checkActionEdit();
    // this.props.setPageType(gtmType.CHECKOUT);
  }

  componentDidUpdate(prevProps, prevState) {
    const { items, getStockItems } = this.props;
    const { cartItems } = this.state;

    if (isEmpty(cartItems)) {
      const that = this;
      const messages = [];
      const skus = [];

      map(items, item => {
        skus.push(item.sku);
      });

      const stockItems = getStockItems(skus);

      stockItems.then(function(stock) {
        map(items, item => {
          if (item.id === stock.product_id) {
            if (item.qty > stock.qty) {
              messages.push(item.name);
            }
          }
        });

        if (messages.length > 0) {
          that.setState({
            cartMessages: messages.join(','),
            showModal: true,
          });
        }
      });

      this.setState({
        cartItems: items,
      });
    }
    if (!isEmpty(cartItems) && cartItems !== prevState.cartItems) {
    }
  }

  checkActionEdit() {
    const urlSearch = queryString.parse(window.location.search);

    if (!isEmpty(urlSearch) && urlSearch.action === 'edit') {
      history.replace(window.location.pathname);
      this.setState({
        showAddressModal: true,
        addressModalType: AddressType.SHIPPING,
      });
    }
  }

  handleSelectedOption(value) {
    const { checkout, setDeliveryOption } = this.props;
    let targetElement;
    if (checkout.deliveryOption !== value) {
      //setPickupLocation();
      setDeliveryOption(value);

      switch (value) {
        case 1:
          targetElement = this.shippingRef;
          break;
        case 2:
          targetElement = this.pickupRef;
          this.props.setPickupLocation(null);
          break;
        case 3:
          targetElement = this.skyboxRef;
          this.props.setPickupLocation(null);
          break;
      }

      if (targetElement) {
        setTimeout(() => {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth',
          });
        }, 300);
      }
    }
  }

  selectShippingAddress = type => {
    this.setState({
      showAddressModal: true,
      addressModalType: type,
    });
  };

  handleSetActiveAddress = async (address, type) => {
    const { translate } = this.props;
    if (!address) {
      alert(`${translate('addressEmptyMessage')}`);
      return;
    }

    if (type === AddressType.SHIPPING) {
      this.props.onAddressChanged(address);
    } else if (type === AddressType.BILLING) {
      this.props.saveBillingInfo(address);
    }

    this.handleCloseAddressModal();
  };

  onShippingMethodChange = method => {
    this.props.setShippingMethod(method);
    this.props.saveShippingInfo();
  };

  onPickupMethodChange = method => {
    this.props.setPickupMethod(method);
  };

  handleCloseAddressModal = () => {
    this.props.beginCheckout();
    this.setState({
      showAddressModal: false,
    });
  };

  onSetPickupLocation = location => {
    this.props.setPickupLocation(location);
    this.props.saveSelectedMapLocation();
  };

  handleShowHideSummary = () => {
    this.setState({
      showSummary: !this.state.showSummary,
    });
  };

  renderModalHeader = () => {
    const { translate } = this.props;
    return (
      <div className={s.modalHeader}>
        <div className={s.title}>{translate('modal_title')}</div>
      </div>
    );
  };

  onCloseModal = () => {
    window.location.href = '/cart';
  };

  onContinue = () => {
    this.props.onContinue();
  };

  renderAddressModal() {
    const {
      cartShippingAddress,
      checkout: { billingAddress },
    } = this.props;
    const activeAddress =
      this.state.addressModalType === AddressType.BILLING
        ? billingAddress
        : cartShippingAddress;

    return (
      <AddressModal
        show={this.state.showAddressModal}
        onSubmit={this.handleSetActiveAddress}
        activeAddress={activeAddress}
        onCloseClick={this.handleCloseAddressModal}
        type={this.state.addressModalType}
      />
    );
  }

  renderBillingAddress() {
    const {
      checkout: { billingAddress },
      customerBillingAddresses,
      translate,
    } = this.props;
    let message;
    if (billingAddress) {
      message = translate('changeBillingAddress');
    } else if (!isEmpty(customerBillingAddresses)) {
      message = translate('selectBillingAddress');
    } else {
      message = translate('addBillingAddress');
    }
    return (
      <Fragment>
        <h3 className={s.deliveryTitle}>{translate('billingAddress')}</h3>
        <CheckoutAddressCds
          address={billingAddress}
          className={cx(s.whiteBox, {
            [s.noAddress]: !billingAddress,
          })}
          emptyMessage={translate('noBilling')}
        />
        <button
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.EDIT,
            'Address',
            '',
          )}
          className={s.changeAddressBtn}
          onClick={() => this.selectShippingAddress(AddressType.BILLING)}
        >
          {message}
        </button>
      </Fragment>
    );
  }

  renderGuestBillingAddress() {
    return (
      <Fragment>
        <br />
        <br />
        <GuestBillingAddressForm onSubmit={() => {}} />
      </Fragment>
    );
  }

  renderShippingAddress() {
    const {
      checkout: { shippingAddress },
      translate,
      customerShippingAddresses,
    } = this.props;

    let message = translate('changeShippingAddress');

    if (!shippingAddress) {
      if (!isEmpty(customerShippingAddresses)) {
        message = translate('selectShippingAddress');
      } else {
        message = translate('addShippingAddress');
      }
    }
    return (
      <Fragment>
        <CheckoutAddressCds
          address={shippingAddress}
          className={cx(s.whiteBox, {
            [s.noAddress]: !shippingAddress,
          })}
          emptyMessage="You have no shipping address selected."
        />
        <button
          id={generateElementId(
            ELEMENT_TYPE.BUTTON,
            ELEMENT_ACTION.EDIT,
            'Address',
            '',
          )}
          className={s.changeAddressBtn}
          onClick={() => this.selectShippingAddress(AddressType.SHIPPING)}
        >
          {message}
        </button>
      </Fragment>
    );
  }

  renderAddressForm() {
    const { cartShippingAddress, submitGuestAddress } = this.props;
    return (
      <GuestAddressForm
        address={cartShippingAddress}
        onSubmit={submitGuestAddress}
      />
    );
  }

  render() {
    const {
      checkout,
      customerInfo,
      cartTotal,
      loading,
      shippingMethods,
      pickupLocations,
      // Cds's code.
      // skyboxLocations,
      submitGuestInfo,
      translate,
      isDeliveryAvailable,
      isPickAtStoreAvailable,
      isCartInitialed,
      cartShippingAddress,
      isMember,
    } = this.props;

    const {
      currentShippingMethod,
      deliveryOption,
      isFullTaxInvoice,
      pickupLocation,
    } = checkout;

    const { cartMessages, showModal } = this.state;
    const selectedLocation =
      pickupLocation && pickupLocation.id ? pickupLocation.id : null;

    const allMethodDisabled =
      isCartInitialed && !isDeliveryAvailable && !isPickAtStoreAvailable;

    return (
      <div className={s.checkoutBlock} id="checkout-page">
        <Modal
          classNameModal={s.root}
          classNameModalHeader={s.headerWrapper}
          show={showModal}
          header={this.renderModalHeader()}
          onModalClose={this.onCloseModal}
        >
          <div className={s.modalBody}>{cartMessages}</div>
        </Modal>

        <Container>
          <CheckoutProgressBar step={1} />
          <Row gutter={15}>
            <Col
              className={cx({ [s.hidden]: this.state.showSummary })}
              lg={8}
              md={12}
            >
              <section className={s.deliverySection}>
                {isMember ? (
                  <CustomerInfo {...customerInfo} />
                ) : (
                  <Fragment>
                    <div className={s.loginTab}>
                      {translate('loginToCheckout1')}
                      <Link className={s.linkLogin} to={'/guest-login'} native>
                        {translate('loginToCheckout2')}
                      </Link>
                      {translate('loginToCheckout3')}
                    </div>
                    <h3 className={s.deliveryTitle}>
                      {translate('customerInfo')}
                    </h3>
                    <CustomerInfoForm
                      onSubmit={submitGuestInfo}
                      shippingAddress={cartShippingAddress}
                    />
                  </Fragment>
                )}
                <hr />
                <h3 className={s.deliveryTitle}>
                  {translate('deliveryOption')}{' '}
                  {!isCartInitialed && (
                    <span>
                      {/*<IosSync*/}
                      {/*  icon="ios-sync"*/}
                      {/*  fontSize="20px"*/}
                      {/*  color="#aaaaaa"*/}
                      {/*  rotate*/}
                      {/*/>*/}
                    </span>
                  )}
                </h3>

                {isCartInitialed && (
                  <React.Fragment>
                    {allMethodDisabled && (
                      <div className={s.allMethodDisable}>
                        {translate('method_not_available')}
                      </div>
                    )}

                    {isDeliveryAvailable && (
                      <DeliveryOption
                        id={generateElementId(
                          ELEMENT_TYPE.RADIO,
                          ELEMENT_ACTION.ADD,
                          'DeliveryOption',
                          '',
                          'shipToAddress',
                        )}
                        title={translate('shipToAddress')}
                        hint={translate('shipToAddressHint')}
                        icon="/static/icons/Shipping.svg"
                        iconFullpath="/static/icons/Shipping.svg"
                        selected={deliveryOption === DeliveryType.ShipToAddress}
                        onClick={() =>
                          this.handleSelectedOption(DeliveryType.ShipToAddress)
                        }
                        elementRef={element => {
                          this.shippingRef = element;
                        }}
                      >
                        <h3 className={s.deliveryTitle}>
                          {translate('shippingAddress')}
                        </h3>
                        {isMember
                          ? this.renderShippingAddress()
                          : this.renderAddressForm()}

                        <hr />

                        <h3 className={s.deliveryTitle}>
                          {translate('selectShippingOptions')}
                        </h3>

                        <ShippingMethodSelector
                          items={shippingMethods}
                          selectedItem={currentShippingMethod}
                          onChange={this.onShippingMethodChange}
                        />
                      </DeliveryOption>
                    )}

                    {isPickAtStoreAvailable && (
                      <React.Fragment>
                        <DeliveryOption
                          id={generateElementId(
                            ELEMENT_TYPE.RADIO,
                            ELEMENT_ACTION.ADD,
                            'DeliveryOption',
                            '',
                            'pickupAtStore',
                          )}
                          title={translate('pickupAtStore')}
                          hint={translate('pickupAtStoreHint')}
                          iconFullpath="/static/icons/StorePickup.svg"
                          // fee={translate('free')}
                          selected={
                            deliveryOption === DeliveryType.PickupAtStore
                          }
                          onClick={() =>
                            this.handleSelectedOption(
                              DeliveryType.PickupAtStore,
                            )
                          }
                          elementRef={element => {
                            this.pickupRef = element;
                          }}
                        >
                          {deliveryOption === DeliveryType.PickupAtStore && (
                            <Fragment>
                              <hr />
                              <StoreContainer
                                loading={loading}
                                locations={pickupLocations}
                                selectedId={selectedLocation}
                                setPickupStore={this.onSetPickupLocation}
                              />
                            </Fragment>
                          )}
                        </DeliveryOption>
                        {/* Prvious code's CDS : In SPS there's no Pickup at Sky box & Fimily mart */}
                        {/* <DeliveryOption
                          id={generateElementId(
                            ELEMENT_TYPE.RADIO,
                            ELEMENT_ACTION.ADD,
                            'DeliveryOption',
                            '',
                            'pickupAtSkybox',
                          )}
                          title={translate('pickupAtSkybox')}
                          hint={translate('pickupAtSkyboxHint')}
                          icon="store-pickup.svg"
                          // fee={'From ฿0'}
                          selected={
                            deliveryOption === DeliveryType.PickupAtSkyBox
                          }
                          onClick={() =>
                            this.handleSelectedOption(
                              DeliveryType.PickupAtSkyBox,
                            )
                          }
                          elementRef={element => {
                            this.skyboxRef = element;
                          }}
                        >
                          {deliveryOption === DeliveryType.PickupAtSkyBox && (
                            <Fragment>
                              <hr />
                              <StoreContainer
                                loading={loading}
                                locations={skyboxLocations}
                                selectedId={selectedLocation}
                                setPickupStore={this.onSetPickupLocation}
                              />
                            </Fragment>
                          )} */}
                        {/* </DeliveryOption> */}
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </section>
            </Col>
            <Col className={s.orderSummary} lg={4} md={12}>
              <Col
                lg={12}
                className={cx(s.summary, {
                  [s.hidden]: !this.state.showSummary || false,
                })}
              >
                <OrderSummary
                  handleShowHideSummary={this.handleShowHideSummary}
                />
              </Col>
            </Col>
            <Col lg={8} md={12}>
              {isMember ? (
                <section className={s.billingSection}>
                  <div className={s.billing}>
                    <span>{translate('isFullTaxInvoice')}</span>
                    <ToggleSwitch
                      checked={isFullTaxInvoice}
                      onChange={this.props.toggleFullTaxInvoiceMember}
                    />
                  </div>
                  {isFullTaxInvoice && this.renderBillingAddress()}
                </section>
              ) : (
                <section className={s.billingSection}>
                  <div className={s.billing}>
                    <span>{translate('isFullTaxInvoice')}</span>
                    <ToggleSwitch
                      checked={isFullTaxInvoice}
                      onChange={this.props.toggleFullTax}
                    />
                  </div>
                  {isFullTaxInvoice && this.renderGuestBillingAddress()}
                </section>
              )}

              <section
                className={cx(s.last, { [s.hidden]: this.state.showSummary })}
              >
                <div className={s.mobileFooter}>
                  <div className={s.sum}>
                    <Price
                      format
                      digit={2}
                      bold
                      price={cartTotal}
                      size="small"
                      color="#dd0000"
                    />
                    <Button
                      className={s.viewDetail}
                      onClick={this.handleShowHideSummary}
                    >
                      {translate('view_detail')}
                    </Button>
                  </div>
                  <div className={s.continue}>
                    <button
                      id={generateElementId(
                        ELEMENT_TYPE.BUTTON,
                        ELEMENT_ACTION.VIEW,
                        'Payment',
                        '',
                      )}
                      className={cx(s.btn, gtmType.EVENT_CHECKOUT_STEP_TWO)}
                      data-checkout-step={2}
                      data-checkout-option={'checkout'}
                      disabled={!this.props.canContinue}
                      onClick={() => this.onContinue()}
                    >
                      {translate('continue')}
                      <ImageV2
                        src="/static/icons/ArrowRightWhite.svg"
                        width="16"
                      />
                    </button>
                  </div>
                </div>
              </section>
            </Col>
          </Row>
        </Container>

        {isMember && this.renderAddressModal()}

        <FullPageLoader show={loading} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  langcode: state.locale.langCode,
  loading: state.checkout.loading || state.checkout.estimating,
  isMember: isUserLoggedIn(state),
  canContinue: canContinueToPay(state),
  cartTotal: getCartTotal(state),
  cartShippingAddress: getCartShippingAddress(state),
  customerInfo: getCustomerInfo(state),
  checkout: state.checkout,
  isCompleted: hasCompletedShipping(state),
  shippingMethods: getAvailableShippingMethods(state),
  gmapApiKey: getGmapApiKey(state),
  pickupLocations: getStoreLocations(state),
  // Comment for : Old Cds's code.
  // skyboxLocations: getSkyboxLocations(state),
  customerBillingAddresses: getCustomerBillingAddresses(state),
  customerShippingAddresses: getCustomerShippingAddresses(state),
  items: getCartItems(state),
  guestBillingAddress: getFormValues('guestBillingAddressForm')(state),
  guestInfo: getGuestInfo(state),
  isDeliveryAvailable: getIsDeliveryAvailable(state),
  isPickAtStoreAvailable: getIsPickAtStoreAvailable(state),
  isCartInitialed: getCheckoutInitial(state),
});

const mapDispatchToProps = dispatch => ({
  beginCheckout: () => dispatch(beginCheckout()),
  onContinue: () => dispatch(continueToPay()),
  saveSelectedMapLocation: () => dispatch(saveSelectedMapLocation()),
  setDeliveryOption: value => dispatch(selectDeliveryOption(value)),
  setShippingMethod: method => dispatch(setCurrentShippingMethod(method)),
  setPickupLocation: loc => dispatch(setPickupLocation(loc)),
  onAddressChanged: address => dispatch(estimateMemberShipment(address)),
  submitGuestInfo: values => dispatch(submitGuestInfo(values)),
  submitGuestAddress: address => dispatch(submitGuestAddress(address)),
  saveShippingInfo: () => dispatch(saveShippingInfo()),
  saveBillingInfo: address => dispatch(saveBillingInfo(address)),
  toggleFullTax: () => dispatch(toggleFullTaxInvoice()),
  toggleFullTaxInvoiceMember: () => dispatch(toggleFullTaxInvoiceMember()),
  getStockItems: sku => dispatch(getStockItems(sku)),
  // googleTagDataLayer: type => dispatch(googleTagDataLayer(type)),
  // setPageType: pageType => dispatch(setPageType(pageType)),
  fetchCart: () => dispatch(fetchCart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
