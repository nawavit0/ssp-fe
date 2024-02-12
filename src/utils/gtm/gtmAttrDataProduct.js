import { get as prop, map, isUndefined } from 'lodash';
import { marketPlaceName, marketPlaceType } from './marketPlace';
// import { categoryRoot, categoryRootID } from './categoryRoot';
import { formatPrice } from './formatPrice';
import moment from 'moment';
export function gtmAttrDataProduct(
  product,
  isEnableMarketplace,
  noMarketplaceInfo,
  searchSuggestionProduct,
  isEnableGraphql,
  positionElementID,
  positionProduct,
  langCode,
) {
  if (isEnableGraphql) {
    return gtmAttrDataProductGraphQL(
      product,
      isEnableMarketplace,
      noMarketplaceInfo,
      searchSuggestionProduct,
      positionElementID,
      positionProduct,
      langCode,
    );
  }
  let tempProductPrice = prop(product, 'price');
  const productSpecialPrice = prop(product, 'special_price');
  const productPriceInclTax = prop(product, 'price_incl_tax');
  if (productSpecialPrice) {
    tempProductPrice = productSpecialPrice;
  } else if (productPriceInclTax) {
    tempProductPrice = productPriceInclTax;
  }
  const productPrice = formatPrice(tempProductPrice);
  const productBrand = !isUndefined(product.brand_name_option)
    ? prop(product, 'brand_name_option')
    : prop(product, 'brand_name');
  const stockQty = prop(product, 'extension_attributes.stock_item.qty', 0);
  const isSearchSuggestionProduct =
    searchSuggestionProduct && !isUndefined(searchSuggestionProduct);
  let tempProductStock = 'Out Of Stock';
  if (isSearchSuggestionProduct || stockQty > 0) {
    tempProductStock = 'In Stock';
  }
  const productStockStatus = tempProductStock;
  const dateTimeNow = moment().format('YYYY-MM-DD H:m:s');
  const categoryData = prop(product, 'extension_attributes.category_paths');
  // const rootCategory = map(categoryRoot(categoryData), cat =>
  //   prop(cat, 'name'),
  // );
  const rootCategory = {};
  const category_paths = rootCategory.join('/');
  const normal_selling_price = !isUndefined(product.original_price)
    ? formatPrice(prop(product, 'original_price'))
    : formatPrice(prop(product, 'price'));
  const productDiscount = prop(product, 'special_price')
    ? formatPrice(normal_selling_price - product.special_price)
    : '0.00';
  const productName = !isUndefined(product.title)
    ? prop(product, 'title')
    : prop(product, 'name');
  const prodList = positionElementID
    ? `/${langCode}#${positionElementID}`
    : prop(product, 'url_key');
  const dataProduct = {
    'data-product-list': prodList,
    'data-product-id': prop(product, 'sku'),
    'data-product-name': productName,
    'data-product-price': productPrice,
    'data-product-category': category_paths,
    'data-product-brand': productBrand,
    'data-product-position': positionProduct,
    'data-dimension21': productStockStatus,
    'data-dimension38': normal_selling_price,
    'data-dimension39': productDiscount,
    'data-mkpseller-type': marketPlaceType(product),
    'data-mkpseller-name': marketPlaceName(product),
    hit_timestamp: dateTimeNow,
  };
  if (!isEnableMarketplace || noMarketplaceInfo) {
    delete dataProduct['data-mkpseller-type'];
    delete dataProduct['data-mkpseller-name'];
  }
  return dataProduct;
}

export function gtmAttrDataProductGraphQL(
  product,
  isEnableMarketplace,
  noMarketplaceInfo,
  searchSuggestionProduct,
  positionElementID,
  positionProduct,
  langCode,
) {
  let tempProductPrice = prop(product, 'price');
  const productSpecialPrice = prop(product, 'special_price');
  const productPriceInclTax = prop(product, 'price_incl_tax');
  if (productSpecialPrice) {
    tempProductPrice = productSpecialPrice;
  } else if (productPriceInclTax) {
    tempProductPrice = productPriceInclTax;
  }
  const productPrice = formatPrice(tempProductPrice);
  const productBrand = prop(product, 'brand_name');
  const dateTimeNow = moment().format('YYYY-MM-DD H:m:s');
  const categoryData = prop(product, 'categories');
  // const rootCategory = map(categoryRootID(categoryData), cat =>
  //   prop(cat, 'name'),
  // );
  const rootCategory = {};
  const category_paths = rootCategory.join('/');
  const normal_selling_price = formatPrice(prop(product, 'price'));
  const productDiscount = prop(product, 'special_price')
    ? formatPrice(normal_selling_price - product.special_price)
    : '0.00';
  const productName = prop(product, 'name');
  const stockStatus =
    prop(product, 'is_in_stock') === true ? 'In Stock' : 'Out Of Stock';
  const prodList = positionElementID
    ? `/${langCode}#${positionElementID}`
    : prop(product, 'url_key');
  const dataProduct = {
    'data-product-list': prodList,
    'data-product-id': prop(product, 'sku'),
    'data-product-name': productName,
    'data-product-price': productPrice,
    'data-product-category': category_paths,
    'data-product-brand': productBrand,
    'data-product-position': positionProduct,
    'data-dimension21': stockStatus,
    'data-dimension38': normal_selling_price,
    'data-dimension39': productDiscount,
    'data-mkpseller-type': marketPlaceType(product),
    'data-mkpseller-name': marketPlaceName(product),
    hit_timestamp: dateTimeNow,
  };
  if (!isEnableMarketplace || noMarketplaceInfo) {
    delete dataProduct['data-mkpseller-type'];
    delete dataProduct['data-mkpseller-name'];
  }
  return dataProduct;
}

export const getImageNameFromSrc = imageSrc => {
  const imageSrcArr = imageSrc.split('/'); // split url by / symbol
  const imageName = imageSrcArr[imageSrcArr.length - 1]; // last index is image name
  return imageName || '';
};
