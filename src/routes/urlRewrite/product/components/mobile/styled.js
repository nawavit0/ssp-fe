import styled from 'styled-components';

export const ProductLayoutMobileStyled = styled.div`
  margin: 16px;
`;
export const ProductFlexBoxStyled = styled.div`
  display: flex;
  margin-bottom: 8px;
`;
export const ProductNameStyled = styled.h1`
  font-size: 12px;
  font-weight: 400;
  color: #474747;
`;
export const ProductPriceBoxStyled = styled.div`
  width: 40%;
  text-align: right;
`;
export const ProductNameBoxStyled = styled.div`
  width: 60%;
`;
export const ProductSalePriceStyled = styled.div`
  color: #dd0000;
  font-size: 15px;
`;
export const ProductOldPriceStyled = styled.div`
  color: #5c5c5c;
  font-size: 12px;
  text-decoration: line-through;
`;
export const ProductSellerStyled = styled.div`
  color: #919090;
  font-size: 10px;
  text-align: right;
  width: 100%;
`;
export const SeparateLineStyled = styled.div`
  border-bottom: 1px solid #d5d6d7;
`;
export const SocialStyled = styled.div`
  display: flex;
  margin: 10px 0 14px 15px;
  p {
    margin: auto 8px auto 0;
    display: flex;
    font-size: 11.7px;
    color: #000000;
    font-weight: bold;
  }
`;
export const SocialIconStyled = styled.div`
  display: flex;
  justify-content: space-between;
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
  }
  a {
    &:not(:last-child) {
      margin-right: 9px;
    }
  }
`;
export const DeliveryAndReturnStyled = styled.div`
  margin: 14px;
`;
export const ProductMobileFooterStyled = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 2;
  -webkit-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  padding: 0 0 18px 0;
`;
export const ProductMobileFooterLayoutStyled = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  margin-bottom: 0;
`;
export const FooterPriceStyled = styled.div`
  padding: 5px 0 0 5px;
`;
export const FooterInitialSalePriceStyled = styled.p`
  color: #dd0000;
  font-size: 20px;
  margin: 0;
`;
export const FooterInitialOldPriceStyled = styled.p`
  color: #5c5c5c;
  font-size: 10px;
  margin: 0;
  text-decoration: line-through;
`;
export const FooterAddToCartDescriptionStyled = styled.div`
  padding: 10px 10px 5px 0;
  text-align: center;
`;
export const FooterDeliveryPolicyStyled = styled.div`
  margin: 0 10px;
`;
export const FooterAddToCartStyled = styled.div`
  height: 46px;
  background-color: #ad1500;
  padding: 16px auto;
  color: #ffffff;
  font-size: 17px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 16px;
    height: 16px;
    fill: white;
    margin-right: 10px;
  }
`;
export const QuantityStyled = styled.div`
  margin-top: 12px;
  h3 {
    color: #0d0d0d;
    margin-bottom: 10px;
    margin-right: 30px;
    font-weight: bold;
    font-size: 12px;
  }
`;
export const SizeStyled = styled.div`
  position: relative;
  margin: 12px 0;
  h3 {
    font-size: 12px;
    color: #000000;
    margin-bottom: 10px;
    font-weight: bold;
  }
`;
export const SizeGuideLabelStyled = styled.div`
  margin-left: 5px;
  right: 0px;
  cursor: pointer;
  position: absolute;
  p {
    font-size: 12px;
    margin: 0;
    display: inline-block;
    vertical-align: top;
  }
  img {
    width: 59px;
    position: absolute;
    top: -6px;
    right: 0px;
  }
`;
export const SizeTypeStyled = styled.div`
  margin-bottom: 12px;
  display: flex;
  button {
    height: 48px;
    min-width: 48px;
    width: auto;
    font-size: 14px;
    &:not(:first-child) {
      margin-left: 6px;
    }
  }
  h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }
`;
export const SizeBoxLayoutStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  button {
    font-size: 14px;
    &:not(:last-child) {
      margin-right: 6px;
      margin-bottom: 5px;
    }
  }
`;
export const ContentTabStyled = styled.div`
  background-color: #f6f6f6;
  color: #656565;
  margin: 14px;
  white-space: pre-line;
`;
export const ModalBackgroundStyled = styled.div`
  display: ${props => (props.showSizeModalFlag ? 'block' : 'none')}
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 10;
`;
export const HeartIconStyled = styled.img`
  width: 24px;
  height: 21px;
  cursor: pointer;
  margin-right: 8px;
`;
export const WishlistSectionStyled = styled.div`
  border-bottom: 1px solid #e3e1e1;
  display: flex;
  padding: 10px 14px 8px 14px;
  span {
    font-size: 10px;
    font-weight: bold;
    color: #787878;
    line-height: normal;
    align-self: center;
  }
`;
