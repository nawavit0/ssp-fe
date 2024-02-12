import React, { useState } from 'react';
import styled from 'styled-components';
import FlickitySlide from '../../../../../components/Flickity';
import { Skeleton } from '@central-tech/core-ui';
import ImageLazy from '../../../../../components/Image/ImageLazy';
import PopupMediaDesktop from '../../../../../components/PopupMedia/PopupMediaDesktop';
import ProductSpecialDiscount from '../../../../../components/Product/ProductSpecialDiscount';
import ProductPromotionBadge from '../../../../../components/Product/ProductPromotionBadge/ProductPromotionBadge';
import { get } from 'lodash';

const MinHeight = 648;
const ProductPageLayoutLeftColumnStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
const ProductImageThumbnailStyled = styled.div`
  height: 130px;
  overflow: hidden;
  position: relative;
  .image-thumbnail-arrow {
    z-index: 2;
  }
  .image-cell {
    border: 1px solid transparent;
    &.is-nav-selected {
      border: 1px solid #78e723;
    }
  }
`;
const ImageThumbnailCell = styled.div`
  width: 130px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  cursor: pointer;
  img {
    height: 100%;
  }
`;
const ImageCell = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ProductImageCurrentStyled = styled.div`
  min-height: ${MinHeight}px;
  padding-bottom: 40px;
  position: relative;
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
    cursor: url('/static/icons/ClickZoomIn.png'), auto !important;
    .image-overlay {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
    }
    .label-zoom {
      display: block;
    }
  }
  .flickity-enabled.is-fullscreen {
    .image-cell {
      height: 100% !important;
    }
    .flickity-viewport {
      cursor: url('/static/icons/ClickZoomOut.png'), auto !important;
      .slide-image {
        width: auto;
        height: 100%;
      }
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
const LabelZoomStyled = styled.div`
  position: absolute;
  color: #646464;
  bottom: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  padding: 0 20px 10px 0;
  font-weight: bold;
  .icon-zoom {
    width: 25px;
  }
`;
const AbsolutePosStyled = styled.div`
  position: absolute;
  ${props => props.top && 'top:0;'}
  ${props => props.left && 'left:0;'}
  ${props => props.right && 'right:0;'}
  ${props => props.bottom && 'bottom:0;'}
  z-index: 1;
`;

const SlideImageDesktop = ({
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
        height={`${MinHeight}px`}
        margin="0"
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
    const previousButton = document.querySelector('.image-thumbnail-previous');
    const nextButton = document.querySelector('.image-thumbnail-next');
    previousButton.addEventListener('click', () => {
      flkty.previous();
    });
    nextButton.addEventListener('click', () => {
      flkty.next();
    });

    flkty.on('select', function(index) {
      nextButton.removeAttribute('disabled');
      previousButton.removeAttribute('disabled');
      if (index === 0) {
        previousButton.setAttribute('disabled', 'disabled');
      } else if (flkty.cells.length === index + 1) {
        nextButton.setAttribute('disabled', 'disabled');
      }
    });

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
    <ProductPageLayoutLeftColumnStyled>
      <PopupMediaDesktop
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
              <ImageCell key={`image-cell${index}`} className={'image-cell'}>
                {percentDiscount && hasOverlay && (
                  <AbsolutePosStyled className={'disable-zoom'} top right>
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
                  <ImageLazy
                    className={'slide-image'}
                    src={obj.imageUrl}
                    alt={obj.label}
                  />
                ) : (
                  <ImageLazy
                    className={'slide-image'}
                    srcLazyLoad={obj.imageUrl}
                    alt={obj.label}
                  />
                )}
                {productOverlays && hasOverlay && (
                  <ImageLazy
                    className={'image-overlay disable-zoom'}
                    srcLazyLoad={productOverlays.image}
                  />
                )}
                <LabelZoomStyled className={'label-zoom disable-zoom'}>
                  <ImageLazy
                    src={'/static/icons/ClickZoomIn.svg'}
                    className={'icon-zoom'}
                  />
                  {translate('product_detail.click_to_zoom')}
                </LabelZoomStyled>
              </ImageCell>
            );
          })}
        </FlickitySlide>
      </ProductImageCurrentStyled>
      <ProductImageThumbnailStyled>
        <button
          className="flickity-button flickity-prev-next-button previous image-thumbnail-arrow image-thumbnail-previous"
          disabled={'disabled'}
        >
          <svg className="flickity-button-icon" viewBox="0 0 100 100">
            <path
              d="M 530.566406 1075.927734 L 82.275391 627.636719 L 533.203125 176.708984 M 95.898438 625 L 1215.527344 625 "
              className="arrow"
            ></path>
          </svg>
        </button>
        <FlickitySlide
          className={'carousel-nav'}
          options={{
            adaptiveHeight: false,
            asNavFor: '.carousel-main-PDP',
            cellAlign: 'left',
            pageDots: false,
            contain: true,
            prevNextButtons: false,
          }}
          reloadOnUpdate
          static
        >
          {productImages.map((obj, index) => {
            return (
              <ImageThumbnailCell
                key={`image-cell${index}`}
                className={'image-cell'}
              >
                <ImageLazy src={obj.imageUrl} alt={obj.label} />
              </ImageThumbnailCell>
            );
          })}
        </FlickitySlide>
        <button
          disabled={productImages.length > 1 ? false : 'disabled'}
          className="flickity-button flickity-prev-next-button next image-thumbnail-arrow image-thumbnail-next"
        >
          <svg className="flickity-button-icon" viewBox="0 0 100 100">
            <path
              d="M 530.566406 1075.927734 L 82.275391 627.636719 L 533.203125 176.708984 M 95.898438 625 L 1215.527344 625 "
              className="arrow"
            ></path>
          </svg>
        </button>
      </ProductImageThumbnailStyled>
    </ProductPageLayoutLeftColumnStyled>
  );
};

export default SlideImageDesktop;
