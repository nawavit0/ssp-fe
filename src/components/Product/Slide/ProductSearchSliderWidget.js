import React, { Fragment } from 'react';
import FlickitySlide from '../../Flickity';
import styled from 'styled-components';
import {
  ProductSearchWidget,
  withStoreConfig,
  withRoutes,
} from '@central-tech/core-ui';
import ProductGrid from '../../ProductGrid';
import { useDeviceContext } from '../../../context/DeviceContext';

const defaultMargin = 12;

const FlickitySectionStyled = styled.div`
  .content-hover-able {
    margin: unset;
  }
  .product-grid {
    max-width: unset;
    width: ${props =>
      props.itemWidth
        ? `calc(${props.itemWidth}% - ${defaultMargin * 2}px)`
        : '25%'};
    margin: 0 ${defaultMargin}px;
    .preview-image {
      max-width: unset;
    }
  }
  @media only screen and (max-width: 1042px) {
    .mobile .flickity-viewport {
      min-height: ${props =>
        (1042 * 340) / props.theme.container.maxWidth || 1}px;
    }
  }
  @media only screen and (max-width: 800px) {
    .mobile .flickity-viewport {
      min-height: ${props =>
        (800 * 340) / props.theme.container.maxWidth || 1}px;
    }
  }
  @media only screen and (max-width: 768px) {
    .mobile .flickity-viewport {
      min-height: ${props =>
        (768 * 340) / props.theme.container.maxWidth || 1}px;
    }
  }
  @media only screen and (max-width: 414px) {
    .mobile .flickity-viewport {
      min-height: ${props =>
        (414 * 340) / props.theme.container.maxWidth || 1}px;
    }
  }
  @media only screen and (max-width: 375px) {
    .mobile .flickity-viewport {
      min-height: ${props =>
        (375 * 340) / props.theme.container.maxWidth || 1}px;
    }
  }
  @media only screen and (max-width: 360px) {
    .mobile .flickity-viewport {
      min-height: ${props =>
        (360 * 340) / props.theme.container.maxWidth || 1}px;
    }
  }
  @media only screen and (max-width: 320px) {
    .mobile .flickity-viewport {
      min-height: ${props =>
        (320 * 340) / props.theme.container.maxWidth || 1}px;
    }
  }
`;

const ProductSearchSliderWidget = ({
  skus,
  options,
  isRecommendForYou,
  isBestSeller,
  isFlashDeals,
  flashDealsCondition = {},
  fontColor = '',
  page = 1,
  size = 100,
}) => {
  const { itemWidth, autoplaySpeed, freeScroll = false } = options;

  let { infinite, groupCells = false, dots, arrows, autoplay } = options;

  const isMobile = useDeviceContext()?.isMobile;

  let filterGroups = [
    { filters: [{ field: 'status', value: '1' }] },
    { filters: [{ field: 'visibility', value: '4' }] },
  ];
  if (skus) {
    filterGroups = [
      ...filterGroups,
      {
        filters: [
          {
            field: 'sku',
            value: skus,
            conditionType: 'in',
          },
        ],
      },
    ];
  }
  if (isRecommendForYou === true) {
    filterGroups = [
      ...filterGroups,
      {
        filters: [
          {
            field: 'recommended',
            value: '1',
            conditionType: 'eq',
          },
        ],
      },
    ];
  }
  if (isFlashDeals === true) {
    const dateStart = flashDealsCondition?.dateStart;
    const dateEnd = flashDealsCondition?.dateEnd;
    filterGroups = [
      ...filterGroups,
      {
        filters: [
          {
            field: 'flash_deal_from',
            value: dateStart,
            conditionType: 'lteq',
          },
        ],
      },
      {
        filters: [
          {
            field: 'flash_deal_to',
            value: dateEnd,
            conditionType: 'gt',
          },
        ],
      },
      {
        filters: [
          {
            field: 'flash_deal_enable',
            value: '1',
          },
        ],
      },
    ];
  }
  if (isBestSeller === true) {
    filterGroups = [
      ...filterGroups,
      {
        filters: [
          {
            field: 'homepage_best_sellers',
            value: '1',
            conditionType: 'eq',
          },
        ],
      },
    ];
  }

  return (
    <ProductSearchWidget
      filterGroups={filterGroups}
      page={page ? parseInt(page) : 1}
      sortOrders={[]}
      size={size ? parseInt(size) : 100}
      ssr={false}
    >
      {({ data, loading }) => {
        const products = data?.productSearch?.products || [];
        let renderProducts;
        let countProduct = 0;

        if (skus) {
          const skusArray = skus
            ? skus.split(',').map(sku => sku.toString().trim())
            : [];

          const productSorting = skusArray.reduce((filtered, sku) => {
            const result = products.filter(
              item => item.sku.toString().trim() === sku,
            );
            if (result.length) {
              filtered.push(result[0]);
            }
            return filtered;
          }, []);

          countProduct = productSorting?.length;

          renderProducts = (
            <Fragment>
              {productSorting.map((product, index) => {
                return (
                  <ProductGrid
                    fontColor={fontColor}
                    key={`${product.id}${index}`}
                    product={product}
                    index={index}
                  />
                );
              })}
            </Fragment>
          );
        } else {
          countProduct = products?.length;
          renderProducts = (
            <Fragment>
              {products.map((product, index) => {
                return (
                  <ProductGrid
                    fontColor={fontColor}
                    key={`${product.id}${index}`}
                    product={product}
                    index={index}
                  />
                );
              })}
            </Fragment>
          );
        }

        if (!loading) {
          if (parseInt(countProduct) === parseInt(options.items)) {
            infinite = false;
            groupCells = false;
            dots = false;
            arrows = false;
            autoplay = false;
          }

          return (
            <FlickitySectionStyled itemWidth={itemWidth}>
              <FlickitySlide
                className={`carousel${isMobile ? ' mobile' : ''}`}
                options={{
                  autoPlay: autoplay ? autoplaySpeed : false,
                  lazyLoad: true,
                  adaptiveHeight: false,
                  prevNextButtons: arrows,
                  contain: true,
                  pageDots: dots,
                  wrapAround: infinite,
                  freeScroll: freeScroll,
                  groupCells: groupCells,
                }}
                reloadOnUpdate
                static
              >
                {renderProducts}
              </FlickitySlide>
            </FlickitySectionStyled>
          );
        }
        return <div>Loading...</div>;
      }}
    </ProductSearchWidget>
  );
};

export default withStoreConfig(withRoutes(ProductSearchSliderWidget));
