import React from 'react';
import { FooterAddToCartStyled } from './styled';

const AddToCartBoxMobile = props => {
  const { handleAddToCart, addToCartStatus, translate } = props;
  const isAddedToCart =
    addToCartStatus === translate('product_detail.added_to_cart');
  return (
    <FooterAddToCartStyled onClick={() => handleAddToCart(props)}>
      {isAddedToCart && <img src="/static/icons/CorrectSignal.svg" />}
      {addToCartStatus || translate('product_detail.add_to_cart')}
    </FooterAddToCartStyled>
  );
};

export default AddToCartBoxMobile;
