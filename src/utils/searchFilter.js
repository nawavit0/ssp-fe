import { get } from 'lodash';

export const searchFilterGroup = filter => {
  const {
    activeFilters,
    //searchTerm,
    queryParams,
    isSearch,
    //otherCondition,
    type = 'plp',
  } = filter;
  let filterGroups = activeFilters.map(filter => {
    return filter;
  });
  if (type !== 'plp') {
    return filterGroups;
  }

  /*** default case for fetch product ***/
  filterGroups = activeFilters.map(filter => {
    if (
      filter.field === 'price_gt' ||
      filter.field === 'price_lw' ||
      filter.field === 'review'
    ) {
      return null;
    }
    return filter;
  });
  filterGroups.push({
    filters: [{ field: 'status', value: '1' }],
  });
  filterGroups.push({
    filters: [{ field: 'price', value: '0', conditionType: 'gt' }],
  });

  if (get(activeFilters, '[0].field') !== 'entity_id') {
    filterGroups.push({
      filters: [
        {
          field: 'visibility',
          value: isSearch ? '3,4' : '2,4',
          conditionType: 'in',
        },
      ],
    });
  }

  // if (get(otherCondition, 'categoryId')) {
  //   filterGroups.push({
  //     filters: [
  //       {
  //         field: 'category_id',
  //         value: get(otherCondition, 'categoryId'),
  //       },
  //     ],
  //   });
  // }

  // const arrFilter = convertActiveFilters(activeFilters);
  const priceGreater = get(
    activeFilters.filter(item => item.field === 'price_gt'),
    '0.value',
    '',
  );
  const priceLower = get(
    activeFilters.filter(item => item.field === 'price_lw'),
    '0.value',
    '',
  );

  // if (searchTerm) {
  //   filterGroups.push({
  //     filters: [
  //       { field: 'search_term', value: searchTerm, conditionType: 'eq' },
  //     ],
  //   });
  //   // customFilterGroups = [
  //   //   ...customFilterGroups,
  //   //   {
  //   //     filters: [
  //   //       { field: 'search_term', value: searchTerm, conditionType: 'eq' },
  //   //     ],
  //   //   },
  //   // ];
  // }

  let customFilterGroups = filterGroups;
  if (priceGreater && priceLower) {
    customFilterGroups = [
      ...filterGroups,
      {
        filters: [
          {
            field: 'price',
            value: priceGreater.toString(),
            conditionType: 'gt',
          },
        ],
      },
      {
        filters: [
          {
            field: 'price',
            value: priceLower.toString(),
            conditionType: 'lt',
          },
        ],
      },
    ];
  }
  if (get(queryParams, 'brand_name')) {
    customFilterGroups = [
      ...customFilterGroups,
      {
        filters: [
          {
            field: 'brand_name',
            value: queryParams.brand_name,
            conditionType: 'in',
          },
        ],
      },
    ];
  }

  return customFilterGroups;
};

export const setFilterSearchFromQueryParams = (
  field,
  value,
  conditionType = 'in',
) => {
  if (conditionType && conditionType !== 'eq') {
    return {
      filters: [
        {
          field: field,
          value: value,
          conditionType: conditionType,
        },
      ],
    };
  }
  return {
    filters: [
      {
        field: field,
        value: value,
      },
    ],
  };
};
