import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import pt from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { noop, omit, get as prop, isUndefined } from 'lodash';
import history from '../../history';
import languages from '../../constants/languages';
import { resolveUrl } from '../../utils/url';
import s from './Link.scss';
import moment from 'moment';
import { formatPrice } from '../../utils/gtm/formatPrice';
// import { categoryRoot } from '../../utils/gtm/categoryRoot';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.PureComponent {
  static propTypes = {
    to: pt.string,
    children: pt.node,
    className: pt.string,
    onClick: pt.func,
    native: pt.bool,
    external: pt.bool,
    target: pt.string,
    gtmData: pt.bool,
    schema: pt.string,
  };

  static defaultProps = {
    onClick: noop,
    native: true,
    external: false,
    schema: '',
    className: '',
  };

  UNSAFE_componentWillMount() {
    this.setTo();
  }

  componentWillReceiveProps(nextProps) {
    this.setTo(nextProps);
  }

  setTo = (props = this.props) => {
    let { to } = props;
    if (to && !props.external) {
      if (props.lang === languages.en) {
        to = resolveUrl('/en', to);
      } else if (props.lang === languages.th) {
        to = resolveUrl('/th', to);
      }
    }
    this.setState({ to });
  };

  handleClick = event => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (event.defaultPrevented === true) {
      return;
    }

    event.preventDefault();
    history.push(this.state.to);
  };

  render() {
    const {
      children,
      className,
      gtmData,
      product,
      native,
      target,
      activeProduct,
      schema,
      ...props
    } = this.props;
    const { to } = this.state;

    const brandName =
      activeProduct && !isUndefined(activeProduct.brand_name_option)
        ? prop(activeProduct, 'brand_name_option')
        : prop(activeProduct, 'brand_name');
    const productPrice =
      activeProduct && !isUndefined(activeProduct.special_price)
        ? formatPrice(prop(activeProduct, 'special_price'))
        : formatPrice(prop(activeProduct, 'price'));
    const productDiscount =
      activeProduct && !isUndefined(activeProduct.special_price)
        ? formatPrice(activeProduct.price - activeProduct.special_price)
        : '0.0';
    const stockQty = prop(activeProduct, 'extension_attributes.stock_item.qty');
    const checkStock = stockQty > 0 ? 'In Stock' : 'Out Of Stock';
    const dateTimeNow = moment().format('YYYY-MM-DD H:m:s');
    const rootCategory = '';
    const category_paths = rootCategory ? rootCategory.join('/') : '';

    let schemaAttr = {};

    if (schema !== '') {
      schemaAttr = {
        itemType: 'https://schema.org/Thing',
        itemProp: 'item',
      };
    }

    if (gtmData) {
      return (
        <a
          {...omit(props, 'dispatch', 'external')}
          className={cx(s.link, className)}
          href={to}
          onClick={native ? null : this.handleClick}
          target={target}
          data-product-name={prop(activeProduct, 'name')}
          data-product-list={prop(product, 'url_key')}
          data-pid={prop(activeProduct, 'sku')}
          data-product-id={prop(activeProduct, 'sku')}
          data-product-price={productPrice}
          data-product-category={category_paths}
          data-product-brand={brandName}
          data-product-position={1}
          data-dimension21={checkStock}
          data-dimension38={formatPrice(prop(activeProduct, 'price'))}
          data-dimension39={productDiscount}
          hit_timestamp={dateTimeNow}
          {...schemaAttr}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <a
        {...omit(props, 'dispatch', 'external')}
        className={cx(s.link, className)}
        href={to}
        onClick={native ? null : this.handleClick}
        target={target}
        {...schemaAttr}
        {...props}
      >
        {children}
      </a>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.locale.lang,
});

export default compose(connect(mapStateToProps), withStyles(s))(Link);
