import React from 'react';
import styled from 'styled-components';

const AddToCartButtonStyled = styled.div`
  background-color: #ad1500;
  width: 100%;
  font-size: 24px;
  color: #fff;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  ${props => props.customStyle || ''}

  img {
    width: 20px;
    height: 20px;
    fill: white;
    margin-right: 10px;
  }
`;
const AddToCartBoxDesktop = props => {
  const {
    translate,
    handleAddToCart,
    addToCartActiveFlag,
    addToCartStatus,
    id,
    className,
    refs,
    customStyle,
  } = props;
  const isAddedToCart =
    addToCartStatus === translate('product_detail.added_to_cart');
  return (
    <AddToCartButtonStyled
      addToCartActiveFlag={addToCartActiveFlag}
      onClick={() => handleAddToCart()}
      id={id}
      className={className}
      ref={refs}
      customStyle={customStyle}
    >
      {isAddedToCart && <img src="/static/icons/CorrectSignal.svg" />}
      {addToCartStatus || translate('product_detail.add_to_cart')}
    </AddToCartButtonStyled>
  );
};

export default AddToCartBoxDesktop;
