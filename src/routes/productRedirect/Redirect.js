import React, { memo, useEffect } from 'react';
import { useProductDetailBySku } from './useProductDetailBySku';

const Redirect = ({ sku }) => {
  const { product } = useProductDetailBySku(sku);
  useEffect(() => {
    window.location.href = `/${product?.url_key}`;
  });
  return <div>Loading</div>;
};

export default memo(Redirect);
