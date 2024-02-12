import { explode } from '../../utils/customAttributes';
import { keyBy, toString, map, find, get } from 'lodash';
import logger from '../logger';
import axios from 'axios';
import config from '../../api/config';

const fetch = async (req, res) => {
  const defaultParams = { page: 1, limit: 15 };
  const params = req.query ? req.query : defaultParams;

  try {
    const products = await req.service.get('/products', params);

    if (products && products.items.length > 0) {
      products.items = products.items.map(item => explode(item));
      products.items = products.items.map(item => {
        const formatData = {
          ...item,
          url: item.url_key,
        };
        return formatData;
      });
    }

    const response = { products: products };

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify(response),
        'EX',
        process.env.REDIS_EXPIRE_CATEGORY,
      );
    }

    return res.json(response);
  } catch (e) {
    logger('productController.fetch', e);
    return res.status(500).json({ products: {}, status: 'error' });
  }
};

const fetchOne = async (req, res) => {
  const { sku } = req.params;

  try {
    const product = await req.service.get(
      `/products/${sku}`,
      {},
      { version: '/V2' },
    );

    if (!product.sku) {
      throw new Error('Product with such slug not found');
    }

    const response = {
      product: explode({
        ...product,
        ...product.extension_attributes,
      }),
    };

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify(response),
        'EX',
        process.env.REDIS_EXPIRE_CATEGORY,
      );
    }

    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.json({ product: {} });
  }
};

const fetchOneBySku = async (req, res) => {
  const { sku } = req.params;

  try {
    const product = await req.service.get(`/products/${sku}`);

    if (product.message) {
      return res.json({
        product: {},
        message: product.message,
        status: 'error',
      });
    }

    const response = { product: explode(product) };

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify(response),
        'EX',
        process.env.REDIS_EXPIRE_CATEGORY,
      );
    }

    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.json({ product: {}, status: 'error' });
  }
};

const fetchMedia = async (req, res) => {
  const { sku } = req.params;

  try {
    const product = await req.service.get(`/products/${sku}/media`);

    if (product.message) {
      return res.json({
        images: {},
        message: product.message,
        status: 'error',
      });
    }

    const response = { images: explode(product) };

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify(response),
        'EX',
        process.env.REDIS_EXPIRE_CATEGORY,
      );
    }

    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.json({ images: {}, status: 'error' });
  }
};

const fetchOneByUrlKey = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await req.service.get(
      `/products/url-key/${encodeURIComponent(slug)}`,
      {},
      { addParams: false },
    );

    const response = { product: explode(product) };
    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify(response),
        'EX',
        process.env.REDIS_EXPIRE_CATEGORY,
      );
    }

    return res.json(response);
  } catch (e) {
    console.error(e);
    return res.json({ product: {}, status: 'error' });
  }
};

const fetchAttributes = async (req, res) => {
  const { sku } = req.params;

  try {
    const productAttributes = await req.service.get(
      `/configurable-products/${sku}/options/all`,
    );
    //console.log('pro at', productAttributes);
    const attributesValues = keyBy(
      await Promise.all(
        productAttributes.map(attr =>
          req.service.get(`/products/attributes/${attr.attribute_id}`),
        ),
      ),
      'attribute_id',
    );

    const resultAttributes = productAttributes.map(attr => {
      const allOptions = attributesValues[attr.attribute_id].options;
      const productOptions = allOptions.filter(op =>
        attr.values.some(
          value => toString(value.value_index) === toString(op.value),
        ),
      );

      return {
        ...attr,
        attribute_code: attributesValues[attr.attribute_id].attribute_code,
        values: productOptions,
      };
    });

    res.send({
      attributes: resultAttributes,
    });
  } catch (e) {
    logger('productController.fetchAttributes', e);
    return res.status(500).json({ attributes: {}, status: 'error' });
  }
};

const addReview = async (req, res) => {
  const { sku } = req.params;
  const { name, title, description, currentRating } = req.body;

  try {
    const review = await req.service.post(`/products/${sku}/review`, {
      review: {
        title,
        nickname: name,
        detail: description,
        rating_items: [
          {
            rating_id: 1,
            rating: currentRating,
          },
        ],
      },
    });

    return res.json({ review });
  } catch (e) {
    logger('productController.addReview', e);
    return res.status(500).json({ review: {}, status: 'error' });
  }
};

const fetchSection = async (req, res) => {
  try {
    const params = req.query;
    const { type } = req.params;
    const products = await req.service.get(`/products/${type}`, params);

    let productLists = await req.service.get('/products', {
      entity_id: [
        '$in',
        toString(map(products, product => product.product_id)),
      ],
    });

    productLists = explode(productLists.items);

    return res.json({ productLists });
  } catch (e) {
    logger('productController.fetchSection', e);
    return res.status(500).json({ products: {}, status: 'error' });
  }
};

const fetchSectionByType = async (req, res) => {
  try {
    const params = req.query;
    const { type } = req.params;

    const products = await req.service.get(`/products/${type}`, params, {
      addStore: false,
    });
    const pids = map(products, product => product.product_id);

    return res.json({ pids });
  } catch (e) {
    logger('productController.fetchSectionByType', e);
    return res.status(500).json({ products: {}, status: 'error' });
  }
};

const getStockItem = async (req, res) => {
  try {
    const { sku } = req.params;
    const stock = await req.service.get(`/stockItems/${sku}`);
    return res.json(stock);
  } catch (e) {
    logger('productController.getStockItem', e);
    return res.status(500).json({ stock: {}, status: 'error' });
  }
};

const fetchYouMayLike = async (req, res) => {
  try {
    const { sku, lang } = req.query;
    const instance = axios.create({
      timeout: 1000,
      headers: { 'x-api-key': config.data_catalog_key },
    });

    const response = await instance.get(
      `${config.data_catalog_url}${sku}?lang=${lang}`,
    );

    if (response.status === 200) {
      const { data } = response;
      const youMayLike = find(data, item => item.id === 2);
      if (youMayLike) {
        const { data } = youMayLike;
        const youMayLikeSkuLists = find(
          data,
          item => item.code === 'product_asso',
        );
        return res.json({ items: get(youMayLikeSkuLists, 'item', null) });
      }
    }
    if (response.message) {
      return res.status(500).json({ suggestions: null, status: 'error' });
    }
  } catch (e) {
    return res.status(500).json({ items: null, status: 'error' });
  }
};

// const transformProducts = products =>
//   mapValues(products, val =>
//     merge({}, val, {
//       image:
//         val.custom_attributes[
//           findIndex(val.custom_attributes, { attribute_code: 'image' })
//         ].value,
//     }),
//   );

export default {
  fetch,
  fetchOne,
  fetchOneBySku,
  fetchAttributes,
  addReview,
  fetchSection,
  fetchOneByUrlKey,
  fetchSectionByType,
  fetchMedia,
  getStockItem,
  fetchYouMayLike,
};
