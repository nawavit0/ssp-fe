import styled from 'styled-components';
import { Link } from '@central-tech/core-ui';

export const RootBreadcrumbStyled = styled.div`
  color: #0c0d10;
  display: inline-flex;
  ${props =>
    props.theme.device === 'mobile'
      ? `
      flex-direction: row-reverse;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-snap-points-y: repeat(100%);
      scroll-snap-type: x mandatory;
      scroll-snap-destination: 100% 100%;
      scroll-snap-align: end end;
      scroll-snap-coordinate: right;
      padding: 8px 0;
      > div:first-child {
        padding-right: 16px;
      }
      > div:last-child {
        padding-left: 16px;
      }
      `
      : `
      flex-wrap: wrap;
      padding: 15px 30px 13px 0px;
    `}
`;

export const InnerCrumbStyled = styled.div`
  ${props =>
    props.theme.device === 'mobile'
      ? `
  flex: 0 0 auto;
  width: auto;
  font-size: 10px;
  scroll-snap-align: end end;
  > a {
    color: #0C0D10;
  }`
      : `
  font-size: 14px;
  white-space: nowrap;
  max-width: calc(100% - 26px);
  overflow: hidden;
  text-overflow: ellipsis;`}

  line-height: 150%;
  vertical-align: middle;
  text-transform: capitalize;
  display: inline-block;
  img {
    margin: 0 10px;
  }
  &:not(:last-of-type) {
    ${props =>
      props.theme.device === 'mobile'
        ? `
    &::before {
      content: '';
      display: inline;
      padding: 0 8px;
      color: #b5b5b5;
      width: 8px;
      height: 8px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 7px;
      background-image: url('/static/icons/IosArrowRightBreadCrumb.svg');
    }`
        : `&::after {
      content: '';
      display: inline;
      padding: 0 8px;
      color: #b5b5b5;
      width: 13px;
      height: 13px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url('/static/icons/IosArrowRightBreadCrumb.svg');
    }`}
  }
`;

export const LinkStyled = styled(Link)`
  font-size: unset;
`;
