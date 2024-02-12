import {
  useCreateWishlistItemMutation,
  useDeleteWishlistItemMutation,
} from '@central-tech/react-hooks';

export function useAddToWishlist() {
  const [addToWishlist] = useCreateWishlistItemMutation();
  return {
    addToWishlist: async ({
      wishlistId = 0,
      productId = 0,
      customerAttributes = [],
    } = {}) => {
      return await addToWishlist({
        refetchQueries: ['wishList'],
        variables: {
          input: {
            wishlist_id: wishlistId,
            product_id: productId,
            custom_attributes: customerAttributes,
          },
        },
      });
    },
  };
}

export function useDeleteFromWishlist() {
  const [deleteFromWishlist] = useDeleteWishlistItemMutation();
  return {
    deleteFromWishlist: async ({ itemId = 0 } = {}) => {
      return await deleteFromWishlist({
        refetchQueries: ['wishList'],
        variables: {
          id: itemId,
        },
      });
    },
  };
}
