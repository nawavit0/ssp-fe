import React from 'react';
import styled from 'styled-components';
import { useStore } from '../../../../../reactReducers/store';
import AddToCartBoxDesktop from '../../../../../routes/urlRewrite/product/components/desktop/AddToCartBoxDesktop';
import ImageV2 from '../../../../../components/Image/Image';

const PopupStyled = styled.div`
  position: absolute;
  display: ${props => (props.isDisplay ? 'flex' : 'none')};
  justify-content: flex-end;
  background-color: #ffffff;
  right: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1);
`;
const ContentInfoStyled = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  padding: 23px 35px 23px 23px;
`;
const PriceStyled = styled.div`
  p {
    text-align: right;
    font-weight: bold;
    white-space: nowrap;
  }
`;
const InitialSalePriceStyled = styled.p`
  font-size: 30px;
  color: #dd0000;
  margin-top: 0;
  margin-bottom: 5px;
`;
const InitialOldPriceStyled = styled.p`
  color: #b2b2b2;
  height: 22px;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 5px;
  text-decoration: line-through;
`;
const CustomImage = styled(ImageV2)`
  width: auto;
  height: 75px;
  margin-right: 40px;
`;

function PopupAddToCart() {
  const [{ popupInfo, productDetail }] = useStore();
  const { addToCartActiveFlag, popupProductImage, translate } = popupInfo;
  const {
    productInitSalePrice,
    productInitOldPrice,
    addToCartStatus,
    handleAddToCart,
  } = productDetail;

  if (!popupProductImage) return null;
  return (
    <PopupStyled isDisplay={popupInfo.isShow} className="popupAddtoCart">
      <ContentInfoStyled>
        <CustomImage src={popupProductImage} />
        <PriceStyled>
          <InitialSalePriceStyled>
            {productInitSalePrice}
          </InitialSalePriceStyled>
          <InitialOldPriceStyled>{productInitOldPrice}</InitialOldPriceStyled>
        </PriceStyled>
        <AddToCartBoxDesktop
          handleAddToCart={handleAddToCart}
          addToCartActiveFlag={addToCartActiveFlag}
          addToCartStatus={addToCartStatus}
          translate={translate}
          customStyle={`
            margin-left: 40px;
            font-size: 14px;
            padding: 18px 34px 18px 34px;
          `}
        />
      </ContentInfoStyled>
    </PopupStyled>
  );
}

PopupAddToCart.defaultProps = {
  sku: '',
  isConfigurable: false,
  productInitSalePrice: 0,
  productInitOldPrice: 0,
  popupProductImage: '',
  translate: () => null,
};
export default PopupAddToCart;
