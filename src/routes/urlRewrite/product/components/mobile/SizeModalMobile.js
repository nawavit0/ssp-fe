import React from 'react';
import styled from 'styled-components';
import { Modal } from '@central-tech/core-ui';
import { get } from 'lodash';
import { withLocales } from '@central-tech/core-ui';

const SizeModalStyled = styled.div`
  left: 10px;
  right: 10px;
  transform: translate(0, -50%);
  background-color: #fff;
  z-index: 100;
  padding: 10px 15px;
  position: fixed;
  top: 50%;
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
const SizeModalHeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  h2 {
    font-weight: bold;
    font-size: 18px;
    margin-top: 5px;
    margin-bottom: 25px;
    color: #000000;
  }
  p {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    cursor: pointer;
  }
`;
const SizeTableStyled = styled.table`
  text-align: center;
  font-size: 14px;
  padding: auto;
  margin: 0 auto;
  th {
    text-transform: uppercase;
    width: 120px;
    background-color: #565656;
    color: #fff;
    font-weight: bold;
  }
  th,
  td {
    padding: 10px 0;
  }
  td {
    color: #565656;
  }
  tr:nth-child(even) {
    background-color: #fff;
  }
  tr:nth-child(odd) {
    background-color: #f2f2f2;
  }
`;
const SizeTableSectionStyled = styled.div`
  overflow: auto;
  max-height: 60%;
`;
const SizeModalMobile = ({
  showSizeModalFlag,
  setShowSizeModalFlag,
  sizeList,
  translate,
}) => {
  const sizeTypeList = Object.keys(sizeList);
  return (
    <Modal
      visible={showSizeModalFlag}
      onModalClose={() => setShowSizeModalFlag(false)}
      closeOnClick
    >
      <SizeModalStyled>
        <SizeModalHeaderStyled>
          <h2>{translate('product_detail.size_guide')}</h2>
          <Modal.Close>
            <p>x</p>
          </Modal.Close>
        </SizeModalHeaderStyled>
        <hr />
        <SizeTableSectionStyled>
          <SizeTableStyled>
            <tbody>
              <tr>
                {sizeTypeList.map((sizeType, index) => {
                  const key = `thSizeType${index}`;
                  return <th key={key}>{sizeType}</th>;
                })}
              </tr>
              {get(sizeList, sizeTypeList[0], []).map((_, index) => {
                const key = `trSizeType${index}`;
                return (
                  <tr key={key}>
                    {sizeTypeList.map((sizeType, indexSizeType) => {
                      const key = `tdSizeType${indexSizeType}`;
                      return (
                        <td key={key}>
                          {get(sizeList, `${sizeType}[${index}].size`, [])}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </SizeTableStyled>
        </SizeTableSectionStyled>
      </SizeModalStyled>
    </Modal>
  );
};

export default withLocales(SizeModalMobile);
