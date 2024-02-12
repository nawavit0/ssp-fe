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

// const textPopUpTop = keyframes`
//   0% {
//     opacity: 0;
//     -webkit-transform: translateY(0);
//             transform: translateY(0);
//     -webkit-transform-origin: 50% 50%;
//             transform-origin: 50% 50%;
//     z-index: -1;
//   }
//   100% {
//     opacity: 1;
//     -webkit-transform: translateY(38px);
//             transform: translateY(38px);
//     -webkit-transform-origin: 50% 50%;
//             transform-origin: 50% 50%;
//     z-index: 1;
//   }
// `;

export const OutterBlockStyled = styled.div`
  margin: 8px 16px;
`;
export const LabelDropdownStyled = styled.label`
  color: #6f6f6f;
  font-size: 12px;
`;
export const DropdownBlockStyled = styled.div`
  height: 38px;
  width: ${props => props.widthStyled || '200px'};
  margin: ${props => props.marginStyled || '0px'};
  display: inline-block;
  cursor: pointer;
  line-height: 150%;
  color: #373737;
  position: relative;
  transition: all 300ms ease;
  -webkit-transition: all 300ms ease;
  -moz-transition: all 300ms ease;
  border: 1px solid #e1e1e1;
  &.active {
    z-index: 2;
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
export const ArrowDropdownStyled = styled.div`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  -webkit-transform: translate3d(0, -50%, 0);
  -moz-transform: translate3d(0, -50%, 0);
  img {
    transition: all 300ms;
    -webkit-transition: all 300ms;
    -moz-transition: all 300ms;
  }
`;
export const DropdownListStyled = styled.div`
  position: absolute;
  top: calc(100% - 1px);
  left: -1px;
  width: ${props => props.widthStyled || '200px'};
  list-style: none;
  text-align: left;
  background-color: #fff;
  border: 1px solid #e1e1e1;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  border-top: 1px solid #e1e1e1;
  -webkit-animation: ${textPopUpBottom} 0.3s
    cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: ${textPopUpBottom} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  overflow: visible;
`;
export const DropdownListItemStyled = styled.div`
  padding: 8px;
  height: 38px;
  font-size: 12px;
  :hover {
    background: #eee;
  }
`;
export const DropdownText = styled.div`
  padding: 8px;
  position: relative;
  background: #fff;
  z-index: 1;
`;
