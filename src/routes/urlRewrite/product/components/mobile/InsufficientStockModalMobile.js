import React from 'react';
import styled from 'styled-components';
import { Modal } from '@central-tech/core-ui';
import { withLocales } from '@central-tech/core-ui';

const InsufficientStockModalStyled = styled.div`
  height: auto;
  position: fixed;
  left: 10px;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #fff;
  padding: 10px 15px 50px;
  z-index: 100;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  hr {
    position: absolute;
    top: 40px;
    left: 0px;
    width: 100%;
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
  }
`;
const InsufficientStockModalContentStyled = styled.div`
  text-align: center;
  p {
    font-size: 20px;
    color: #000000;
    font-weight: bold;
    margin-bottom: 35px;
  }
  button {
    height: 39px;
    width: 100%;
    background-color: #13283f;
    color: #ffffff;
    font-size: 15px;
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
