import React from 'react';
import {
  ProductSearchWidget,
  withLocales,
  withStoreConfig,
  withRoutes,
} from '@central-tech/core-ui';
import { TitleProductStyled, TextElStyled } from './styled';
import { get as prop, isEmpty, find, filter } from 'lodash';
import SearchNotFound from '../SearchNotFound';
import {
  searchFilterGroup,
  setFilterSearchFromQueryParams,
} from '../../utils/searchFilter';
import ProductListDesktop from './ProductListDesktop';
import ProductListMobile from './ProductListMobile';
import withDeviceDetect from '../DeviceDetect/withDeviceDetect';
import { FilterMobile } from '../FilterMobile';

@withDeviceDetect
@withLocales
@withStoreConfig
@withRoutes
class ProductListPage extends React.PureComponent {
  state = {
    currentPage: 1,
    forceFetch: false,
    loadingSubCategory: true,
    loadingFilter: true,
    isOpenFilterMobile: false,
  };

  setQuery = query => {
    const { location } = this.props;
    location.push(location.pathname, {
      ...location.queryParams,
      ...query,
    });
  };

  setTitle = (title, isSearch, hasProduct = true) => {
    const { translate } = this.props;
    const word = hasProduct
      ? translate('productPreview.searchResultsFor')
      : translate('productPreview.searchNotResultsFor');
    return (
      <>
        {isSearch && <TextElStyled as="h3">{word}</TextElStyled>}
        {!isEmpty(title) && <TitleProductStyled>{title}</TitleProductStyled>}
      </>
    );
  };
  componentDidMount() {
    this.setState({
      loadingFilter: false,
      loadingSubCategory: false,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.url !== this.props.location.url) {
      this.setState({
        currentPage: 1,
        forceFetch: true,
      });
    }
  }

  getOrderBy() {
    const { location } = this.props;
    const orderBy = prop(location, 'queryParams.sort', [
      {
        direction: 'DESC',
        field: 'recommended',
      },
    ]);

    if (typeof orderBy === 'string') {
      const sortKeyValue = orderBy.split(',');
      return [
        {
          direction: sortKeyValue[1].toUpperCase(),
          field: sortKeyValue[0],
        },
      ];
    }
    return orderBy;
  }

  getBrandNameFilter(activeFilters, queryParams) {
    const brandName = String(prop(queryParams, 'brand_name', ''));
    if (brandName !== '') {
      const brandNameFilter = setFilterSearchFromQueryParams(
        'brand_name',
        brandName,
        'in',
      );
      activeFilters.push(brandNameFilter);
    }
    return activeFilters;
  }

  getColorFilter(activeFilters, queryParams) {
    const color = String(prop(queryParams, 'color', ''));
    if (color !== '') {
      const colorFilter = setFilterSearchFromQueryParams('color', color, 'in');
      activeFilters.push(colorFilter);
    }
    return activeFilters;
  }

  getPriceFilter(activeFilters, queryParams) {
    const priceRange = String(prop(queryParams, 'price_range', ''));

    if (priceRange !== '') {
      const priceKeyValue = priceRange.split(',');

      if (priceKeyValue.length > 0) {
        if (priceKeyValue[0]) {
          const priceFromFilter = setFilterSearchFromQueryParams(
            'price',
            priceKeyValue[0],
            'from',
          );

          activeFilters.push(priceFromFilter);
        }
        if (priceKeyValue[1]) {
          const priceFromFilter = setFilterSearchFromQueryParams(
            'price',
            priceKeyValue[1],
            'to',
          );

          activeFilters.push(priceFromFilter);
        }
      }
    }

    return activeFilters;
  }

  getNewArrivalFilter(activeFilters, queryParams) {
    const newArrival = String(prop(queryParams, 'new', ''));
    if (newArrival !== '') {
      const newArrivalFilter = setFilterSearchFromQueryParams(
        'new',
        newArrival,
        'eq',
      );
      activeFilters.push(newArrivalFilter);
    }
    return activeFilters;
  }

  getSaleFilter(activeFilters, queryParams) {
    const onlinePriceEnabled = String(
      prop(queryParams, 'online_price_enabled', ''),
    );
    if (onlinePriceEnabled !== '') {
      const onlinePriceEnabledFilter = setFilterSearchFromQueryParams(
        'online_price_enabled',
        onlinePriceEnabled,
        'eq',
      );
      activeFilters.push(onlinePriceEnabledFilter);
    }
    return activeFilters;
  }

  getSubCategoryFilter(activeFilters, queryParams) {
    const categoryId = String(prop(queryParams, 'category_id', ''));
    if (categoryId !== '') {
      const subCategoryFilter = setFilterSearchFromQueryParams(
        'category_id',
        categoryId,
        'in',
      );

      activeFilters.push(subCategoryFilter);
    }
    return activeFilters;
  }

  getKeywordFilter(activeFilters, queryParams) {
    const searchTerm = String(prop(queryParams, 'q', ''));
    if (searchTerm !== '') {
      const searchTermFilter = setFilterSearchFromQueryParams(
        'search_term',
        searchTerm,
        false,
      );
      activeFilters.push(searchTermFilter);
    }
    return activeFilters;
  }

  getFilterSearchPage() {
    let activeFilters = [];
    const { location, searchTerm } = this.props;
    const queryParams = prop(location, 'queryParams');
    const searchTermFilter = setFilterSearchFromQueryParams(
      'search_term',
      searchTerm,
      false,
    );
    activeFilters.push(searchTermFilter);
    activeFilters = this.getBrandNameFilter(activeFilters, queryParams);
    activeFilters = this.getColorFilter(activeFilters, queryParams);
    activeFilters = this.getPriceFilter(activeFilters, queryParams);
    activeFilters = this.getNewArrivalFilter(activeFilters, queryParams);
    activeFilters = this.getSubCategoryFilter(activeFilters, queryParams);
    activeFilters = this.getSaleFilter(activeFilters, queryParams);
    activeFilters = this.getKeywordFilter(activeFilters, queryParams);
    return activeFilters;
  }

  getFilterBrandPage() {
    let activeFilters = [];
    const { location, brandName } = this.props;
    const queryParams = prop(location, 'queryParams');
    const brandNameFilter = setFilterSearchFromQueryParams(
      'brand_name',
      brandName,
      false,
    );
    activeFilters.push(brandNameFilter);
    activeFilters = this.getColorFilter(activeFilters, queryParams);
    activeFilters = this.getPriceFilter(activeFilters, queryParams);
    activeFilters = this.getNewArrivalFilter(activeFilters, queryParams);
    activeFilters = this.getSubCategoryFilter(activeFilters, queryParams);
    activeFilters = this.getSaleFilter(activeFilters, queryParams);
    activeFilters = this.getKeywordFilter(activeFilters, queryParams);
    return activeFilters;
  }

  getFilterCategoryPage() {
    let activeFilters = [];
    const { location, categoryId } = this.props;
    const queryParams = prop(location, 'queryParams');
    const categoryIdFilter = setFilterSearchFromQueryParams(
      'category_id',
      categoryId.toString(),
      false,
    );
    activeFilters.push(categoryIdFilter);
    activeFilters = this.getBrandNameFilter(activeFilters, queryParams);
    activeFilters = this.getColorFilter(activeFilters, queryParams);
    activeFilters = this.getPriceFilter(activeFilters, queryParams);
    activeFilters = this.getNewArrivalFilter(activeFilters, queryParams);
    activeFilters = this.getSubCategoryFilter(activeFilters, queryParams);
    activeFilters = this.getSaleFilter(activeFilters, queryParams);
    activeFilters = this.getKeywordFilter(activeFilters, queryParams);
    return activeFilters;
  }

  getActiveFilter() {
    const { useFromPage } = this.props;
    let activeFilters = [];
    if (useFromPage === 'SEARCH') {
      activeFilters = this.getFilterSearchPage();
    } else if (useFromPage === 'BRAND') {
      activeFilters = this.getFilterBrandPage();
    } else if (useFromPage === 'CATEGORY') {
      activeFilters = this.getFilterCategoryPage();
    }

    return searchFilterGroup({
      activeFilters: activeFilters,
    });
  }

  handleLoadMore = fetchMore => {
    const { location } = this.props;
    const { currentPage: page } = this.state;
    const customFilterGroups = this.getActiveFilter();
    const limit = prop(location, 'queryParams.limit', 24);
    const sort = this.getOrderBy();

    this.setState({
      currentPage: page + 1,
    });

    return fetchMore({
      variables: {
        filterGroups: customFilterGroups,
        page: page + 1,
        size: limit,
        sort: sort && sort,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (prev !== fetchMoreResult) {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            productSearch: {
              ...prev.productSearch,
              products: [
                ...prev.productSearch.products,
                ...fetchMoreResult.productSearch.products,
              ],
            },
          });
        }
      },
    });
  };

  render() {
    const {
      category,
      location,
      useFromPage,
      searchTerm,
      metaTitle,
      metaDescription,
      cmsRender,
      brandLogo,
      activeConfig,
      isMobile,
    } = this.props;
    const {
      forceFetch,
      loadingSubCategory,
      loadingFilter,
      isOpenFilterMobile,
    } = this.state;
    const customFilterGroups = this.getActiveFilter();
    const limit = prop(location, 'queryParams.limit', 24);
    const sort = this.getOrderBy();
    const title = metaTitle;
    const description = metaDescription;
    const categoryId = prop(category, 'id', 0);
    const keySearch = useFromPage === 'SEARCH' ? searchTerm : title;
    let isNoProduct = false;
    return (
      <ProductSearchWidget
        filterGroups={customFilterGroups}
        page={1}
        sortOrders={sort && sort}
        size={limit}
        ssr={false}
        fetchPolicy={`cache-and-network`}
      >
        {({ data, loading, fetchMore, refetch }) => {
          if (forceFetch) {
            refetch();
            this.setState({ forceFetch: false });
          }
          const products = prop(data, 'productSearch.products', []);
          const totalCount = prop(data, 'productSearch.total_count');
          const filters = prop(data, 'productSearch.filters');
          const sorting = prop(data, 'productSearch.sorting');
          const allCategoryList = find(filters, o => {
            return o.attribute_code === 'category_id';
          });
          const allCategoryListItems = prop(allCategoryList, 'items', []);
          const subCategoryObjList = filter(allCategoryListItems, o => {
            return (
              parseInt(o.custom_attributes.parent_id) === parseInt(categoryId)
            );
          });

          if (!loading && products && products.length < 1) {
            isNoProduct = true;

            if (useFromPage === 'SEARCH') {
              return (
                <>
                  <SearchNotFound title={keySearch} isMobile={isMobile} />
                </>
              );
            }
          }
          const resultRemovePriceRang = customFilterGroups.filter(
            filter => filter.filters[0].field !== 'price',
          );
          resultRemovePriceRang.push({
            filters: [{ field: 'price', value: '0', conditionType: 'gt' }],
          });

          return (
            <ProductSearchWidget
              filterGroups={resultRemovePriceRang}
              page={1}
              sortOrders={[{ direction: 'ASC', field: 'price' }]}
              size={1}
              ssr={false}
            >
              {({ data, loading: lodingPriceMin }) => {
                let minPrice = prop(
                  data,
                  'productSearch.products[0].special_price',
                  0,
                );
                if (!minPrice) {
                  minPrice = prop(data, 'productSearch.products[0].price', 0);
                }

                return (
                  <ProductSearchWidget
                    filterGroups={resultRemovePriceRang}
                    page={1}
                    sortOrders={[{ direction: 'DESC', field: 'price' }]}
                    size={1}
                    ssr={false}
                  >
                    {({ data, loading: lodingPriceMax }) => {
                      let maxPrice = prop(
                        data,
                        'productSearch.products[0].special_price',
                        0,
                      );
                      if (!maxPrice) {
                        maxPrice = prop(
                          data,
                          'productSearch.products[0].price',
                          0,
                        );
                      }
                      const priceRange = { min: 0, max: 1 };

                      if (!lodingPriceMin && !lodingPriceMax) {
                        priceRange.min = minPrice;
                        priceRange.max = maxPrice;
                      }
                      return (
                        <>
                          {!isMobile ? (
                            <ProductListDesktop
                              title={title}
                              description={description}
                              loading={loading}
                              loadingFilter={loadingFilter}
                              loadingSubCategory={loadingSubCategory}
                              subCategoryObjList={subCategoryObjList}
                              products={products}
                              category={category}
                              filters={filters}
                              sorting={sorting}
                              useFromPage={useFromPage}
                              priceRange={priceRange}
                              cmsRender={cmsRender}
                              totalCount={totalCount}
                              fetchMore={fetchMore}
                              isNoProduct={isNoProduct}
                              handleLoadMore={this.handleLoadMore}
                              brandLogo={brandLogo}
                              activeConfig={activeConfig}
                              location={location}
                              sort={sort}
                              getActiveFilter={this.getActiveFilter()}
                            />
                          ) : (
                            <>
                              <FilterMobile
                                isOpen={isOpenFilterMobile}
                                category={category}
                                filters={filters}
                                sorting={sorting}
                                getActiveFilter={this.getActiveFilter()}
                                useFromPage={useFromPage}
                                priceRange={priceRange}
                                loading={loading}
                                onCloseFilter={() =>
                                  this.setState({ isOpenFilterMobile: false })
                                }
                                productsTotal={totalCount ? totalCount : 0}
                              />
                              <ProductListMobile
                                title={title}
                                description={description}
                                loading={loading}
                                loadingFilter={loadingFilter}
                                loadingSubCategory={loadingSubCategory}
                                subCategoryObjList={subCategoryObjList}
                                products={products}
                                category={category}
                                filters={filters}
                                sorting={sorting}
                                useFromPage={useFromPage}
                                priceRange={priceRange}
                                cmsRender={cmsRender}
                                totalCount={totalCount}
                                fetchMore={fetchMore}
                                isNoProduct={isNoProduct}
                                handleLoadMore={this.handleLoadMore}
                                brandLogo={brandLogo}
                                activeConfig={activeConfig}
                                location={location}
                                sort={sort}
                                getActiveFilter={this.getActiveFilter()}
                                onOpenFilter={() =>
                                  this.setState({ isOpenFilterMobile: true })
                                }
                              />
                            </>
                          )}
                        </>
                      );
                    }}
                  </ProductSearchWidget>
                );
              }}
            </ProductSearchWidget>
          );
        }}
      </ProductSearchWidget>
    );
  }
}

export default ProductListPage;
