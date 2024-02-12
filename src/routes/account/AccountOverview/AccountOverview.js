import React, { useEffect } from 'react';
import { find } from 'lodash';
//import { OrderSearchWidget } from '@central-tech/core-ui';
import {
  searchFilterGroup,
  setFilterSearchFromQueryParams,
} from '../../../utils/searchFilter';
import AccountOverviewContainer from './AccountOverviewContainer';
import { connect } from 'react-redux';
import { fetchOrderHistory } from '../../../reducers/order/actions';

const AccountOverview = props => {
  const { customer, fetchOrderHistory, orderHistory } = props;
  const activeFilters = [];
  useEffect(() => {
    const customFilterGroups = searchFilterGroup({
      activeFilters: activeFilters,
      type: 'order',
    });
    const filter = {
      filterGroups: customFilterGroups,
      page: 1,
      sortOrders: [{ field: 'created_at', direction: 'DESC' }],
      size: 1,
    };

    fetchOrderHistory(1, 1, filter);
  }, [activeFilters, fetchOrderHistory]);
  const customerId = customer?.id || 0;
  const defaultBillingId = customer?.default_billing || null;
  const defaultShippingId = customer?.default_shipping || null;
  const customerAddress = customer?.addresses || [];

  let defaultBillingAddress = false;
  if (defaultBillingId !== null) {
    defaultBillingAddress = find(
      customerAddress,
      address => parseInt(address.id) === parseInt(defaultBillingId),
    );
  }

  let defaultShippingAddress = false;
  if (defaultShippingId !== null) {
    defaultShippingAddress = find(
      customerAddress,
      address => parseInt(address.id) === parseInt(defaultShippingId),
    );
  }

  const customerFilter = setFilterSearchFromQueryParams(
    'customer_id',
    customerId,
    false,
  );
  activeFilters.push(customerFilter);

  return (
    <AccountOverviewContainer
      customer={customer}
      defaultShipping={defaultShippingAddress}
      defaultBilling={defaultBillingAddress}
      orders={orderHistory}
    />
  );
};

const mapStateToProps = state => ({
  accountInfo: state.account.accountInfo,
  customer: state.customer.customer,
  loading: state.customer.loading,
  orderHistory: state.order.orderHistory,
});

const matchDispatchToProps = dispatch => ({
  fetchOrderHistory: (page, limit, filters) =>
    dispatch(fetchOrderHistory(page, limit, filters)),
});

export default connect(mapStateToProps, matchDispatchToProps)(AccountOverview);
