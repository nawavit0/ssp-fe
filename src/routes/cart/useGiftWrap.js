import {
  useAddGiftWrapMessageMutation,
  useDeleteGiftWrapMessageMutation,
} from '@central-tech/react-hooks';

export const useGiftWrap = customer => {
  const options = {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    refetchQueries: ['cart', 'cartMini'],
  };
  const isGuest = !(customer?.id || false);
  const guestCartId = customer?.guest?.cartId || '';
  const cartId = isGuest ? guestCartId : null;
  const [addGiftWrapMessage] = useAddGiftWrapMessageMutation(options);
  const [deleteGiftWrapMessage] = useDeleteGiftWrapMessageMutation(options);
  return {
    add(message) {
      return addGiftWrapMessage({
        variables: {
          input: {
            isGuest,
            cartId,
            message,
          },
        },
      });
    },
    delete() {
      return deleteGiftWrapMessage({
        variables: {
          input: {
            isGuest,
            cartId,
          },
        },
      });
    },
  };
};
