import {
  useOrdersQuery,
  useOrdersLazyQuery,
  useOrderByEmailLazyQuery,
} from '@central-tech/react-hooks';

export function useOrders(filter, conditionSkip) {
  const { data, loading } = useOrdersQuery({
    variables: { filter: filter },
    skip: conditionSkip,
  });
  if (loading) return { loading };
  const orders = data?.orders;
  return { orders };
}

export function useOrdersLazy() {
  const [findOrders, result] = useOrdersLazyQuery();
  return [filter => findOrders({ variables: { filter: filter } }), result];
}

export function useOrderByEmailLazy() {
  const [findOrderByEmail, result] = useOrderByEmailLazyQuery();

  return [
    ({ email, incrementId }) =>
      findOrderByEmail({
        variables: {
          email: email,
          incrementId: incrementId,
        },
      }),
    result,
  ];
}
