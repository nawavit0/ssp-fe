import React from 'react';
import styled from 'styled-components';
import { Modal } from '@central-tech/core-ui';
import { withLocales } from '@central-tech/core-ui';

const InsufficientStockModalStyled = styled.div`
  width: 500px;
  height: auto;
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 15px 15px 60px;
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
const InsufficientStockModalHeaderStyled = styled.div`
  p {
    text-align: right;
    font-size: 30px;
    font-weight: bold;
    margin: 0;
    cursor: pointer;
    line-height: 1;
  }
`;
const InsufficientStockModalContentStyled = styled.div`
  text-align: center;
  p {
    font-size: 24px;
    color: #000000;
    font-weight: bold;
  }
  button {
    height: 50px;
    width: 233px;
    background-color: #13283f;
    color: #ffffff;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
`;
const InsufficientStockModal = ({
  showInsufficientStockFlag,
  setShowInsufficientStockFlag,
  translate,
}) => {
  return (
    <Modal
      visible={showInsufficientStockFlag}
      onModalClose={() => setShowInsufficientStockFlag(false)}
      closeOnClick
    >
      <InsufficientStockModalStyled>
        <InsufficientStockModalHeaderStyled>
          <Modal.Close>
            <p>x</p>
          </Modal.Close>
        </InsufficientStockModalHeaderStyled>
        <InsufficientStockModalContentStyled>
          <p>{translate('product_detail.insufficient_stock')}</p>
          <Modal.Close>
            <button>{translate('product_detail.ok')}</button>
          </Modal.Close>
        </InsufficientStockModalContentStyled>
      </InsufficientStockModalStyled>
    </Modal>
  );
};

export default withLocales(InsufficientStockModal);
