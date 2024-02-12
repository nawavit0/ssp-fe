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
  height: 48px;
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
  &.active img {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
  }
  z-index: 2;
  user-select: none;
`;
export const DropdownListStyled = styled.div`
  position: absolute;
  top: calc(100% - 1px);
  width: ${props => props.widthStyled || '200px'};
  list-style: none;
  text-align: left;
  border-top: 1px solid #e1e1e1;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  -webkit-animation: ${textPopUpBottom} 0.3s
    cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: ${textPopUpBottom} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  overflow: visible;
`;
export const DropdownListItemStyled = styled.div`
  background-color: ${props => (props.isSelected ? '#68ce26' : '#fff')};
  color: ${props => (props.isSelected ? '#fff' : '#161616')};
  padding: 12px 16px;
  border-bottom: 1px solid #e1e1e1;
  height: auto;
  font-size: 13px;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  img {
    height: 15px;
  }
`;
export const ArrowDropdownStyled = styled.div`
  position: absolute;
  top: -2px;
  right: -28px;
  height: 48px;
  img {
    width: 26px;
    transition: all 300ms;
    -webkit-transition: all 300ms;
    -moz-transition: all 300ms;
  }
`;
export const DropdownText = styled.div`
  position: relative;
  background: #fff;
  z-index: 11;
  display: flex;
  justify-content: center;
  font-size: 13px;
  color: #161616;
  height: 48px;
  line-height: 48px;
  vertical-align: middle;
  border-bottom: 1px solid #e1e1e1;
  margin: 0 10px;
  > span {
    text-transform: uppercase;
    position: relative;
  }
`;
