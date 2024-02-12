import React from 'react';
import ReactDOM from 'react-dom';
import { CoreUiProvider, cmsProductWidget } from '@central-tech/core-ui';
import App from '../../App';
import theme from '../../../config/theme';
import { ProductSearchSliderWidget } from '../../Product/Slide';
import LazyLoad from 'react-lazyload';

const renderProductWidget = (target, context, productSetting) => {
  const {
    skus,
    page,
    size,
    isRecommendForYou,
    isFlashDeals,
    isBestSeller,
    flashDealsCondition,
    fontColor,
    arrows,
    infinite,
    dots,
    items,
    itemWidth,
    autoplay,
    autoplaySpeed,
    freeScroll,
    groupCells,
  } = productSetting;
  const comp = (
    <CoreUiProvider client={context.client} theme={theme}>
      <App context={context}>
        <LazyLoad height={330} once>
          <ProductSearchSliderWidget
            skus={skus}
            page={page}
            size={size}
            isRecommendForYou={isRecommendForYou}
            isFlashDeals={isFlashDeals}
            isBestSeller={isBestSeller}
            flashDealsCondition={flashDealsCondition}
            fontColor={fontColor}
            options={{
              arrows,
              dots,
              items,
              itemWidth,
              infinite,
              autoplay,
              autoplaySpeed,
              freeScroll,
              groupCells,
            }}
          />
        </LazyLoad>
      </App>
    </CoreUiProvider>
  );
  ReactDOM.render(comp, target);
};

const initProductSlideWidget = context => {
  cmsProductWidget(context, renderProductWidget);
};

export default initProductSlideWidget;
