import React from 'react';
import { isEmpty } from 'lodash';
import pt from 'prop-types';
import cx from 'classnames';
import { map, get as prop, find, first, intersection } from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import IosArrowForward from 'react-ionicons/lib/IosArrowForward';
import IosClose from 'react-ionicons/lib/IosClose';
import {
  fetchProductAttributes,
  setFlippedSku,
} from '../../reducers/product/actions';
import withLocales from '../../utils/decorators/withLocales';
import withRoutes from '../../utils/decorators/withRoutes';
import Image from '../Image';
import Link from '../Link';
import AddToCartButton from '../AddToCartButton';
import { getProductImgUrl } from '../../utils/imgUrl';
import s from './WishlistItem.scss';
import t from './translation.json';
// import FlashDealTimer from '../Product/FlashDealTimer';
// import ColorSwatchSlider from '../Product/ColorSwatchSlider';
import Service from '../../ApiService';
import PriceContainer from '../Product/PriceContainer';
import ProductName from '../Product/ProductName';
import {
  addWishlist,
  fetchWishlist,
  deleteWishlist,
} from '../../reducers/wishlist/actions';
import { withStoreConfig } from '@central-tech/core-ui';
import Col from '../Col';
import Row from '../Row/Row';
import gtmType from '../../constants/gtmType';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

@withStoreConfig
@withLocales(t)
@withStyles(s)
class WishlistItem extends React.PureComponent {
  static propTypes = {
    product: pt.object.isRequired,
    countdown: pt.bool,
    page: pt.number,
    total: pt.number,
  };

  state = {
    flipped: false,
    isConfigurable: false,
    configurableOptions: [],
    activeOption: null,
    configurableChildrens: [],
    activeConfigurableChildren: null,
    isProductHasColorSwatch: null,
    isOutOfStock: false,
  };

  componentDidMount() {
    const { product } = this.props;

    if (product.type_id === 'configurable') {
      this.initialConfigurableProduct();
    }

    this.initialProductStock();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeOption !== this.state.activeOption) {
      this.findActiveChildren();
    }
  }

  initialProductStock = (product = this.props.product) => {
    const stockQty2 = prop(product, 'extension_attributes.stock_item.qty');
    const isInStock2 = prop(
      product,
      'extension_attributes.stock_item.is_in_stock',
    );

    if (stockQty2 > 0 && isInStock2) {
      this.setState({ isOutOfStock: false });
    } else {
      this.setState({ isOutOfStock: true });
    }
  };

  initialConfigurableProduct = async () => {
    const { product } = this.props;

    const configurableOptions = prop(
      product,
      'extension_attributes.configurable_product_options',
    );

    const configurableLink = prop(
      product,
      'extension_attributes.configurable_product_links',
    );

    const { products = {} } = await Service.get('/search/products', {
      entity_id: configurableLink.join(','),
      limit: 99,
      page: 1,
    });

    const isProductHasColorSwatch = find(
      configurableOptions,
      option => option.label === 'Color',
    );

    const defaultActiveOption = this.findFirstChildren(configurableOptions);

    this.setState({
      isConfigurable: true,
      configurableOptions: configurableOptions,
      configurableChildrens: products.products,
      isProductHasColorSwatch: isProductHasColorSwatch,
      activeOption: defaultActiveOption,
    });

    this.findMostDiscountChildren();
  };

  findActiveChildren = () => {
    const {
      activeOption,
      configurableOptions,
      configurableChildrens,
    } = this.state;

    const productIds = map(activeOption, (value_index, attribute_id) => {
      const productForThisOption = find(
        configurableOptions,
        option => option.attribute_id === attribute_id,
      );

      const currentValue = find(
        productForThisOption.values,
        currentValue => currentValue.value_index === value_index,
      );

      const productList = prop(currentValue, 'extension_attributes.products');

      return productList;
    });

    const activeConfigurableID = first(intersection(...productIds));
    const activeConfigurableChildren = find(
      configurableChildrens,
      children => children.id === activeConfigurableID,
    );

    this.initialProductStock(activeConfigurableChildren);

    this.setState({
      activeConfigurableChildren: activeConfigurableChildren,
    });
  };

  findFirstChildren = options => {
    const activeOption = {};

    map(options, option => {
      const firstOption = first(option.values);
      activeOption[option.attribute_id] = firstOption.value_index;
    });

    return activeOption;
  };

  findMostDiscountChildren = () => {
    const { configurableChildrens, configurableOptions } = this.state;

    try {
      let activeProduct;

      map(configurableChildrens, child => {
        const curPrice = prop(child, 'price', 0);
        const specialPrice = child.special_price_option;
        const currentDiscount = curPrice - specialPrice;

        if (activeProduct) {
          const activePrice = activeProduct.price;
          const activeSpecialPrice = activeProduct.special_price_option;
          const activeDiscount = activePrice - activeSpecialPrice;
          if (activeDiscount < currentDiscount) {
            activeProduct = child;
          }
        } else {
          activeProduct = child;
        }
      });

      const optionsMapping = map(configurableOptions, option => {
        const selectedValue = find(option.values, value =>
          value.extension_attributes.products.includes(activeProduct.id),
        );

        return {
          ...option,
          selectedValue: selectedValue,
        };
      });

      const activeOption = {};

      map(optionsMapping, option => {
        const firstOption = option.selectedValue;
        activeOption[option.attribute_id] = firstOption.value_index;
      });

      this.setState({
        activeOption: activeOption,
      });
    } catch (error) {}
  };

  setQuery = query => {
    const { location } = this.props;
    location.push(location.pathname, {
      ...location.queryParams,
      ...query,
    });
  };

  deleteWishlistItem = async () => {
    const { product, page, total, deleteWishlist } = this.props;
    const wishlistId = product.wishlist_id;
    const itemId = product.wishlist_item_id;
    deleteWishlist(wishlistId, itemId, page, 6);
    this.setQuery({
      page: page === Math.ceil((total - 1) / 6) ? page : page - 1,
    });
  };

  handleQuickBuy = () => {
    this.setState({ flipped: true });
    this.props.setFlippedSku(this.props.product.sku);
  };

  toggleFlip = () => {
    this.setState({ flipped: false });
    this.props.setFlippedSku(null);
  };

  handleOptionChange = (attr, value) => {
    this.setState({
      activeOption: {
        ...this.state.activeOption,
        [attr]: value,
      },
    });
  };

  handleNotifyme = (e, product) => {
    e.preventDefault();
    const notifyData = e.target.notify.value;
    return { notifyData, product };
  };

  renderProductDetail = (isBackface = false) => {
    const { product, translate } = this.props;
    const {
      isConfigurable,
      activeConfigurableChildren,
      isOutOfStock,
    } = this.state;
    const activeProduct = activeConfigurableChildren || product;

    const brandData = prop(product, 'extension_attributes.brand', {});
    const noMarketplaceInfo = true;

    const hidePromotionPrice = prop(
      brandData,
      'extension_attributes.hide_product_original_price',
    );
    return (
      <React.Fragment>
        <div className={s.brand}>
          <Link
            id={`lnk-viewBrand-${brandData.brand_id}`}
            to={brandData.url_key}
          >
            {brandData.name}
          </Link>
        </div>
        <div className={s.name}>
          <ProductName
            product={product}
            activeProduct={activeProduct}
            noMarketplaceInfo={noMarketplaceInfo}
          />
        </div>
        {!isBackface ? (
          <div className={s.priceContainer}>
            <PriceContainer
              product={product}
              activeProduct={activeProduct}
              hidePromo={hidePromotionPrice}
              customMessage={isConfigurable && 'From'}
              customDiscountMessage={isConfigurable && '~'}
              classNamePrice={s.fontSizeForPrice}
            />
          </div>
        ) : (
          <div className={s.priceContainer}>
            <PriceContainer
              product={product}
              activeProduct={activeProduct}
              hidePromo={hidePromotionPrice}
              classNamePrice={s.fontSizeForPrice}
            />
          </div>
        )}
        {isOutOfStock && (
          <div className={s.errorMessage}>{translate('soldout')}</div>
        )}
      </React.Fragment>
    );
  };

  renderContent = () => {
    const {
      product,
      translate,
      activeConfig,
      flippedSku,
      countdown,
    } = this.props;
    const {
      isProductHasColorSwatch,
      activeConfigurableChildren,
      isOutOfStock,
      configurableOptions,
    } = this.state;
    const activeProduct = activeConfigurableChildren || product;
    const imageUrl = getProductImgUrl(
      activeProduct.image,
      activeConfig.base_media_url,
    );
    const noMarketplaceInfo = true;
    return (
      <div
        className={cx(s.root, {
          [s.flipped]: flippedSku === product.sku && this.state.flipped,
        })}
      >
        <div className={s.flipper}>
          <div className={s.content}>
            <div className={s.deleteBtn}>
              <IosClose
                id={`btn-removeFlip-${activeProduct.sku}`}
                icon="ios-close"
                fontSize="35px"
                onClick={this.deleteWishlistItem}
              />
            </div>
            <div className={s.contentHoverAble}>
              <Row>
                <Col lg={4} md={5}>
                  <div className={s.imageWrapper}>
                    <div className={s.imageBox}>
                      <Link
                        id={generateElementId(
                          ELEMENT_TYPE.LINK,
                          ELEMENT_ACTION.VIEW,
                          'Product',
                          '',
                          prop(product, 'sku', null),
                        )}
                        to={product.url_key}
                      >
                        {activeProduct.image ? (
                          <Image
                            className={cx(
                              s.image,
                              gtmType.EVENT_TRACK_PRODUCT_CLICK,
                            )}
                            src={imageUrl}
                            product={product}
                            activeProduct={activeProduct}
                            gtmData
                            noMarketplaceInfo={noMarketplaceInfo}
                          />
                        ) : (
                          <Image
                            className={cx(
                              s.image,
                              gtmType.EVENT_TRACK_PRODUCT_CLICK,
                            )}
                            src="/icons/product-img-empty.svg"
                            product={product}
                            activeProduct={activeProduct}
                            gtmData
                            noMarketplaceInfo={noMarketplaceInfo}
                          />
                        )}
                      </Link>
                      <div className={s.additionBadge}>
                        {(prop(product, 'only_central_tag') === '1' &&
                          'ONLY@CENTRAL') ||
                          (prop(product, 'online_exclusive_tag') === '1' &&
                            'Online Exclusive')}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={8} md={7}>
                  <div className={s.productDetails}>
                    {this.renderProductDetail()}
                  </div>
                  <div className={cx(s.buttonGroup, s.desktopItem)}>
                    {!isEmpty(configurableOptions) ? (
                      <Link
                        id={`btn-viewProduct-${product.sku}`}
                        className={cx(
                          s.button,
                          gtmType.EVENT_TRACK_PRODUCT_CLICK,
                        )}
                        to={product.url_key}
                        product={product}
                        activeProduct={activeProduct}
                        gtmData
                        noMarketplaceInfo={noMarketplaceInfo}
                      >
                        <span>{translate('view_detail')}</span>
                        <span className={cx(s.icon, s.forward)}>
                          <IosArrowForward
                            icon="ios-arrow-forward"
                            fontSize="16px"
                          />
                        </span>
                      </Link>
                    ) : (
                      <React.Fragment>
                        {!isOutOfStock && (
                          <React.Fragment>
                            <AddToCartButton
                              id={`btn-addCart-${activeProduct.sku}`}
                              wrapperClassName={cx(
                                s.addToCartWrapper,
                                s.desktop,
                              )}
                              product={activeProduct}
                              messageOther
                            />
                            <AddToCartButton
                              id={`btn-addCart-${activeProduct.sku}`}
                              wrapperClassName={cx(
                                s.addToCartWrapper,
                                s.mobile,
                              )}
                              product={activeProduct}
                            />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </Col>
                <Col md={12} className={s.mobileItem}>
                  <div className={s.buttonGroup}>
                    {!isEmpty(configurableOptions) ? (
                      <Link
                        id={`btn-viewProduct-${product.sku}`}
                        className={cx(
                          s.button,
                          gtmType.EVENT_TRACK_PRODUCT_CLICK,
                        )}
                        to={product.url_key}
                        product={product}
                        activeProduct={activeProduct}
                        gtmData
                        noMarketplaceInfo={noMarketplaceInfo}
                      >
                        <span>{translate('view_detail')}</span>
                        <span className={cx(s.icon, s.forward)}>
                          <IosArrowForward
                            icon="ios-arrow-forward"
                            fontSize="16px"
                          />
                        </span>
                      </Link>
                    ) : (
                      <React.Fragment>
                        {/* {isOutOfStock ? (
                          <div className={s.errorMessage}>
                            {translate('soldout')}
                          </div>
                        ) : ( */}
                        {!isOutOfStock && (
                          <React.Fragment>
                            <AddToCartButton
                              id={`btn-addCart-${activeProduct.sku}`}
                              wrapperClassName={cx(
                                s.addToCartWrapper,
                                s.desktop,
                              )}
                              product={activeProduct}
                              messageOther
                            />
                            <AddToCartButton
                              id={`btn-addCart-${activeProduct.sku}`}
                              wrapperClassName={cx(
                                s.addToCartWrapper,
                                s.mobile,
                              )}
                              product={activeProduct}
                            />
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </Col>
              </Row>
              {isProductHasColorSwatch && (
                <div className={s.colorCount}>
                  {isProductHasColorSwatch.values.length} {translate('colors')}
                </div>
              )}
            </div>
            <div
              className={cx(s.additionContent, {
                [s.show]: countdown || isProductHasColorSwatch,
              })}
            >
              {/*{countdown && (*/}
              {/*  <FlashDealTimer*/}
              {/*    product={product}*/}
              {/*    activeProduct={activeProduct}*/}
              {/*  />*/}
              {/*)}*/}
              {/*{isProductHasColorSwatch && (*/}
              {/*  <ColorSwatchSlider*/}
              {/*    attributeId={isProductHasColorSwatch.attribute_id}*/}
              {/*    label={isProductHasColorSwatch.label}*/}
              {/*    items={isProductHasColorSwatch.values}*/}
              {/*    onColorClick={this.handleOptionChange}*/}
              {/*    activeValue={*/}
              {/*      this.state.activeOption[*/}
              {/*        isProductHasColorSwatch.attribute_id*/}
              {/*      ]*/}
              {/*    }*/}
              {/*  />*/}
              {/*)}*/}
            </div>
          </div>
          <div className={s.backfaceContent}>
            <div className={s.closeBtn}>
              {translate('close')}
              <IosClose
                id={`btn-removeFlip-${activeProduct.sku}`}
                icon="ios-close"
                fontSize="35px"
                onClick={this.toggleFlip}
              />
            </div>
            <div className={s.backfaceDetail}>
              {this.renderProductDetail('backFace')}
            </div>
            <div>
              {isOutOfStock ? (
                <React.Fragment>
                  <div className={s.errorMessage}>{translate('soldout')}</div>
                </React.Fragment>
              ) : (
                <AddToCartButton
                  id={`btn-addCart-${activeProduct.sku}`}
                  wrapperClassName={s.addToCartWrapper}
                  product={activeProduct}
                  messageOther
                />
              )}

              <div className={s.buttonGroup}>
                <Link
                  id={`btn-viewProduct-${product.sku}`}
                  className={cx(s.button, gtmType.EVENT_TRACK_PRODUCT_CLICK)}
                  to={product.url_key}
                  product={product}
                  activeProduct={activeProduct}
                  gtmData
                  noMarketplaceInfo={noMarketplaceInfo}
                >
                  <span>{translate('view_detail')}</span>
                  <span className={cx(s.icon, s.forward)}>
                    <IosArrowForward icon="ios-arrow-forward" fontSize="16px" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { product } = this.props;

    if (!product) {
      return null;
    }

    return (
      <div className={cx(this.props.className, s.wrapper)}>
        {this.renderContent()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  flippedSku: state.product.flippedSku,
  wishlistGroups: state.wishlistGroup.wishlistGroups,
  customer: state.customer.customer,
});

const mapDispatchToProps = dispatch => ({
  fetchProductAttributes: sku => dispatch(fetchProductAttributes(sku)),
  setFlippedSku: sku => dispatch(setFlippedSku(sku)),
  fetchWishlist: (groupId, itemId) =>
    dispatch(fetchWishlist({ wishlist_id: groupId, product_id: itemId })),
  addWishlist: (groupId, itemId) => dispatch(addWishlist(groupId, itemId)),
  deleteWishlist: (groupId, itemId, page, limit) =>
    dispatch(deleteWishlist(groupId, itemId, page, limit)),
});

export default compose(
  withRoutes,
  connect(mapStateToProps, mapDispatchToProps),
)(WishlistItem);
