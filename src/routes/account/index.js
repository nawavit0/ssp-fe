import React from 'react';
import { isEmpty, get } from 'lodash';
import AccountContainer from '../../components/Account/AccountContainer';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';
import { fetchCustomer } from '../../reducers/customer/actions';
import { listAddresses } from '@central-tech/operation/dist/query/listAddresses';
import { setActiveStoreConfig } from '../../reducers/storeConfig/actions';

async function action(context) {
  const { next, pathname, store, deviceDetect, customer } = context;
  const { dispatch } = store;
  const { activeConfig = {} } = store?.getState()?.storeConfig || {};

  await dispatch(setActiveStoreConfig(activeConfig));

  try {
    const { chunks, title, component: child } = await next();

    if (get(customer, 'id')) {
      const { data } = await context.client.query({
        query: listAddresses,
        variables: { storeCode: get(customer, 'mdcStoreCode') },
      });

      if (data.listAddresses.length > 0) {
        customer.addresses.map(value => {
          const newData = data.listAddresses.filter(
            obj => parseInt(obj.id) === parseInt(value.id),
          );
          const resultData = get(newData, '[0]');
          Object.keys(resultData).forEach(function(key) {
            value[key] = resultData[key];
          });
          return value;
        });
      }

      await store.dispatch(
        fetchCustomer(
          '',
          { currentDevice: deviceDetect.checkoutDevice },
          customer,
        ),
      );
    }
    const { isMobile } = deviceDetect;
    return {
      chunks,
      title,
      component: (
        <>
          {!isMobile ? (
            <DesktopLayout>
              <AccountContainer
                customer={customer}
                currentPath={pathname}
                isMobile={isMobile}
              >
                {child}
              </AccountContainer>
            </DesktopLayout>
          ) : (
            <MobileLayout>
              <AccountContainer
                customer={customer}
                currentPath={pathname}
                isMobile={isMobile}
              >
                {child}
              </AccountContainer>
            </MobileLayout>
          )}
        </>
      ),
      guard: {
        condition: isEmpty(customer),
        redirect: '/',
      },
    };
  } catch (error) {
    return {
      redirect: '/',
    };
  }
}

export default action;
