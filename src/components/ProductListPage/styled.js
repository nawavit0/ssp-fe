import styled from 'styled-components';
import { Row, Button } from '@central-tech/core-ui';

export const CustomRowStyled = styled(Row)`
  margin-bottom: 65px;
  padding: 0px;
`;
export const ResultProductBlockStyled = styled.div`
  margin: 8px 16px;
  padding: 8px;
  text-align: right;
  ${props =>
    props.customProp === `loadmore`
      ? `margin: 0 auto; text-align: center;`
      : ''}
`;
export const ResultProductTextStyled = styled.div`
  height: 38px;
  vertical-align: middle;
  padding: 8px;
  line-height: 150%;
  display: inline-block;
  color: #6f6f6f;
  font-size: 12px;
  ${props =>
    props.theme.device === 'mobile'
      ? `
      padding: 0 0 10px 0;
      height: auto;
    `
      : ''}
`;
export const PageSwitcherStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  flex-direction: column;
`;
export const TitleProductStyled = styled.h1`
  text-align: center;
  font-weight: bold;
  font-size: 26px;
  color: #333333;
  margin-bottom: 20px;
  margin-top: 15px;
  text-transform: uppercase;
`;
export const TextElStyled = styled.h3`
  text-align: left;
  font-size: 14px;
  color: #333333;
  ${props => (props.theme.device === 'mobile' ? `text-align: center;` : '')}
`;
export const BlockCMSBrandStyled = styled.div`
  margin: 16px;
`;
export const TitlePLPStyled = styled.ul`
  margin: 16px;
  padding-left: 0;
  list-style: none;
  h1 {
    text-align: left;
    font-size: 40px;
    margin-bottom: 10px;
  }
  label {
    padding: 0 !important;
    display: block;
    text-align: center;
  }
  img {
    user-select: none;
  }
  .collapse-open {
    display: none;
  }
  .collapse-btn {
    cursor: pointer;
  }
  .collapse-open:checked ~ .collapse-panel {
    display: block;
    visibility: visible;
    height: auto;
  }
  .collapse-open ~ .collapse-panel {
    visibility: hidden;
    height: 0;
    overflow: hidden;
  }
  .collapse-panel {
    max-height: 42px;
    transition: max-height 100ms, opacity: 0.3s;
    transform: translate3d(0, 0, 0);
    overflow: hidden;
    > .collapse-read {
      cursor: pointer;
      display: block;
      opacity: 1;
    }
    &[data-hide='false'] {
      max-height: 100%;
      overflow: auto;
      > .collapse-read {
        display: none;
        opacity: 0;
      }
    }
  }
  .collapse-open ~ .collapse-btn:before {
    content: '';
    width: 24px;
    height: 24px;
    transform: translate3d(-16px, 16px, 0);
    background-image: url('/icons/arrow-down.svg');
    float: right;
  }
  .collapse-open:checked ~ .collapse-btn:before {
    content: '';
    background-image: url('/icons/arrow-up.svg');
  }
  .collapse-open ~ .collapse-btn[data-hide='0']:before {
    background: none;
  }
  ${props =>
    props.theme.device === 'mobile'
      ? `
      text-align: center;
      margin-top: 8px;
      label {
        h1 {
          font-size: 23px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 0;
            line-height: 1;
            text-align: center;
          }
      }
      .collapse-panel {
        max-height: 28px;
      }
    `
      : ''}
`;
export const ParagraphLabelStyled = styled.p`
  font-size: 14px;
  line-height: 150%;
  vertical-align: middle;
  margin: 0;
  ${props =>
    props.theme.device === 'mobile'
      ? `
      text-align: left;
      word-break: break-word;
    `
      : ''}
`;
export const ParagraphLabelMobileStyled = styled(ParagraphLabelStyled)`
  font-size: 10px;
`;
export const ReadMoreStyled = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  height: 21px;
  z-index: 2;
  background: #fff;
  padding: 0 3px;
  color: rgb(28, 60, 192);
  font-size: 14px;
  line-height: 150%;
  vertical-align: middle;
`;
export const ReadMoreMobileStyled = styled(ReadMoreStyled)`
  font-size: 10px;
  vertical-align: middle;
  height: 13px;
`;
export const ProgressListStyled = styled.div`
  width: 240px;
  height: 3px;
  margin-bottom: 16px;
  background: #e4e4e4;
  > div {
    ${props => props.customStyled || ''}
    transition: all 300ms;
    background: #283137;
    height: 3px;
  }
`;
export const CustomButtonDesktopStyled = styled(Button)`
  width: 298px;
  border: 1px solid #d7d7d7;
  font-size: 16px;
  color: #1e1e1e;
  font-weight: bold;
  transition: all 300ms;
  background: rgb(247, 247, 247);
  :hover {
    color: #1e1e1e;
    background: rgb(247, 247, 247);
  }
  img {
    margin-top: -3px;
    margin-left: 6px;
  }
`;
export const CustomButtonMobileStyled = styled(Button)`
  width: 298px;
  border: 1px solid #d7d7d7;
  font-size: 16px;
  color: #1e1e1e;
  font-weight: bold;
  transition: all 300ms;
  background: rgb(247, 247, 247);
  :hover {
    color: #1e1e1e;
    background: rgb(247, 247, 247);
  }
  img {
    margin-top: -3px;
    margin-left: 6px;
  }
`;
export const FilterAndSortBoxMobileStyled = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  background: #000;
  color: #fff;
  margin: 0;
  label {
    color: #fff;
    cursor: pointer;
    line-height: 20px;
    vertical-align: middle;
    font-size: 18px;
    padding: 12px 16px;
    text-transform: uppercase;
    width: 100%;
    text-align: center;
    > img {
      margin-left: 8px;
      margin-top: -4px;
      height: 20px;
    }
  }
  > div {
    display: flex;
    flex: 1;
    justify-content: center;
    &:nth-child(1) {
      border-right: 1px solid #fff;
      margin-left: -1px;
    }
  }
`;
export const FilterAndSortRowMobileStyled = styled(Row)`
  position: -webkit-sticky;
  position: sticky;
  top: 76px;
  z-index: 5;
  background-color: #fff;
`;
export const SubCategoryRowMobileStyled = styled(Row)`
  margin-bottom: 10px;
`;
export const FiltersStyled = styled.div`
  display: ${props => (props.isDisplay ? 'block' : 'none')};
`;
export const ProductGridDesktopStyled = styled.div`
  display: grid;
  width: 248px;
  margin: 0 12px;
`;
export const ProductGridMobileStyled = styled.div`
  display: grid;
  margin: 0 5px;
`;
export const HideTextStyled = styled.div`
  margin: 0;
  float: right;
  color: rgb(28, 60, 192);
  cursor: pointer;
  font-size: 14px;
`;
export const HideTextMobileStyled = styled(HideTextStyled)`
  font-size: 10px;
`;
