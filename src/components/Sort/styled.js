import styled, { keyframes } from 'styled-components';

const textPopUpBottom = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(-38px);
            transform: translateY(-38px);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    z-index: -1;
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    z-index: 1;
  }
`;
export const DropdownBlockStyled = styled.div`
  height: 44px;
  padding-top: 12px;
  width: ${props => props.widthStyled || '200px'};
  margin: ${props => props.marginStyled || '0px'};
  background: transparent;
  display: inline-block;
  cursor: pointer;
  line-height: 150%;
  color: #373737;
  position: relative;
  transition: all 300ms ease;
  -webkit-transition: all 300ms ease;
  -moz-transition: all 300ms ease;
  &.active {
    z-index: 3;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  }
  z-index: 2;
  user-select: none;
`;
export const DropdownListStyled = styled.div`
  position: absolute;
  top: calc(100% - 1px);
  left: -1px;
  width: ${props => props.widthStyled || '200px'};
  list-style: none;
  text-align: left;
  border: 1px solid #e1e1e1;
  border-top: 1px solid #e1e1e1;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  -webkit-animation: ${textPopUpBottom} 0.3s
    cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: ${textPopUpBottom} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  overflow: visible;
`;
export const DropdownListItemStyled = styled.div`
  background-color: ${props => (props.isSelected ? '#f4f4f4' : '#fff')};
  padding: 12px 16px;
  height: auto;
  font-size: 16px;
  vertical-align: middle;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: 15px;
  }
`;
export const DropdownText = styled.div`
  position: relative;
  background: #000;
  z-index: 11;
  display: flex;
  justify-content: center;
  margin-top: -12px;
`;
