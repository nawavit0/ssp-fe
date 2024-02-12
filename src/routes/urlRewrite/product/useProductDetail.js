import { useProductQuery } from '@central-tech/react-hooks/dist/query/product';

export function useProductDetail(slug) {
  const { data, loading } = useProductQuery({
    variables: {
      url: slug,
    },
  });
  if (loading) return { loading };
  if (data) {
    const { product } = data;
    return {
      product,
    };
  }
  return {};
}
