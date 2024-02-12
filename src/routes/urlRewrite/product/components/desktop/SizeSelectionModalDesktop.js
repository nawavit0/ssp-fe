import React from 'react';
import { withLocales, Modal } from '@central-tech/core-ui';
import styled from 'styled-components';
import SizeBox from '../SizeBox';
import SizeTypeBox from '../SizeTypeBox';

const SizeSelectionModalStyled = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: #fff;
  height: auto;
  width: 500px;
  padding: 15px 30px 30px;
`;
const SizeModalHeaderStyled = styled.div`
  text-align: right;
  p {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    cursor: pointer;
  }
`;

const SizeSelectionModalTitleStyled = styled.h3`
  color: #000000;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;
const SizeBoxLayoutStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: 15px;
  margin-bottom: 20px;
  * {
    font-size: 15px;
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;
const SizeTypeLayoutStyled = styled.div`
  display: flex;
  margin-bottom: 15px;
  > button {
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`;
const AddToBagButtonStyled = styled.button`
  width: 100%;
  background-color: #ad1500;
  color: #ffffff;
  font-size: 16px;
  height: 48px;
  cursor: pointer;
  border: none;
  text-transform: uppercase;
  &:disabled {
    pointer-events: none;
    background-color: #959697;
  }
`;

const SizeSelectionModal = ({
  sizeListSalable,
  selectedSizeList,
  selectedSizeType,
  setSelectedSizeType,
  setSelectedSize,
  selectedSize,
  showSizeSelectionModalFlag,
  setShowSizeSelectionModalFlag,
  handleAddToCart,
  addToCartStatus,
  translate,
  showSizeSelectionWishlistModalFlag,
  setShowSizeSelectionWishlistModalFlag,
  handleWishlistLoginModal,
  isWishlist,
}) => {
  return (
    <Modal
      visible={showSizeSelectionModalFlag || showSizeSelectionWishlistModalFlag}
      onModalClose={() => {
        setShowSizeSelectionModalFlag(false);
        setShowSizeSelectionWishlistModalFlag(false);
      }}
      closeOnClick
    >
      <SizeSelectionModalStyled>
        <SizeModalHeaderStyled>
          <Modal.Close>
            <p>x</p>
          </Modal.Close>
        </SizeModalHeaderStyled>
        <SizeSelectionModalTitleStyled>
          {translate('product_detail.please_select_your_size')}
        </SizeSelectionModalTitleStyled>
        <SizeTypeLayoutStyled>
          {Object.keys(sizeListSalable).map(value => {
            return (
              <SizeTypeBox
                sizeType={value}
                selectedSizeType={selectedSizeType}
                setSelectedSizeType={setSelectedSizeType}
                isSelected={selectedSizeType === value}
                key={value}
              />
            );
          })}
        </SizeTypeLayoutStyled>
        <SizeBoxLayoutStyled>
          {selectedSizeList &&
            selectedSizeList.map(size => (
              <SizeBox
                setSelectedSize={setSelectedSize}
                size={size}
                selectedSize={selectedSize}
                key={size.size}
              />
            ))}
        </SizeBoxLayoutStyled>
        <AddToBagButtonStyled
          disabled={selectedSize === ''}
          onClick={() => {
            if (showSizeSelectionWishlistModalFlag) {
              handleWishlistLoginModal();
              return;
            }
            handleAddToCart();
          }}
        >
          {showSizeSelectionWishlistModalFlag
            ? isWishlist
              ? translate('product_detail.remove_from_wishlist')
              : translate('product_detail.add_to_wishlist')
            : addToCartStatus || translate('product_detail.add_to_cart')}
        </AddToBagButtonStyled>
      </SizeSelectionModalStyled>
    </Modal>
  );
};

export default withLocales(SizeSelectionModal);
