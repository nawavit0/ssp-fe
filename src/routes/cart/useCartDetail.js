import { useCartQuery } from '@central-tech/react-hooks/dist/query/cart';

export function useCartDetail(customer) {
  const isGuest = !(customer?.id || false);
  const guestCartId = customer?.guest?.cartId || '';
  const cartId = isGuest ? guestCartId : null;
  const { data, loading } = useCartQuery({
    variables: {
      isGuest: isGuest,
      cartId: cartId,
    },
    ssr: false,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: `no-cache`,
  });
  if (loading) return { loading };
  const { cart } = data;
  return { cart };
}
