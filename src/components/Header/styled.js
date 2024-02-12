import styled from 'styled-components';

export const CustomCollapse = styled.div`
  position: absolute;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
  ::before {
    content: ' ';
    position: absolute;
    z-index: 7;
    top: -19px;
    width: 0;
    height: 0;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-bottom: 20px solid white;
  }
`;
export const CartArea = styled.div`
  position: relative;
  img {
    cursor: pointer;
  }
`;
export const CartCollapse = styled(CustomCollapse)`
  display: ${props => (props.visible ? 'block' : 'none')};
  background-color: #ffffff;
  top: 64px;
  right: -50px;
  position: absolute;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  &::before {
    right: 54px;
  }
`;
export const TrackMyOrderArea = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 20%;
  padding: 0 20px 0 0;
  .link-track {
    cursor: pointer;
    > img {
      margin-right: 4px;
    }
  }
`;
export const TrackMyOrderCollapse = styled(CustomCollapse)`
  display: ${props => (props.visible ? 'block' : 'none')};
  background-color: #ffffff;
  top: 50px;
  position: absolute;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  &::before {
    right: 54px;
  }
  z-index: 10;
`;
export const DesktopCartQty = styled.div`
  position: absolute;
  font-weight: 700;
  left: 28px;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  top: 11px;
  color: #fff;
  background: #ed1c24;
  padding: 0 6px;
  border-radius: 50%;
  font-size: 13px;
`;
export const MobileCartQty = styled.div`
  position: absolute;
  font-weight: 700;
  left: 11px;
  top: 10px;
  font-size: 10px;
  min-width: 19px;
  height: 19px;
  line-height: 19px;
  padding: 0;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  color: #fff;
  background: #ed1c24;
  padding: 0 6px;
  border-radius: 50%;
`;
export const DesktopWishlistQty = styled.div`
  position: absolute;
  font-weight: 700;
  left: 21px;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  top: 11px;
  color: #fff;
  background: #ed1c24;
  padding: 0 6px;
  border-radius: 50%;
  font-size: 13px;
`;
export const MobileWishlistQty = styled.div`
  position: absolute;
  font-weight: 700;
  left: 11px;
  top: 10px;
  font-size: 10px;
  min-width: 19px;
  height: 19px;
  line-height: 19px;
  padding: 0;
  vertical-align: middle;
  display: flex;
  justify-content: center;
  color: #fff;
  background: #ed1c24;
  padding: 0 6px;
  border-radius: 50%;
`;
export const LangCollapse = styled(CustomCollapse)`
  background-color: #ffffff;
  top: 50px;
  padding: 20px;
`;
export const ChangeLanguageStyled = styled.a`
  display: flex;
  cursor: pointer;
  ${props => props.customStyle || ''}
  span {
    color: #000000;
    padding: 0 0px 0px 10px;
    line-height: 30px;
  }
  .active {
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
  }
`;
export const ButtonLanguageStyled = styled.div`
  float: left;
  span {
    padding: 0px 0px 0px 6px;
    display: inline-block;
    color: ${props => props.color || '#ffffff'};
  }
`;
export const CustomerInfoStyled = styled.div`
  position: relative;
  cursor: pointer;
`;
export const ButtonCollapseStyled = styled.div`
  display: flex;
  margin: 10px 0 0 15px;
  min-width: 130px;
  position: relative;
`;
export const TextLoginStyled = styled.div`
  margin: 17px 0 0 5px;
`;
export const LoginCollapse = styled(CustomCollapse)`
  left: -70px;
  top: 65px;
  z-index: 2;
  width: 400px;
  transform: translateX(-32%);
  ${props =>
    props.visible &&
    `
  ::before {
    left: 263px;
  }
  `}
`;
export const AfterLoginStyled = styled.div`
  padding: 2px 0px 0px 8px;
  height: 40px;
`;
export const BeforeLoginStyled = styled.div`
  padding: 2px 0px 0px 5px
  height: 40px;
`;
export const AfterLoginMenuStyled = styled.div`
  background-color: #ffffff;
`;
export const AfterLoginCollapse = styled(CustomCollapse)`
  top: 65px;
  z-index: 2;
  width: 220px;
  transform: translateX(-32%);
  ::before {
    left: 120px;
  }
`;
export const CustomerMenuStyled = styled.div`
  padding: 5px 15px 10px;
  a {
    line-height: 3;
    display: block;
    font-size: 14px;
    color: #393939;
  }
  a:last-child {
    border-bottom: 1px solid #ccc;
  }
`;
export const WelcomeNameStyled = styled.div`
  font-weight: 700;
  text-overflow: ellipsis;
`;
export const CustomerLogoutStyled = styled.div`
  padding: 10px 15px 20px;
  cursor: pointer;
  a {
    font-weight: 700;
    color: #0b233d;
    font-size: 14px;
  }
`;
