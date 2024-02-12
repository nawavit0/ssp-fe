import { useWishListQuery } from '@central-tech/react-hooks/dist/query/wishList';

export function useWishlist() {
  const { data, loading } = useWishListQuery({
    variables: {
      filter: {
        filterGroups: [],
      },
      withProduct: true,
    },
    ssr: false,
  });
  if (loading) return { loading };
  const { wishlists } = data;
  return wishlists;
}

export function useWishlistNotProduct() {
  const { data, loading } = useWishListQuery({
    variables: {
      filter: {
        filterGroups: [],
      },
    },
    ssr: false,
  });
  if (loading) return { loading };
  const { wishlists } = data;
  return wishlists;
}
