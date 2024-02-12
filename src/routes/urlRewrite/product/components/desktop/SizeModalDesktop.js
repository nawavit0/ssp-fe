import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { withLocales } from '@central-tech/core-ui';
import OutsideClickHandler from 'react-outside-click-handler';

const SizeModalStyled = styled.div`
  position: absolute;
  height: 365px;
  width: 100%;
  overflow: auto;
  background-color: #fff;
  z-index: 2;
  padding: 15px 20px;
  display: ${props => (props.showSizeModalFlag ? 'absolute' : 'none')};
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
`;
const SizeModalHeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  h2 {
    font-weight: bold;
    font-size: 18px;
    margin-top: 5px;
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
  table-layout: fixed;
  width: 100%;
  text-align: center;
  font-size: 14px;
  padding: auto;
  th {
    text-transform: uppercase;
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
  max-height: 80%;
  overflow: auto;
`;
const SizeModalDesktop = ({
  showSizeModalFlag,
  setShowSizeModalFlag,
  sizeList,
  translate,
}) => {
  const sizeTypeList = Object.keys(sizeList);
  return (
    <OutsideClickHandler
      onOutsideClick={() => setShowSizeModalFlag(false)}
      disabled={!showSizeModalFlag}
    >
      <SizeModalStyled showSizeModalFlag={showSizeModalFlag}>
        <SizeModalHeaderStyled>
          <h2>{translate('product_detail.size_guide')}</h2>
          <p onClick={() => setShowSizeModalFlag(false)}>x</p>
        </SizeModalHeaderStyled>
        <SizeTableSectionStyled>
          <SizeTableStyled>
            <tbody>
              <tr>
                {sizeTypeList.map((sizeType, index) => {
                  return <th key={`${sizeType}${index}`}>{sizeType}</th>;
                })}
              </tr>
              {get(sizeList, sizeTypeList[0], []).map((_, index) => {
                return (
                  <tr key={`trSizeTable${index}`}>
                    {sizeTypeList.map((sizeType, indexSizeType) => {
                      return (
                        <td key={`tdSizeTable${indexSizeType}`}>
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
    </OutsideClickHandler>
  );
};

export default withLocales(SizeModalDesktop);
