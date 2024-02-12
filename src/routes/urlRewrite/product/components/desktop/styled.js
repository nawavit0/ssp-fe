import styled from 'styled-components';

export const FlexLeftRightStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const ProductPageLayoutStyled = styled.div`
  padding: 0px 20px 40px 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 50px;
`;
export const ProductPageLayoutRightColumnStyled = styled.div`
  color: #505050;
  height: 100%;
  position: relative;
  hr {
    border: 1px solid #e1e1e1;
  }
`;
export const SizeStyled = styled.div`
  h3 {
    color: #0d0d0d;
    margin-bottom: 10px;
    font-weight: bold;
  }
  margin-bottom: 12px;
`;
export const SizeBoxLayoutStyled = styled.div`
  display: flex;
  font-size: 15px;
  * {
    font-size: 15px;
    &:not(:first-child) {
      margin-left: 10px;
    }
  }
`;
export const QuantitySizeTypeStyled = styled(FlexLeftRightStyled)`
  margin-bottom: 20px;
  position: relative;
`;
export const QuantityStyled = styled.div`
  height: 38px;
  display: flex;
  h3 {
    display: flex;
    align-items: center;
    color: #0d0d0d;
    margin-right: 20px;
    font-weight: bold;
  }
`;
export const SizeTypeStyled = styled.div`
  display: flex;
  h3 {
    margin-bottom: 10px;
    font-weight: bold;
  }
  button {
    margin-top: auto;
    margin-bottom: auto;
  }
`;
export const SizeGuideLabelStyled = styled.div`
  margin-left: 5px;
  position: relative;
  cursor: pointer;
  p {
    font-size: 12px;
    margin: 0;
    display: inline-block;
    vertical-align: top;
  }
  img {
    width: 60px;
    position: absolute;
    top: -6px;
    right: 0px;
  }
`;
export const FreeGiftStyled = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;
export const ActionStyled = styled.div`
  display: grid;
  grid-template-columns: 69px 1fr;
  grid-gap: 20px;
  height: 69px;
`;
export const ProductDetailStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
`;
export const BrandProductNameStyled = styled.div`
  h2 {
    color: black;
    margin-bottom: 5px;
    font-size: 30px;
    font-weight: bold;
  }
  h1 {
    color: #717171;
    font-size: 16px;
    font-weight: bold;
  }
`;
export const PriceStyled = styled.div`
  p {
    text-align: right;
    font-weight: bold;
  }
`;
export const InitialSalePriceStyled = styled.p`
  font-size: 30px;
  color: #dd0000;
  margin-top: 0;
  margin-bottom: 5px;
`;
export const InitialOldPriceStyled = styled.p`
  color: #b2b2b2;
  height: 22px;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 5px;
  text-decoration: line-through;
`;
export const SoldByStyled = styled.p`
  color: #a6a6a6;
  font-size: 12px;
  margin-top: 0;
  margin-bottom: 12px;
  text-align: right;
`;
export const PromotionItemStyled = styled.div`
  img {
    height: 100px;
    margin-right: 20px;
  }
  p {
    font-size: 16px;
    display: inline-block;
    vertical-align: top;
    margin-top: 0;
  }
`;
export const PromotionFreeStyled = styled.p`
  text-transform: uppercase;
  color: #dd1b1b;
  font-size: 24px;
  margin: 0;
`;
export const The1ShareStyled = styled(FlexLeftRightStyled)`
  font-size: 14px;
  margin-bottom: 5px;
`;
export const The1Styled = styled.div`
  margin: auto 0;
  * {
    display: inline-block;
  }
  span {
    font-weight: bold;
    color: #0d0d0d;
  }
  img {
    width: 26px;
    margin: 0 10px 0 0;
    background-color: black;
  }
  p {
    margin: auto;
  }
`;
export const SocialStyled = styled.div`
  display: flex;
  margin: 10px 0 14px 0;
  p {
    margin: auto 8px auto 0;
    display: flex;
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
  margin-bottom: 20px;
`;
export const TabStyled = styled.div`
  background-color: #f6f6f6;
  position: relative;
  padding: 19px 50px 19px 50px;
  margin-bottom: 10px;
`;
export const TabSectionStyled = styled.div`
  width: 50%;
  display: flex;
  > div {
    display: block;
  }
`;
export const CustomTabStyled = styled.div`
  border-bottom: ${props =>
    props.active ? '2px solid #363636' : '2px solid #cccccc'};
  padding: 19px 0;
  text-align: center;
  min-width: 165px;
  color: #000000;
  font-weight: bold;
  font-size: 16px;
`;
export const ContentStyled = styled.div`
  background-color: #f6f6f6;
  color: #656565;
  padding-top: 20px;
`;
export const SizeTypeLayoutStyled = styled.div`
  margin-right: 10px;
`;
