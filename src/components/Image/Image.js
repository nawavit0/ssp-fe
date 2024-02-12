import React from 'react';
import styled from 'styled-components';
import pt from 'prop-types';
import { noop, get as prop, isUndefined } from 'lodash';
import moment from 'moment';
import { formatPrice } from '../../utils/gtm/formatPrice';
// import { categoryRoot } from '../../utils/gtm/categoryRoot';

// const CLOUDINARY_KEY = 'djkoqtdtq';
const ImageStyled = styled.img`
  max-width: 100%;
  ${props => (props.customStyle ? props.customStyle : '')}
`;
class Image extends React.PureComponent {
  static propTypes = {
    id: pt.string,
    src: pt.string.isRequired,
    className: pt.string,
    alt: pt.string,
    onClick: pt.func,
    width: pt.string,
    height: pt.string,
    maxHeight: pt.string,
    srcSet: pt.string,
    optimize: pt.bool,
    // resizeWidth: pt.number,
    gtmData: pt.bool,
    opacity: pt.number,
    customStyle: pt.string,
  };

  static defaultProps = {
    onClick: noop,
    width: 'auto',
    height: 'auto',
    maxHeight: 'auto',
    optimize: false,
    // resizeWidth: 400,
    opacity: 1,
    customStyle: '',
  };

  render() {
    const {
      id,
      className,
      src,
      alt,
      onClick,
      width,
      height,
      maxHeight,
      srcSet,
      optimize,
      // resizeWidth,
      product,
      activeProduct,
      gtmData,
      opacity,
      customStyle,
    } = this.props;
    const productName =
      activeProduct && !isUndefined(activeProduct.name)
        ? prop(activeProduct, 'name')
        : prop(activeProduct, 'title');
    const brandName =
      activeProduct && !isUndefined(activeProduct.brand_name_option)
        ? prop(activeProduct, 'brand_name_option')
        : prop(activeProduct, 'brand_name');
    const originalPrice =
      activeProduct && !isUndefined(activeProduct.original_price)
        ? formatPrice(prop(activeProduct, 'original_price'))
        : formatPrice(prop(activeProduct, 'price'));
    const productPrice =
      activeProduct && !isUndefined(activeProduct.special_price)
        ? formatPrice(prop(activeProduct, 'special_price'))
        : activeProduct && !isUndefined(activeProduct.final_price)
        ? formatPrice(prop(activeProduct, 'final_price'))
        : originalPrice;
    const productDiscount =
      activeProduct && !isUndefined(activeProduct.special_price)
        ? formatPrice(originalPrice - activeProduct.special_price)
        : activeProduct && !isUndefined(activeProduct.final_price)
        ? formatPrice(originalPrice - activeProduct.final_price)
        : '0.00';
    const productList =
      activeProduct && !isUndefined(product.url_key)
        ? prop(product, 'url_key')
        : prop(product, 'url');
    const stockQty =
      prop(activeProduct, 'extension_attributes.stock_item.qty') ||
      prop(activeProduct, 'count');
    const checkStock = stockQty > 0 ? 'In Stock' : 'Out Of Stock';
    const dateTimeNow = moment().format('YYYY-MM-DD H:m:s');
    // const categoryData = prop(
    //   activeProduct,
    //   'extension_attributes.category_paths',
    // );
    // const rootCategory = map(categoryRoot(categoryData), cat =>
    //   prop(cat, 'name'),
    // );
    // const rootCategory = {};
    const category_paths = ''; //rootCategory.join('/');
    if (optimize) {
      if (gtmData) {
        return (
          <ImageStyled
            id={id}
            className={className}
            // src={`https://res.cloudinary.com/${CLOUDINARY_KEY}/image/fetch/c_scale,q_auto,w_${resizeWidth}/${src}`}
            src={src}
            alt={alt}
            onClick={onClick}
            width={width}
            height={height}
            style={{ maxHeight: [maxHeight], opacity: opacity }}
            srcSet={srcSet}
            data-product-name={productName}
            data-product-list={productList}
            data-product-id={prop(activeProduct, 'sku')}
            data-pid={prop(activeProduct, 'sku')}
            data-product-price={productPrice}
            data-product-category={category_paths}
            data-product-brand={brandName}
            data-product-position={1}
            data-dimension21={checkStock}
            data-dimension38={originalPrice}
            data-dimension39={productDiscount}
            hit_timestamp={dateTimeNow}
            customStyle={customStyle}
          />
        );
      }

      return (
        <ImageStyled
          id={id}
          className={className}
          // src={`https://res.cloudinary.com/${CLOUDINARY_KEY}/image/fetch/c_scale,q_auto,w_${resizeWidth}/${src}`}
          src={src}
          alt={alt}
          onClick={onClick}
          width={width}
          height={height}
          style={{ maxHeight: [maxHeight], opacity: opacity }}
          srcSet={srcSet}
          customStyle={customStyle}
        />
      );
    }

    if (gtmData) {
      return (
        <ImageStyled
          id={id}
          className={className}
          src={src}
          alt={alt}
          onClick={onClick}
          width={width}
          height={height}
          style={{ maxHeight: [maxHeight], opacity: opacity }}
          srcSet={srcSet}
          data-product-name={productName}
          data-product-list={productList}
          data-pid={prop(activeProduct, 'sku')}
          data-product-id={prop(activeProduct, 'sku')}
          data-product-price={productPrice}
          data-product-category={category_paths}
          data-product-brand={brandName}
          data-product-position={1}
          data-dimension21={checkStock}
          data-dimension38={originalPrice}
          data-dimension39={productDiscount}
          hit_timestamp={dateTimeNow}
          customStyle={customStyle}
        />
      );
    }

    return (
      <ImageStyled
        id={id}
        className={className}
        src={src}
        alt={alt}
        onClick={onClick}
        width={width}
        height={height}
        style={{ maxHeight: [maxHeight], opacity: opacity }}
        srcSet={srcSet}
        customStyle={customStyle}
      />
    );
  }
}

export default Image;
