import React, { Fragment } from 'react';
import pt from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { get as prop, isEmpty, range, map, isUndefined } from 'lodash';
// import Ionicon from 'react-ionicons';
import { changeItemQty } from '../../reducers/cart/actions';
import withLocales from '../../utils/decorators/withLocales';
import { getProductImgUrl } from '../../utils/imgUrl';
import { deleteItem } from '../../reducers/cart/actions';
import ReactTooltip from 'react-tooltip';
import Image from '../Image';
import Price from '../Price';
import Link from '../Link';
import Row from '../Row';
import Col from '../Col';
// import IconCheckMark from '../Icons/CheckMark';
import SelectDefault from '../Select/SelectDefault';
import AddToWishlist from '../AddToWishlist/AddToWishlist';
import CartFreeGift from '../Cart/CartFreeGift';
import s from './CartItem.scss';
import t from './translation.json';
import { checkDate, fullDate } from '../../utils/date';
import gtmType from '../../constants/gtmType';
import moment from 'moment';
import { formatPrice } from '../../utils/gtm/formatPrice';
// import { categoryRoot } from '../../utils/gtm/categoryRoot';
import { withStoreConfig } from '@central-tech/core-ui';

@withStoreConfig
@withLocales(t)
@withStyles(s)
class CartItem extends React.PureComponent {
  static propTypes = {
    item: pt.object.isRequired,
  };

  state = {
    isItemCanPayByInstallment: false,
  };

  componentDidMount() {
    const installmentPlans = prop(
      this.props.item,
      'extension_attributes.installment_plans',
      [],
    );
    this.setState({
      isItemCanPayByInstallment: installmentPlans.length > 0,
    });
  }

  getProductImgUrl = () =>
    getProductImgUrl(
      this.props.item.image,
      this.props.activeConfig.base_media_url,
    );

  handleCounterChange = qty => {
    if (qty === 0) {
      return;
    }

    const { changeItemQty, item } = this.props;
    changeItemQty(item.sku, qty.value);
  };

  handleDeleteClick = () => {
    const { item, deleteItem } = this.props;

    deleteItem(item.item_id);
  };

  renderChangeSizeAttr = () => {
    //console.log(`${item.size_type} ${item.size_option}`);
    // return (
    //   <SelectDefault
    //     id={`sel-changeSizeAttr-${this.props.item.sku}`}
    //     value={item.size_option}
    //     options={item}
    //   />
    // );
  };

  renderQtyDesktop = select_options => (
    <SelectDefault
      id={`sel-addQty-${this.props.item.sku}`}
      className={cx(s.counterQty, s.displayDesktop, {
        [s.disabled]: isEmpty(select_options),
      })}
      panelClassName={s.selectPanel}
      optionClassName={s.selectOption}
      value={this.props.item.qty}
      options={select_options}
      onChange={this.handleCounterChange}
      showActiveOption
      isDisable={isEmpty(select_options)}
    />
  );

  renderQtyMobile = select_options => (
    <div
      className={cx(s.selectContainer, s.displayMobile, {
        [s.disabled]: isEmpty(select_options),
      })}
    >
      <select
        id={`sel-addQty-${this.props.item.sku}`}
        className={s.inputField}
        onChange={val => this.handleCounterChange({ value: val.target.value })}
        value={this.props.item.qty}
        disabled={isEmpty(select_options)}
      >
        {map(select_options, val => (
          <option key={val.key} value={val.value}>
            {val.value}
          </option>
        ))}
        {(this.props.item.qty > 10 || isEmpty(select_options)) && (
          <option value={this.props.item.qty}>{this.props.item.qty}</option>
        )}
        }
      </select>

      <span className={s.arrowRight}>
        {/*<Ionicon icon="ios-arrow-down" fontSize="16px" color="#333333" />*/}
        Ionicon
      </span>
    </div>
  );

  renderQty = () => {
    const { item, disabled } = this.props;
    const stockQty = prop(item, 'extension_attributes.stock_item', {});
    const stockMaxQty = stockQty.max_sale_qty || stockQty.qty;
    const maxQty = stockMaxQty < 10 ? stockMaxQty : stockMaxQty === 0 ? 0 : 10;

    // const select_options = times(maxQty, qty => ({
    //   key: qty + 1,
    //   value: qty + 1,
    // }));
    const select_options = map(
      range(stockQty.min_sale_qty - 1, maxQty),
      qty => ({
        key: qty + 1,
        value: qty + 1,
      }),
    );
    return (
      <React.Fragment>
        {!disabled && this.renderQtyDesktop(select_options)}
        {!disabled && this.renderQtyMobile(select_options)}
        {disabled && <div className={s.fixedQty}>{item.qty}</div>}
      </React.Fragment>
    );
  };

  renderDesktop() {
    const { isItemCanPayByInstallment } = this.state;
    const {
      item,
      translate,
      disabled,
      wishlist,
      isFreegift,
      activeConfig,
    } = this.props;
    const imageUrl = this.getProductImgUrl();
    const brandData = prop(item, 'extension_attributes.brand', {});
    const stockQty = prop(item, 'extension_attributes.stock_item', {});
    const brandName =
      item && !isUndefined(item.brand_name_option)
        ? prop(item, 'brand_name_option')
        : prop(item, 'brand_name');
    const productPrice =
      item && !isUndefined(item.special_price)
        ? formatPrice(prop(item, 'special_price'))
        : formatPrice(prop(item, 'price_incl_tax'));
    const productDiscount =
      item && !isUndefined(item.special_price)
        ? formatPrice(item.original_price - item.special_price)
        : '0.00';
    const productStockQty = prop(item, 'extension_attributes.stock_item.qty');
    const checkStock = productStockQty > 0 ? 'In Stock' : 'Out Of Stock';
    const dateTimeNow = moment().format('YYYY-MM-DD H:m:s');
    const specialPriceValid =
      item.special_price &&
      item.original_price - item.special_price > 0 &&
      checkDate(item.special_from_date, item.special_to_date);
    // const categoryData = prop(item, 'extension_attributes.category_paths');
    // const rootCategory = map(categoryRoot(categoryData), cat =>
    //   prop(cat, 'name'),
    // );

    const rootCategory = {};
    const category_paths =
      rootCategory.lenght > 0 ? rootCategory.join('/') : '';

    return (
      <div className={s.desktop}>
        <Row className={s.desktopRow}>
          <div className={s.imgItemCart}>
            <Link
              id={`lnk-viewProduct-${item.sku}`}
              className={s.linkImage}
              to={item.url_key}
              title={item.name}
              native
            >
              {item.image && item.image !== 'no_selection' ? (
                <Image
                  className={cx(s.image, gtmType.EVENT_TRACK_PRODUCT_CLICK)}
                  src={imageUrl}
                  gtmData
                  product={item}
                  activeProduct={item}
                />
              ) : (
                <Image
                  className={cx(s.image, gtmType.EVENT_TRACK_PRODUCT_CLICK)}
                  src="/icons/product-img-empty.svg"
                  gtmData
                  product={item}
                  activeProduct={item}
                />
              )}
            </Link>
          </div>
          <Col lg={10} className={s.content}>
            <Row className={s.row}>
              <Col lg={7} className={s.description}>
                {item.brand_name_option && (
                  <Link
                    id={`lnk-viewBrand-${brandData.brand_id}`}
                    to={brandData.url_key}
                    native
                  >
                    <div className={s.brand}>{item.brand_name_option}</div>
                  </Link>
                )}
                <Link
                  className={s.productName}
                  id={`lnk-viewProduct-${item.sku}`}
                  to={item.url_key}
                  title={item.name}
                  data-sku-config={prop(
                    item,
                    'extension_attributes.parent_sku',
                  )}
                  native
                >
                  <label
                    className={gtmType.EVENT_TRACK_PRODUCT_CLICK}
                    data-product-name={prop(item, 'name')}
                    data-product-list={prop(item, 'url_key')}
                    data-product-id={prop(item, 'sku')}
                    data-product-price={productPrice}
                    data-product-category={category_paths}
                    data-product-brand={brandName}
                    data-product-position={1}
                    data-dimension21={checkStock}
                    data-dimension38={formatPrice(prop(item, 'original_price'))}
                    data-dimension39={productDiscount}
                    hit_timestamp={dateTimeNow}
                  >
                    {item.name}
                  </label>
                </Link>
                {!isEmpty(item.color_shade_option) &&
                  item.color_shade_option !== 'None' && (
                    <label className={s.productOptions}>
                      {`${item.color_shade_option}`}
                    </label>
                  )}
                {/*{!isEmpty(item.size_option) &&*/}
                {/*  !isEmpty(item.size_type) &&*/}
                {/*  this.renderChangeSizeAttr(item)}*/}
                {!isFreegift && (
                  <label
                    className={cx(s.soldOutLabel, {
                      [s.showLabel]: stockQty.qty > 0,
                    })}
                  >
                    {translate('out_of_stock')}
                  </label>
                )}
              </Col>
              <Col lg={1} className={s.counterWrapper}>
                {this.renderQty()}
                {!disabled && (
                  <div
                    id={`btn-removeCart-${item.sku}`}
                    className={s.remove}
                    onClick={this.handleDeleteClick}
                  >
                    {translate('remove')}
                  </div>
                )}
              </Col>
              <Col lg={2} className={s.priceWrapper}>
                <Price
                  size="large"
                  digit={2}
                  format
                  price={
                    specialPriceValid ? item.special_price : item.original_price
                  }
                  className={s.priceClass}
                  color="gray"
                />
                {specialPriceValid && (
                  <span className={s.discountCount}>
                    {`${translate('save')} `}
                    <Price
                      className={s.specialPrice}
                      digit={2}
                      format
                      price={item.original_price - item.special_price}
                      color="#333333"
                      size="small"
                    />
                  </span>
                )}
              </Col>
              <Col lg={2} className={s.totalPriceWrapper}>
                <Price
                  size="x-large"
                  digit={2}
                  format
                  price={item.row_total_incl_tax}
                  bold
                  freeMessage
                />
              </Col>
            </Row>
            <Row className={s.controls}>
              {prop(item, 'product_sell_type') &&
                prop(item, 'preorder_shipping_date') &&
                checkDate(null, prop(item, 'preorder_shipping_date')) && (
                  <div className={s.preOrder}>
                    {translate('preOrder', {
                      preorder_date: fullDate(
                        prop(item, 'preorder_shipping_date'),
                        activeConfig.locale.slice(0, 2),
                      ),
                    })}
                  </div>
                )}
              <div className={s.offerOptions}>
                {Boolean(+item.allow_cc) && (
                  <Fragment>
                    <p className={s.allowAttr} data-tip data-for="allow_cc">
                      IconCheckMark
                      <label className={s.allow_attr}>
                        {translate('click_collect')}
                      </label>
                    </p>
                    <ReactTooltip
                      id="allow_cc"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.click_collect')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
                {Boolean(+item.allow_gift_wrapping) && (
                  <Fragment>
                    <p
                      className={s.allowAttr}
                      data-tip
                      data-for="allow_gift_wrapping"
                    >
                      IconCheckMark
                      <label className={s.allow_attr}>
                        {translate('gift_wrapping')}
                      </label>
                    </p>
                    <ReactTooltip
                      id="allow_gift_wrapping"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.gift_wrapping')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
                {Boolean(+item.allow_cod) && (
                  <Fragment>
                    <p className={s.allowAttr} data-tip data-for="allow_cod">
                      IconCheckMark
                      <label className={s.allow_attr}>
                        {translate('pay_on_delivery')}
                      </label>
                    </p>
                    <ReactTooltip
                      id="allow_cod"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.pay_on_delivery')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
                {isItemCanPayByInstallment && (
                  <Fragment>
                    <p
                      className={s.allowAttr}
                      data-tip
                      data-for="allow_installment"
                    >
                      IconCheckMark
                      <label className={s.allow_attr}>
                        {translate('pay_by_installment')}
                      </label>
                    </p>
                    <ReactTooltip
                      id="allow_installment"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.pay_by_installment')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
              </div>
              <div className={s.addToWishlist}>
                {!disabled && (
                  <AddToWishlist
                    className={s.addWishlist}
                    product={item}
                    classNameCart={s.hideIcon}
                    isFullWishlistText
                    wishlist={wishlist}
                  />
                )}
              </div>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  renderMobile = () => {
    const { isItemCanPayByInstallment } = this.state;
    const { item, wishlist, translate, isFreegift, activeConfig } = this.props;
    const imageUrl = this.getProductImgUrl();
    const brandData = prop(item, 'extension_attributes.brand', {});
    const stockQty = prop(item, 'extension_attributes.stock_item', {});
    const brandName =
      item && !isUndefined(item.brand_name_option)
        ? prop(item, 'brand_name_option')
        : prop(item, 'brand_name');
    const productPrice =
      item && !isUndefined(item.special_price)
        ? formatPrice(prop(item, 'special_price'))
        : formatPrice(prop(item, 'original_price'));
    const productDiscount =
      item && !isUndefined(item.special_price)
        ? formatPrice(item.original_price - item.special_price)
        : '0.0';
    const productStockQty = prop(item, 'extension_attributes.stock_item.qty');
    const checkStock = productStockQty > 0 ? 'In Stock' : 'Out Of Stock';
    const dateTimeNow = moment().format('YYYY-MM-DD H:m:s');
    const specialPriceValid =
      item.special_price &&
      item.original_price - item.special_price > 0 &&
      checkDate(item.special_from_date, item.special_to_date);
    // const categoryData = prop(item, 'extension_attributes.category_paths');
    // const rootCategory = map(categoryRoot(categoryData), cat =>
    //   prop(cat, 'name'),
    // );
    const rootCategory = {};
    const category_paths =
      rootCategory.lenght > 0 ? rootCategory.join('/') : '';
    return (
      <Row className={s.mobile}>
        <div className={s.imageWrapper}>
          {item.image && item.image !== 'no_selection' ? (
            <Image
              className={cx(s.image, gtmType.EVENT_TRACK_PRODUCT_CLICK)}
              src={imageUrl}
              gtmData
              product={item}
              activeProduct={item}
            />
          ) : (
            <Image
              className={cx(s.image, gtmType.EVENT_TRACK_PRODUCT_CLICK)}
              src="/icons/product-img-empty.svg"
              gtmData
              product={item}
              activeProduct={item}
            />
          )}
        </div>
        <div className={s.descriptionMobile}>
          <div>
            <Col md={12} className={s.description}>
              {item.brand_name_option && (
                <Link
                  id={`lnk-viewBrand-${brandData.brand_id}`}
                  to={brandData.url_key}
                  native
                >
                  <div className={s.brand}>{item.brand_name_option}</div>
                </Link>
              )}
              <label
                className={cx(s.productName, gtmType.EVENT_TRACK_PRODUCT_CLICK)}
                data-product-name={prop(item, 'name')}
                data-product-list={prop(item, 'url_key')}
                data-product-id={prop(item, 'sku')}
                data-product-price={productPrice}
                data-product-category={category_paths}
                data-product-brand={brandName}
                data-product-position={1}
                data-dimension21={checkStock}
                data-dimension38={formatPrice(prop(item, 'original_price'))}
                data-dimension39={productDiscount}
                hit_timestamp={dateTimeNow}
              >
                {item.name}
              </label>
              <label className={s.options}>
                {!isEmpty(item.color_option)
                  ? `${item.color_option}, ${item.size_option}`
                  : item.size_option}
              </label>
              {!isFreegift && (
                <label
                  className={cx(s.soldOutLabel, {
                    [s.showLabel]: stockQty.qty > 0,
                  })}
                >
                  {translate('out_of_stock')}
                  mobile
                </label>
              )}
            </Col>
            <Row className={s.priceInfoMobile}>
              <Price
                size="tiny"
                digit={2}
                format
                price={
                  !isEmpty(specialPriceValid)
                    ? item.special_price
                    : item.original_price
                }
                color="gray"
              />
              <div className={s.qtyWrapper}>
                <Price
                  className={s.rowTotal}
                  digit={2}
                  format
                  price={item.row_total_incl_tax}
                  bold
                />
                {this.renderQty()}
              </div>
            </Row>
            <Row className={s.controls}>
              {prop(item, 'product_sell_type') &&
                prop(item, 'preorder_shipping_date') &&
                checkDate(null, prop(item, 'preorder_shipping_date')) && (
                  <div className={s.preOrder}>
                    {translate('preOrder', {
                      preorder_date: fullDate(
                        prop(item, 'preorder_shipping_date'),
                        activeConfig.locale.slice(0, 2),
                      ),
                    })}
                  </div>
                )}
              <div className={s.offerOptions}>
                {Boolean(+item.allow_cc) && (
                  <Fragment>
                    <p className={s.allowAttr} data-tip data-for="allow_cc">
                      <Image
                        className={s.iconCheckmark}
                        width="8"
                        src="/icons/ic-check-black.png"
                      />
                      <Image
                        className={s.iconCheckmark}
                        height="17"
                        src="/icons/store-pickup.svg"
                      />
                    </p>
                    <ReactTooltip
                      id="allow_cc"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.click_collect')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
                {Boolean(+item.allow_gift_wrapping) && (
                  <Fragment>
                    <p
                      className={s.allowAttr}
                      data-tip
                      data-for="allow_gift_wrapping"
                    >
                      <Image
                        className={s.iconCheckmark}
                        width="8"
                        src="/icons/ic-check-black.png"
                      />
                      <Image
                        className={s.iconCheckmark}
                        height="17"
                        src="/icons/gift-wrap.svg"
                      />
                    </p>
                    <ReactTooltip
                      id="allow_gift_wrapping"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.gift_wrapping')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
                {Boolean(+item.allow_cod) && (
                  <Fragment>
                    <p className={s.allowAttr} data-tip data-for="allow_cod">
                      <Image
                        className={s.iconCheckmark}
                        width="8"
                        src="/icons/ic-check-black.png"
                      />
                      <Image
                        className={s.iconCheckmark}
                        height="17"
                        src="/icons/pod.svg"
                      />
                    </p>
                    <ReactTooltip
                      id="allow_cod"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.pay_on_delivery')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
                {Boolean(isItemCanPayByInstallment) && (
                  <Fragment>
                    <p
                      className={s.allowAttr}
                      data-tip
                      data-for="allow_installment_mobile"
                    >
                      <Image
                        className={s.iconCheckmark}
                        width="8"
                        src="/icons/ic-check-black.png"
                      />
                      <Image
                        className={s.iconCheckmark}
                        height="17"
                        src="/icons/installment-pay.svg"
                      />
                    </p>
                    <ReactTooltip
                      id="allow_installment_mobile"
                      type="light"
                      effect="solid"
                      className={s.tooltip}
                    >
                      <div>{translate('tooltip.pay_by_installment')}</div>
                    </ReactTooltip>
                  </Fragment>
                )}
              </div>
            </Row>
          </div>
          <Row>
            <div className={s.buttonGroupMobile}>
              <div
                id={`btn-removeCart-${item.sku}`}
                className={s.remove}
                onClick={this.handleDeleteClick}
              >
                {translate('remove')}
              </div>
              <AddToWishlist
                className={s.addWishlist}
                product={item}
                classNameCart={s.hideIcon}
                isFullWishlistText
                wishlist={wishlist}
              />
            </div>
          </Row>
        </div>
      </Row>
    );
  };

  render() {
    const { item, disabled } = this.props;
    const freebieAdded = prop(item, 'extension_attributes.free_items_added');
    return (
      <div className={cx(s.contentWrapper, { [s.disabledItem]: disabled })}>
        {this.renderDesktop()}
        {this.renderMobile()}

        <div className={s.freebieDetail}>
          <CartFreeGift freeItems={freebieAdded} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  wishlist: state.wishlist.wishlist,
});

const mapDispatchToProps = dispatch => ({
  changeItemQty: (sku, qty) => dispatch(changeItemQty(sku, qty)),
  deleteItem: itemId => dispatch(deleteItem(itemId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
