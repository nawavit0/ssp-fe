import React from 'react';
import styled from 'styled-components';
import { withLocales } from '@central-tech/core-ui';

const DeleteCartItemStyled = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
const DeleteCartItem = ({
  id,
  deleteCartItemHandler,
  productId,
  product,
  qty,
  parentSku,
  translate,
}) => {
  return (
    <DeleteCartItemStyled
      id={id}
      onClick={() => deleteCartItemHandler(productId, product, qty, parentSku)}
      alt={translate('icon.trash')}
      src={`/static/icons/Bin.svg`}
    />
  );
};

export default withLocales(DeleteCartItem);
