import React from 'react';
import AlphabeticBrandsIndexDesktop from './AlphabeticBrandsIndexDesktop';
import AlphabeticBrandsIndexMobile from './AlphabeticBrandsIndexMobile';
import { BrandWidget } from '@central-tech/core-ui';
import { transformBrandGroupByAlphabetic } from '../../utils/brand';
import { DesktopView, MobileView } from '../../components/DeviceDetect';
import DesktopLayout from '../../components/Layout/DesktopLayout';
import MobileLayout from '../../components/Layout/MobileLayout';

const title = 'Alphabetic Brands Index';

const Brands = () => {
  return (
    <BrandWidget field={'product_count'} value={'0'} page={1} size={0}>
      {({ data }) => {
        const brandGroupByAlphabetic = transformBrandGroupByAlphabetic(
          data?.brands || [],
        );
        return (
          <>
            <DesktopView>
              <DesktopLayout>
                <AlphabeticBrandsIndexDesktop
                  brandList={brandGroupByAlphabetic}
                  title={title}
                />
              </DesktopLayout>
            </DesktopView>
            <MobileView>
              <MobileLayout>
                <AlphabeticBrandsIndexMobile
                  rawBrandList={brandGroupByAlphabetic}
                  title={title}
                />
              </MobileLayout>
            </MobileView>
          </>
        );
      }}
    </BrandWidget>
  );
};

function action() {
  return {
    chunks: ['alphabetic-brands-index'],
    title,
    component: <Brands />,
  };
}

export default action;
