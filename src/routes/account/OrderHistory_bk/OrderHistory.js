import React, { useState } from 'react';

import { OrderSearchWidget, CustomerWidget } from '@central-tech/core-ui';
import FullPageLoader from '../../../components/FullPageLoader';

import OrderHistoryContainer from './OrderHistoryContainer';
import {
  searchFilterGroup,
  setFilterSearchFromQueryParams,
} from '../../../utils/searchFilter';

const OrderHistory = () => {
  const [searchFilter, setSearchFilter] = useState({
    page: 1,
    dateTo: '',
    dateFrom: '',
    startDate: '',
    endDate: '',
    incrementId: '',
  });
  return (
    <CustomerWidget ssr={false}>
      {({ data, loading }) => {
        if (loading) return <FullPageLoader />;
        const customer = data?.customer || {};
        const customerId = customer?.id || 0;
        const activeFilters = [];
        const customerFilter = setFilterSearchFromQueryParams(
          'customer_id',
          customerId,
          false,
        );
        activeFilters.push(customerFilter);
        if (searchFilter.incrementId !== '') {
          const incrementIdFilter = setFilterSearchFromQueryParams(
            'increment_id',
            searchFilter.incrementId,
            false,
          );
          activeFilters.push(incrementIdFilter);
        }
        if (
          searchFilter.dateTo !== '' &&
          searchFilter.dateTo !== 'Invalid date'
        ) {
          const dateToFilter = setFilterSearchFromQueryParams(
            'created_at',
            searchFilter.dateTo,
            'to',
          );
          activeFilters.push(dateToFilter);
        }
        if (
          searchFilter.dateFrom !== '' &&
          searchFilter.dateFrom !== 'Invalid date'
        ) {
          const dateToFilter = setFilterSearchFromQueryParams(
            'created_at',
            searchFilter.dateFrom,
            'from',
          );
          activeFilters.push(dateToFilter);
        }
        const customFilterGroups = searchFilterGroup({
          activeFilters: activeFilters,
          type: 'order',
        });
        const filter = {
          filterGroups: customFilterGroups,
          page: searchFilter.page,
          sortOrders: [{ field: 'created_at', direction: 'DESC' }],
          size: 5,
        };

        return (
          <OrderSearchWidget filter={filter} ssr={false}>
            {({ data, loading }) => {
              const orders = data?.orders?.items || {};
              const total = data?.orders?.total_count || 0;
              return (
                <OrderHistoryContainer
                  orders={orders}
                  total={total}
                  loading={loading}
                  searchFilter={searchFilter}
                  setSearchFilter={setSearchFilter}
                />
              );
            }}
          </OrderSearchWidget>
        );
      }}
    </CustomerWidget>
  );
};

export default OrderHistory;
