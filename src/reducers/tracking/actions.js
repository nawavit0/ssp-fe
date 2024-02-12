import service from '../../ApiService';
import types from './types';
import { get } from 'lodash';

export const sendTrackingData = data => {
  return (dispatch, getState) => {
    const { tracking, customer } = getState();
    const { pathname } = window.location;

    const eventKeys = {
      trendingClick: 'search_trending_click',
      suggestionClick: 'search_suggestion_click',
      enterSearchKeyword: 'search_term',
    };

    const param = {
      uuid: get(data, 'uuid', ''),
      event: eventKeys[get(data, 'event', '')],
      position: get(data, 'position', ''),
      SKU: get(data, 'sku', tracking.productSku),
      page: tracking.pageName,
      path: pathname,
      userId: get(customer, 'customer.id', ''),
      searchKeyword: get(data, 'keyword', ''),
    };

    trackingSearch(param);
  };
};

export const trackingSearch = param => {
  service
    .post('/tracking', param)
    .then(function(response) {
      return response;
    })
    .catch(function() {
      return null;
    });
};

export const setPageName = name => ({
  type: types.SET_PAGE_NAME,
  payload: { name },
});

export const setProductSku = sku => ({
  type: types.SET_PRODUCT_SKU,
  payload: { sku },
});
