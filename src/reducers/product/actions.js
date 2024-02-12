import service from '../../ApiService';
import types from './types';
import { find, map, isEmpty, toString } from 'lodash';

export const fetchProducts = (
  params = {},
  search = false,
) => async dispatch => {
  dispatch(startLoading());
  let products;
  if (search) {
    ({ products } = await service.get('/search/products', params));
  } else {
    ({ products } = await service.get('/products', params));
  }

  dispatch(fetchProductsCompleted(products));
  return products;
};

export const fetchProductsSection = (params = {}) => async () => {
  const { products } = await service.get('/search/products', params);
  return products.products;
};

export const fetchProductSectionBySpecifiedUrl = (
  url,
  params = {},
) => async () => {
  params.days = 7; // criteria of api
  params.visibility = '2,4'; // not configuration product
  params.status = 1; // status enable
  params.limit = 12; // limit for productSection

  const { pids } = await service.get(`/products/section/${url}`, params);

  if (!isEmpty(pids)) {
    let { products } = await service.get('/search/products', {
      entity_id: toString(pids),
    });
    products = map(pids, pid =>
      find(products.products, product => product.id === pid),
    );
    return products;
  }

  return null;
};

export function startLoading() {
  return { type: types.START_LOADING };
}

export function startProductLoading() {
  return { type: types.START_PRODUCT_LOADING };
}

export const setFlippedSku = sku => ({
  type: types.SET_FLIPPED_SKU,
  payload: { sku },
});

export function fetchProductsCompleted(products) {
  return {
    type: types.FETCH_PRODUCTS,
    payload: {
      products,
    },
  };
}

export const fetchProductAttributes = sku => async dispatch => {
  dispatch(startProductLoading());
  const { attributes } = await service.get(`/get-product-attributes/${sku}`);
  dispatch(fetchAttributesCompleted(attributes));
  return attributes;
};

export function fetchAttributesCompleted(attributes) {
  return {
    type: types.FETCH_ATTRIBUTES,
    payload: {
      attributes,
    },
  };
}

export const getStockItems = (skus = []) => async () => {
  return new Promise(resolve => {
    map(skus, sku => {
      const stock = service.get(`/products/stocks/${sku}`);
      resolve(stock);
    });
  });
};
