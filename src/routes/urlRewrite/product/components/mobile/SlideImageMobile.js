import React, { useState } from 'react';
import styled from 'styled-components';
import FlickitySlide from '../../../../../components/Flickity';
import ImageV2 from '../../../../../components/Image/ImageV2';
import PopupMediaMobile from '../../../../../components/PopupMedia/PopupMediaMobile';
import { Skeleton } from '@central-tech/core-ui';
import { get } from 'lodash';
import ProductSpecialDiscount from '../../../../../components/Product/ProductSpecialDiscount';
import ProductPromotionBadge from '../../../../../components/Product/ProductPromotionBadge/ProductPromotionBadge';

const ProductImageCurrentStyled = styled.div`
  padding-bottom: 40px;
  img {
    width: 100%;
  }
  .image-overlay {
    display: none;
  }
  .label-zoom {
    display: none;
  }
  .flickity-viewport {
    .image-overlay {
      display: block;
      width: 100%;
      height: auto;
      position: absolute;
      z-index: 1;
    }
    .label-zoom {
      display: block;
    }
  }
  .flickity-enabled.is-fullscreen {
    .image-cell {
      width: 100% !important;
      height: 100%;
      transform: scale !important;
    }
    .flickity-viewport {
      transform: scale !important;
      touch-action: pan-y pinch-zoom !important;
      .disable-zoom {
        display: none;
      }
    }
  }
  .flickity-prev-next-button,
  .flickity-fullscreen-button {
    display: none;
  }
  .is-fullscreen {
    .flickity-prev-next-button,
    .flickity-fullscreen-button {
      display: block;
    }
  }
`;
const ImageCell = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AbsolutePosStyled = styled.div`
  position: absolute;
  ${props => props.top && 'top:0;'}
  ${props => props.left && 'left:0;'}
  ${props => props.right && 'right:0;'}
  ${props => props.bottom && 'bottom:0;'}
  z-index: 1;
  &.percent-discount {
    right: 2px;
  }
`;
const LabelZoomStyled = styled.div`
  position: absolute;
  color: #646464;
  bottom: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  padding: 0 20px 10px 0;
  font-size: 8px;
  .icon-zoom {
    width: 9px;
  }
`;

const SlideImageMobile = ({
  loading,
  productImages,
  productOverlays,
  isNewBadge,
  percentDiscount,
  translate,
}) => {
  const [srcMediaFullscreen, setSrcMediaDullscreen] = useState('');
  const [openMediaFullScreen, setOpenMediaFullscreen] = useState(false);

  if (loading) {
    return (
      <Skeleton
        time={1}
        width="100%"
        borderRadius={0}
        height={'auto'}
        margin="0"
        style={{
          float: 'none',
        }}
      />
    );
  }

  const showPopupFullscreen = src => {
    setSrcMediaDullscreen(src);
    setOpenMediaFullscreen(true);
  };
  const closePopupFullscreen = () => {
    setOpenMediaFullscreen(false);
  };

  const getMediaOfSelectedSlide = index => {
    return productImages[index];
  };

  const NavigationImage = flkty => {
    flkty.on('staticClick', (event, pointer, cellElement, cellIndex) => {
      const isFullscreen = Array.from(
        cellElement?.parentElement?.parentElement?.parentElement?.classList ||
          [],
      ).includes('is-fullscreen');

      const media = getMediaOfSelectedSlide(cellIndex);

      if (!media?.type.includes('video')) {
        flkty.toggleFullscreen();
        return;
      }

      if (isFullscreen) {
        flkty.exitFullscreen();
        showPopupFullscreen(media.videoUrl);
        return;
      }

      showPopupFullscreen(media.videoUrl);
    });

    setTimeout(() => {
      const mainSlide = document.querySelector(
        '.carousel-main-PDP .flickity-viewport',
      );
      if (get(mainSlide, 'clientHeight') < 1) {
        flkty.reloadCells();
      }
    }, 1000);
  };

  return (
    <>
      <PopupMediaMobile
        isOpen={openMediaFullScreen}
        src={srcMediaFullscreen}
        onClose={closePopupFullscreen}
      />
      <ProductImageCurrentStyled>
        <FlickitySlide
          className={'carousel-main-PDP'}
          options={{
            lazyLoad: true,
            adaptiveHeight: true,
            fullscreen: true,
            prevNextButtons: true,
          }}
          callback={NavigationImage}
          reloadOnUpdate
          static
        >
          {productImages.map((obj, index) => {
            index++;
            const hasOverlay = !obj.type?.includes('video');
            return (
              <ImageCell key={`productImage${index}`} className={'image-cell'}>
                {percentDiscount && hasOverlay && (
                  <AbsolutePosStyled
                    className={'disable-zoom percent-discount'}
                    top
                  >
                    <ProductSpecialDiscount
                      percentDiscount={percentDiscount}
                      type="PDP"
                    />
                  </AbsolutePosStyled>
                )}
                {isNewBadge && hasOverlay && (
                  <AbsolutePosStyled className={'disable-zoom'} top left>
                    <ProductPromotionBadge isNew={isNewBadge} type={'PDP'} />
                  </AbsolutePosStyled>
                )}
                {index === 1 ? (
                  <ImageV2 src={obj.imageUrl} alt={obj.label} />
                ) : (
                  <ImageV2 srcLazyLoad={obj.imageUrl} alt={obj.label} />
                )}
                {productOverlays && hasOverlay && (
                  <ImageV2
                    className={'image-overlay disable-zoom'}
                    srcLazyLoad={productOverlays.image}
                  />
                )}
                <LabelZoomStyled className={'label-zoom disable-zoom'}>
                  <ImageV2
                    src={'/static/icons/ClickZoomIn.svg'}
                    className={'icon-zoom'}
                  />
                  {translate('product_detail.tap_to_zoom')}
                </LabelZoomStyled>
              </ImageCell>
            );
          })}
        </FlickitySlide>
      </ProductImageCurrentStyled>
    </>
  );
};

export default SlideImageMobile;
