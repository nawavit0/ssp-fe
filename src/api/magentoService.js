import axios from 'axios';
import { compact, get as prop, map, startsWith, isEmpty } from 'lodash';
import config from './config';
import logger from './logger';

const fieldConditions = [
  'lt',
  'lteq',
  'gt',
  'gteq',
  'moreq',
  'eq',
  'neq',
  'like',
  'finset',
  'from',
  'to',
  'in',
  'nin',
  'null',
  'notnull',
];
const defaultCondition = 'eq';
const conditionSymbol = '$';

export const queryBuilder = ({ page = 1, limit = 8, sort, ...params } = {}) => {
  const pageSizeCriteria = `searchCriteria[pageSize]=${limit}`;
  const pageNumberCriteria = `searchCriteria[currentPage]=${page}`;
  const sortCriteria = sort
    ? `searchCriteria[sortOrders][0][field]=${
        sort.split(' ')[0]
      }&searchCriteria[sortOrders][0][direction]=${sort
        .split(' ')[1]
        .toUpperCase()}`
    : '';

  let fieldIndex = -1;
  let fieldSearchCriterias = map(params, (value, key) => {
    fieldIndex++;
    let condition = defaultCondition;
    if (typeof value !== 'object') {
      //TODO: I have changed key and value, because it seems like it was in the wrong order, please review
      return `searchCriteria[filter_groups][${fieldIndex}][filters][0][field]=${key}&searchCriteria[filter_groups][${fieldIndex}][filters][0][value]=${value}&searchCriteria[filter_groups][${fieldIndex}][filters][0][condition_type]=${condition}`;
    } else if (Array.isArray(value)) {
      for (const k of value) {
        if (
          startsWith(k, conditionSymbol) &&
          fieldConditions.includes(k.split(conditionSymbol)[1])
        ) {
          value.shift();
          condition = k.split(conditionSymbol)[1];
        }
      }

      const criterias = [
        `searchCriteria[filter_groups][${fieldIndex}][filters][0][field]=${key}&searchCriteria[filter_groups][${fieldIndex}][filters][0][value]=${value}&searchCriteria[filter_groups][${fieldIndex}][filters][0][condition_type]=${condition}`,
      ];

      return criterias;
    }

    return map(value, (val, conditionType) => {
      const criteria = `searchCriteria[filter_groups][${fieldIndex}][filters][0][field]=${key}&searchCriteria[filter_groups][${fieldIndex}][filters][0][value]=${val}&searchCriteria[filter_groups][${fieldIndex}][filters][0][condition_type]=${conditionType}`;
      fieldIndex++;
      return criteria;
    }).join('&');
  });

  fieldSearchCriterias = compact(fieldSearchCriterias);

  const criterias = [
    sortCriteria,
    pageSizeCriteria,
    pageNumberCriteria,
    ...fieldSearchCriterias,
  ];

  return criterias.join('&');
};

const service = async ({
  headers,
  method,
  params,
  data,
  url,
  store = '',
  version = '/V1',
  prefix = '',
  authorizationToken,
  auth = true,
  addParams = true,
  magentoParams = true,
  addStore = true,
}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip',
    client: 'web',
  };

  if (auth) {
    const token = authorizationToken || config.magento_token;
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  let query = '';

  if (addParams && !isEmpty(params) && method.toLowerCase() === 'get') {
    if (magentoParams) {
      query = `?${queryBuilder(params)}`;
    } else {
      query = `?${params}`;
    }
  }

  if (!addStore) {
    store = '';
  }

  return axios({
    method: method.toLowerCase(),
    url: `${config.magento_api_base_url}${prefix}${store}${version}${url}${query}`,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    data: typeof data !== undefined ? data : '',
  })
    .then(res => {
      if (
        prop(data, 'paymentMethod.method') === 'fullpaymentredirect' ||
        prop(data, 'paymentMethod.method') === 'p2c2p_ipp' ||
        prop(data, 'paymentMethod.method') === 'p2c2p_123'
      ) {
        return res.request.res.responseUrl;
      }

      return res.data;
    })
    .catch(error => {
      logger(`
        URL: ${
          config.magento_api_base_url
        }${prefix}${store}${version}${url}${query}
        method: ${method}
        params: ${JSON.stringify(params || data)}
        error: ${error}
        header: ${JSON.stringify({ ...defaultHeaders, ...headers })}
      `);
      const { response } = error;
      throw {
        message: response.data && response.data.message,
        parameters: response.data && response.data.parameters,
        status: response.status,
        statusText: response.statusText,
      };
    });
};

export default service;
