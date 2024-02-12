import types from './types';
import { union, uniqWith, isEqual } from 'lodash';

const initialState = {
  order: [],
  orderHistory: [],
  orderHistoryLatest: [],
  searchCriteria: { page_size: 20, current_page: 1 },
  totalCount: 0,
  filters: {
    status: '',
    dateFrom: '',
    dateTo: '',
  },
  // sort,
  loading: true,
};

export default function order(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_ORDER:
      return {
        ...state,
        order: action.payload.order,
        orderHistory: [],
        searchCriteria: { page_size: 20, current_page: 1 },
        totalCount: 0,
        loading: false,
      };
    case types.PUSH_ORDER:
      return {
        ...state,
        orderHistory: uniqWith(
          union(state.orderHistory, action.payload.order),
          isEqual,
        ),
        orderFetchFailed: '',
      };
    case types.LOAD_ORDER_HISTORY:
      const {
        orderHistory,
        searchCriteria,
        totalCount,
        filters,
      } = action.payload;
      return {
        ...state,
        orderHistory,
        searchCriteria,
        totalCount,
        filters,
      };
    case types.ORDER_FETCH_FAILED:
      return {
        ...state,
        orderFetchFailed: action.payload.message,
        loading: false,
      };
    case types.LOAD_ORDER_HISTORY_LATEST:
      return {
        ...state,
        orderHistoryLatest: action.payload.orderHistoryLatest,
      };
    case types.LOADING_ORDER:
      return {
        ...state,
        loading: true,
      };

    case types.STOP_LOADING_ORDER:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
