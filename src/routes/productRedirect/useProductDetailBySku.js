import { useProductSearchQuery } from '@central-tech/react-hooks/dist/query/productSearch';

export function useProductDetailBySku(sku) {
  const { data, loading } = useProductSearchQuery({
    variables: {
      filterGroups: [
        { filters: [{ field: 'sku', value: sku, conditionType: 'eq' }] },
      ],
      page: 1,
      size: 1,
    },
  });
  if (loading) return { loading };
  const { productSearch } = data;
  return {
    product: productSearch?.products?.[0],
  };
}
