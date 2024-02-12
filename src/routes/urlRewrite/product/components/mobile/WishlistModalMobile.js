import React from 'react';
import styled from 'styled-components';
import { Modal, Link, withLocales } from '@central-tech/core-ui';
import ImageV2 from '../../../../../components/Image/ImageV2';

const WishlistLoginModalStyled = styled.div`
  width: 95%;
  height: auto;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 10px 15px 45px;
  z-index: 100;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  hr {
    position: absolute;
    top: 40px;
    left: 0px;
    width: 100vw;
    border: 0.5px solid #d5d6d7;
  }
`;
const WishlistLoginModalHeaderStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  p {
    text-align: right;
    font-size: 30px;
    font-weight: bold;
    margin: 0;
    cursor: pointer;
    line-height: 1;
  }
`;
const WishlistLoginModalContentStyled = styled.div`
  text-align: center;
  p {
    font-size: 20px;
    color: #000000;
    font-weight: bold;
    word-wrap: break-word;
  }
  > .login-button > button {
    height: 50px;
    width: 100%;
    background-color: #13283f;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
`;

const WishlistModalMobile = ({
  showWishlistModalFlag,
  setShowWishlistModalFlag,
  wishlistUrl,
  translate,
}) => {
  return (
    <Modal
      visible={showWishlistModalFlag}
      onModalClose={() => setShowWishlistModalFlag(false)}
      closeOnClick
    >
      <WishlistLoginModalStyled>
        <WishlistLoginModalHeaderStyled>
          <Modal.Close>
            {/* <p>x</p> */}
            <ImageV2 src={'/static/icons/CloseIconBold.svg'} width={'20px'} />
          </Modal.Close>
        </WishlistLoginModalHeaderStyled>
        <WishlistLoginModalContentStyled>
          <p>
            {translate('product_detail.please_login')}
            <br />
            {translate('product_detail.to_add_products_to_wishlist')}
          </p>
          <Link className="login-button" to={wishlistUrl}>
            <button>{translate('product_detail.button_login')}</button>
          </Link>
        </WishlistLoginModalContentStyled>
      </WishlistLoginModalStyled>
    </Modal>
  );
};

export default withLocales(WishlistModalMobile);
