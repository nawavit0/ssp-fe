import { useWishListQuery } from '@central-tech/react-hooks/dist/query/wishList';

export function useWishListDetail() {
  const { data, loading } = useWishListQuery({
    variables: {
      filter: {
        filterGroups: [],
      },
      ssr: false,
      withProduct: true,
    },
  });
  if (loading) return { loading };
  if (data) {
    const { wishlists } = data;
    return {
      wishlists,
    };
  }
  return {};
}
