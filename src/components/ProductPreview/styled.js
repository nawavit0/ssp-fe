import styled from 'styled-components';

export const PreviewImageStyled = styled.div`
  max-width: 248px;
  width: 100%;
  padding-top: 100%;
  position: relative;
  background-color: #f2f2f2;
  img {
    position: absolute;
    margin: auto;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;
export const ContentHoverAbleStyled = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  z-index: 0;
  margin: 8px 0;
  transition: transform 0.5s, box-shadow 0.2s;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  /* &:hover {
    & + .additionContent {
      display: none;
    }

    .buttonGroup {
      display: flex;
      visibility: visible;
      @include tablet-vertical {
        display: none;
      }
      &.hideProductPreviewButtons {
        display: none;
      }
    }

    .promoBadge {
      font-weight: bold;
    }
  } */
`;
export const ImageWrapperStyled = styled.div`
  display: block;
  justify-content: center;
  position: relative;
`;
export const ProductDetailsStyled = styled.div`
  position: relative;
  padding: 6px;
`;
export const BrandStyled = styled.div`
  line-height: 150%;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  height: 6px;
`;
export const FranchiseStyled = styled.div`
  line-height: 1.43;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  height: 19px;
  ${props => (props.isHide ? `display: none;` : '')}
`;
export const NameFranchiseStyled = styled.div`
  display: block;
  white-space: normal;
  position: relative;
  ${props => props.hasFranchise && 'height: 19px;'}
`;
export const PriceSectionStyled = styled.div`
  ${props => (props.isHideProductPreviewButtons ? 'margin-top: 20px;' : '')}
`;
export const ProductOverlayStyled = styled.div`
  position: absolute;
  bottom: 0px;
`;
