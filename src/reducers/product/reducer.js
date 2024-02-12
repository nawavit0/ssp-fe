import { get } from 'lodash';
import types from './types';

const initialState = {
  products: [],
  activeProduct: {},
  productByCategory: [],
  productRecently: [],
  loading: true,
  flippedSku: null,
  productMinMaxPrice: {},
  loadingBrandCollectionProducts: true,
  newArrival: {
    categoriesId: [],
    products: [],
    loadingNewArrival: true,
  },
};

export default function product(state = initialState, action) {
  switch (action.type) {
    case types.START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.START_PRODUCT_LOADING:
      return {
        ...state,
        productLoading: true,
      };
    case types.START_PRODUCTBYCATEGORT_LOADING:
      return {
        ...state,
        productByCategoryLoading: true,
      };

    case types.START_PRODUCTRECENTLY_LOADING:
      return {
        ...state,
        productRecentlyLoading: true,
      };
    case types.FETCH_PRODUCTS:
      const { products } = action.payload;
      return {
        ...state,
        sorting: products.sorting,
        products: products.items || products.products,
        filters: products.filters,
        limit: get(products.search_criteria, 'page_size'),
        total: products.total_count,
        loading: false,
      };
    case types.FETCH_PRODUCTS_ALL_COMPLETE:
      const { productNewArrival } = action.payload;
      return {
        ...state,
        newArrival: {
          ...productNewArrival,
          loadingNewArrival: false,
        },
      };
    case types.FETCH_ATTRIBUTES:
      return {
        ...state,
        activeProduct: {
          ...state.activeProduct,
          attributes: action.payload.attributes,
          loading: false,
        },
        productLoading: false,
      };
    case types.LOADED_PRODUCT:
      return {
        ...state,
        activeProduct: action.payload.product,
        loading: false,
        productLoading: false,
      };
    case types.LOADED_PRODUCTBYCATEGORY:
      return {
        ...state,
        productByCategory: action.payload.productByCategory,
        productByCategoryLoading: false,
      };
    case types.LOADED_PRODUCTRECENTLY:
      return {
        ...state,
        productRecently: action.payload.productRecently,
        productRecentlyLoading: false,
      };
    case types.FETCH_RELATED_PRODUCTS:
      return {
        ...state,
        relatedProducts: action.payload.relatedProducts,
        loading: false,
      };
    case types.FETCH_UPSELL_PRODUCTS:
      return {
        ...state,
        upsellProducts: action.payload.upsellProducts,
        loading: false,
      };
    case types.FETCH_PRODUCT_LIST_BY_CATEGORY_COMPLETE:
      return {
        ...state,
        section: { products },
        loading: false,
      };
    case types.FETCH_ATTRIBUTES:
      return {
        ...state,
        activeProduct: {
          ...state.activeProduct,
          attributes: action.payload.attributes,
          loading: false,
        },
        productLoading: false,
      };
    case types.SET_FLIPPED_SKU:
      return {
        ...state,
        flippedSku: action.payload.sku,
      };
    case types.POST_REVIEW:
      return {
        ...state,
      };
    case types.FETCH_BRAND_COLLECTION_PRODUCTS:
      const { brandCollectionproducts } = action.payload;
      return {
        ...state,
        brandCollectionProducts:
          brandCollectionproducts.items || brandCollectionproducts.products,
        loadingBrandCollectionProducts: false,
      };
    case types.SET_CONFIGURABLE_PRODUCTS:
      const {
        productId,
        configurationProducts,
        configurationProductActive,
      } = action.payload;
      const tempProducts = [...state.products];

      tempProducts.map(item => {
        if (item.id === productId) {
          item['configurable_products'] = configurationProducts;
          item['configurable_product_active'] = configurationProductActive;
        }
      });

      return {
        ...state,
        products: tempProducts,
      };
    default:
      return state;
  }
}
