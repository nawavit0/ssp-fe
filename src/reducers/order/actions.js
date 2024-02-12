import types from './types';
import service from '../../ApiService';
import { find, isEmpty, head, assign, map, get, size } from 'lodash';
import enableMarketplace from '../../utils/enableMarketplace';

import { reset } from 'redux-form';

export const fetchOrder = () => async dispatch => {
  const { order, status } = await service.get('/checkout/getOrderInfo');

  if (status === 'error') {
    return;
  }
  await dispatch(fetchOrderCompleted(order));
};

export const fetchOrderCompleted = order => ({
  type: types.FETCH_ORDER,
  payload: {
    order,
  },
});

export function loadOrderHistoryCompleted(
  orderHistory,
  searchCriteria,
  totalCount,
  filters,
) {
  return {
    type: types.LOAD_ORDER_HISTORY,
    payload: {
      orderHistory,
      searchCriteria,
      totalCount,
      filters,
    },
  };
}

export function loadOrderHistoryLatestCompleted(
  orderHistoryLatest,
  searchCriteria,
  totalCount,
  filters,
  sort,
) {
  return {
    type: types.LOAD_ORDER_HISTORY_LATEST,
    payload: {
      orderHistoryLatest,
      searchCriteria,
      totalCount,
      filters,
      sort,
    },
  };
}

export const pushOrderCompleted = order => ({
  type: types.PUSH_ORDER,
  payload: {
    order,
  },
});

export const fetchOrderHistory = (page, limit, filters) => {
  return async (dispatch, getState) => {
    if (!filters) {
      filters = {
        dateTo: '',
        dateFrom: '',
        incrementId: '',
      };
    }

    const { dateTo: to, dateFrom: from, incrementId } = filters;
    const params = {
      page: page,
      limit: limit,
      increment_id: incrementId ? incrementId : '',
      from,
      to,
      sort: 'entity_id desc',
    };

    dispatch(loadingOrder());

    try {
      const { orderHistory, searchCriteria, totalCount } = await service.get(
        `/account/order-history`,
        params,
      );

      if (orderHistory) {
        const isEnableMarketplace = enableMarketplace(
          get(getState(), 'envConfigs'),
        );

        const calls = orderHistory.map(async order => {
          if (isEnableMarketplace) {
            return mapOrderByPackgeStatus(order);
          }
          return mapOrderShipments(order);
        });
        const orders = await Promise.all(calls); // order with shipments

        dispatch(
          loadOrderHistoryCompleted(
            orders,
            searchCriteria,
            totalCount,
            filters,
          ),
        );
      }

      dispatch(stopLoadingOrder());

      return orderHistory;
    } catch (e) {
      dispatch(stopLoadingOrder());
      return null;
    }
  };
};

export const fetchOrderHistoryLatest = (page, limit, filters, sort) => {
  return async dispatch => {
    if (!filters) {
      filters = {
        dateTo: '',
        dateFrom: '',
        incrementId: '',
      };
    }

    const { dateTo: to, dateFrom: from, incrementId } = filters;
    const params = {
      page: page,
      limit: limit,
      increment_id: incrementId ? incrementId : '',
      from,
      to,
      sort: sort || 'entity_id desc',
    };

    dispatch(loadingOrder());

    try {
      const { orderHistory, searchCriteria, totalCount } = await service.get(
        `/account/order-history`,
        params,
      );

      if (orderHistory) {
        await dispatch(
          loadOrderHistoryLatestCompleted(
            orderHistory,
            searchCriteria,
            totalCount,
            filters,
            sort,
          ),
        );
      }

      dispatch(stopLoadingOrder());

      return orderHistory;
    } catch (e) {
      dispatch(stopLoadingOrder());
      return null;
    }
  };
};

export const fetchOrderById = id => async dispatch => {
  try {
    const response = await service.get(`/account/order-history/${id}`);
    dispatch(fetchOrderCompleted(response));
    return response;
  } catch (error) {
    dispatch(fetchOrderFailed());
    return null;
  }
};

export const fetchOrderByIncrementId = (id, email, required = false) => async (
  dispatch,
  getState,
) => {
  dispatch(loadingOrder());
  try {
    const params = { increment_id: id, required: required };
    if (email) {
      params.customer_email = email;
    }
    const orderResponse = await service.get(`/account/order-history`, params);

    if (get(orderResponse, 'status') === 'error') {
      return orderResponse;
    }
    const order = head(orderResponse.orderHistory);

    if (!isEmpty(order)) {
      let result;
      const isEnableMarketplace = enableMarketplace(
        get(getState(), 'envConfigs'),
      );

      if (isEnableMarketplace) {
        result = await mapOrderByPackgeStatus(order);
      } else {
        result = await mapOrderShipments(order);
      }

      dispatch(fetchOrderCompleted(result));
    } else {
      dispatch(fetchOrderFailed());
    }
  } catch (e) {
    dispatch(fetchOrderFailed());
    return null;
  }
};

async function mapOrderShipments(order) {
  // additional shipments info
  const shipments = await service.get(
    `/account/order-history/${order.entity_id}/shipments`,
  );

  const matchOrderItem = item => {
    item.detail = find(order.items, i => i.item_id === item.order_item_id);
  };
  map(shipments, group => map(group.items, matchOrderItem));

  return assign({ shipments }, order);
}

async function mapOrderByPackgeStatus(order) {
  // additional shipments info
  const packageStatus = await service.get(
    `/account/order-history/${order.increment_id}/packageStatus`,
  );
  const shipments = [];
  packageStatus.map(thisValue => {
    const items = [];
    const findIndexExisiting = shipments.findIndex(
      ship => ship.sold_by === thisValue.sold_by,
    );
    if (findIndexExisiting === -1) {
      shipments.push({
        sold_by: thisValue.sold_by,
        items: [],
      });
    }

    const findIndexSoldBy = shipments.findIndex(
      ship => ship.sold_by === thisValue.sold_by,
    );

    let marketplaceInfo = null;
    thisValue.items.map(item => {
      const itemDetail = find(
        order.items,
        orderItem => orderItem.sku === item.product.sku,
      );

      marketplaceInfo = get(
        itemDetail,
        'extension_attributes.marketplace_info',
      );

      items.push({
        ...item,
        status: item.status ? item.status : null,
        detail: itemDetail,
        marketplaceInfo,
      });
    });

    shipments[findIndexSoldBy].items.push({
      products: items,
      ...thisValue,
      status: thisValue.status ? thisValue.status : '',
      marketplaceInfo,
    });
  });

  const sortStatusItem = (a, b) => (a.status < b.status ? 1 : -1);
  shipments.map(shipment => {
    shipment.items.sort(sortStatusItem);
  });

  const sortSoldBy = (a, b) => (a.sold_by > b.sold_by ? 1 : -1);
  shipments.sort(sortSoldBy);

  // Filter dropShip product
  let packOfDropShip = [];
  const tempShipments = shipments.filter(pack => {
    const item = head(pack.items);
    const itemMarketplaceInfo = get(item, 'marketplaceInfo');
    const itemType = get(itemMarketplaceInfo, 'marketplace_product_type');
    if (itemType !== 'dropship') {
      return pack;
    }
    // keep pack dropship to packOfDropShip
    packOfDropShip = [...packOfDropShip, ...pack.items];
  });

  if (packOfDropShip.length > 0) {
    const indexOfRetail = shipments.findIndex(pack => pack.sold_by === '');
    if (indexOfRetail !== -1) {
      packOfDropShip.map(item => {
        item.sold_by = '';
        tempShipments[indexOfRetail].items.push(item);
      });
    } else {
      // incase don't have sold_by central.
      tempShipments.unshift({
        items: packOfDropShip,
        sold_by: '',
      });
    }
    if (indexOfRetail !== -1) {
      tempShipments[indexOfRetail].items.sort(sortStatusItem);
    }
  }

  // Group product canceled and no status.
  tempShipments.map(group => {
    const packHaveStatus = group.items.filter(
      item => item.status !== 'canceled' && item.status !== '',
    );
    const packStatusOther = group.items.filter(item => item.status === '');
    const packStatusCanceled = group.items.filter(
      item =>
        item.status === 'canceled' &&
        get(group, 'marketplaceInfo.marketplace_product_type') !== 'dropship',
    );
    const temp = [];
    if (size(packHaveStatus) > 0) {
      map(packHaveStatus, pack => {
        temp.push(pack);
      });
    }
    if (size(packStatusOther) > 0) {
      const tempGroupItemNoStatus = [];
      packStatusOther.map(item => {
        const packStatus = get(item, 'status', '');
        item.products.map(product => {
          const tempProduct = { ...product, status: packStatus };
          tempGroupItemNoStatus.push(tempProduct);
        });
      });

      const tempItemsNoStatus = {
        ref_number: null,
        shipment_provider: null,
        sold_by: '',
        status: '',
        track_number: null,
        track_url: null,
        products: tempGroupItemNoStatus,
        marketplaceInfo: null,
      };
      temp.push(tempItemsNoStatus);
    }

    if (size(packStatusCanceled) > 0) {
      const tempGroupItemCancel = [];
      const checkHaveRetail = find(
        packStatusCanceled,
        cancel =>
          cancel.status === 'canceled' &&
          get(cancel, 'marketplaceInfo.marketplace_product_type', '') === '',
      );
      packStatusCanceled.map(item => {
        const packStatus = get(item, 'status', '');
        item.products.map(product => {
          const tempProduct = { ...product, status: packStatus };
          tempGroupItemCancel.push(tempProduct);
        });
        if (
          (checkHaveRetail &&
            get(item, 'marketplaceInfo.marketplace_product_type') !==
              'dropship') ||
          !checkHaveRetail
        ) {
          item.products = tempGroupItemCancel;
          temp.push(item);
        }
      });
    }
    group.items = temp;
  });
  return assign({ shipments: tempShipments }, order);
}

export const fetchTrackingOrder = ({
  email,
  orderNumber,
}) => async dispatch => {
  try {
    const { orderHistory } = await service.get(`/account/order-history`, {
      increment_id: orderNumber,
      customer_email: email,
    });
    const [trackingOrder] = orderHistory;

    if (isEmpty(orderHistory)) {
      dispatch(fetchOrderFailed());
    } else {
      dispatch(pushOrderCompleted(orderHistory));
      dispatch(reset('tracking'));
    }
    return trackingOrder;
  } catch (error) {
    dispatch(fetchOrderFailed());
  }
};

function fetchOrderFailed() {
  return {
    type: types.ORDER_FETCH_FAILED,
    payload: {
      message: 'Failed to load order',
    },
  };
}

export const loadingOrder = () => {
  return {
    type: types.LOADING_ORDER,
  };
};

export const stopLoadingOrder = () => {
  return {
    type: types.STOP_LOADING_ORDER,
  };
};
