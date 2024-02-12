import { map, findLastIndex } from 'lodash';
import { explode } from '../../utils/customAttributes';
import moment from 'moment';

const searchProducts = async (req, res) => {
  try {
    const {
      searchQuery,
      limit,
      page,
      sort,
      sortNotInStock,
      priceRange,
      newArrival,
      flash_deal_enable,
      category,
      priceCheck = '-1',
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      gclid,
      affiliate_id,
      offer_id,
      fbclid,
      gclsrc,
      only_product,
      ...filters
    } = req.query;
    filters.status = 1;

    let sortField, sortDirection;

    if (sort) {
      const underscoreIndex = findLastIndex(sort, ch => ch === ',');
      sortField = sort.slice(0, underscoreIndex);
      sortDirection = sort.slice(underscoreIndex + 1);
    }

    const filterGroups = map(filters, (value, field) => ({
      filters: [
        {
          field,
          value,
          conditionType: value.includes && value.includes(',') ? 'in' : 'eq',
          splitter: value.includes && value.includes(',') ? ',' : undefined,
        },
      ],
    }));

    if (priceRange) {
      const underscoreIndex = findLastIndex(priceRange, ch => ch === ',');
      filterGroups.push(
        {
          filters: [
            {
              field: 'price',
              value: priceRange.slice(0, underscoreIndex),
              conditionType: 'from',
            },
          ],
        },
        {
          filters: [
            {
              field: 'price',
              value: priceRange.slice(underscoreIndex + 1),
              conditionType: 'to',
            },
          ],
        },
      );
    }

    if (newArrival) {
      filterGroups.push({
        filters: [
          {
            field: 'news_from_date',
            value: '',
            conditionType: 'notnull',
          },
        ],
      });
    }

    const dateTimeNow = moment()
      // .subtract(25200000, 'ms')
      .format('YYYY-MM-DD HH:mm:ss');
    if (flash_deal_enable) {
      filterGroups.push({
        filters: [
          {
            field: 'flash_deal_enable',
            value: 1,
          },
        ],
      });
      filterGroups.push({
        filters: [
          {
            field: 'flash_deal_to',
            value: dateTimeNow,
            conditionType: 'gt',
          },
        ],
      });
      filterGroups.push({
        filters: [
          {
            field: 'flash_deal_from',
            value: dateTimeNow,
            conditionType: 'lteq',
          },
        ],
      });
    }
    if (category) {
      filterGroups.push({
        filters: [
          {
            field: 'category_id',
            value: category,
          },
        ],
      });
    }
    if (
      utm_source ||
      utm_medium ||
      utm_campaign ||
      utm_content ||
      utm_term ||
      gclid ||
      affiliate_id ||
      offer_id ||
      fbclid ||
      gclsrc
    ) {
    }
    // console.log("category", category);
    // console.log("category_id", category_id);
    // if (category_id) {
    //   filterGroups.push({
    //     filters: map(category_id.split(','), value => ({
    //       field: 'category_id',
    //       value: value,
    //     })),
    //   });
    // }

    // default condition
    if (priceCheck === '-1') {
      filterGroups.push({
        filters: [
          {
            field: 'price',
            value: 10,
            conditionType: 'moreq',
          },
        ],
      });
    }

    if (searchQuery) {
      filterGroups.push({
        filters: [
          {
            field: 'search_term',
            value: searchQuery,
          },
        ],
      });
    }
    const body = {
      size: limit,
      // currentPage: sortField === 'price' ? 1 : page,
      currentPage: page,
      filterGroups,
      sortOrders:
        sort && sortNotInStock
          ? [
              {
                field: sortField,
                direction: sortDirection,
              },
            ]
          : [
              {
                field: 'stock.is_in_stock',
                direction: 'desc',
              },
              {
                field: sortField,
                direction: sortDirection,
              },
            ],
    };

    const response = await req.service.get(
      '/products/search',
      `criteria=${encodeURIComponent(
        decodeURIComponent(JSON.stringify(body)),
      )}`,
      {
        prefix: 'catalog-service/',
        version: '/V1',
        magentoParams: false,
      },
    );

    if (response.message) {
      return res.status(500).json({ products: null, status: 'error' });
    }

    let searchResult = {
      ...response,
      products: explode(response.products),
    };

    if (typeof req.redis !== 'undefined') {
      req.redis.set(
        req.redisKey,
        JSON.stringify({ products: searchResult }),
        'EX',
        process.env.REDIS_EXPIRE_CATEGORY,
      );
    }

    if (only_product) {
      searchResult = {
        products: searchResult.products,
      };
    }

    return res.json({ products: searchResult });
  } catch (e) {
    return res.status(500).json({ products: null, status: 'error', error: e });
  }
};

export default {
  searchProducts,
};
