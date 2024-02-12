import React from 'react';
import styled from 'styled-components';

const SizeTypeBox = ({ sizeType, setSelectedSizeType, className }) => {
  return (
    <button
      className={className}
      onClick={() => {
        setSelectedSizeType(sizeType);
      }}
    >
      {sizeType}
    </button>
  );
};
const SizeTypeBoxStyled = styled(SizeTypeBox)`
  background-color: ${props => (props.isSelected ? '#17212C' : '#fff')};
  color: ${props => (props.isSelected ? '#fff' : '#000000')};
  border: 1px solid #b7b7b7;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-width: 48px;
  width: auto;
  height: 48px;
  font-size: 14px;
`;

export default SizeTypeBoxStyled;
