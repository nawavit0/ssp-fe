import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import SizeTypeBox from '../SizeTypeBox';
import SizeBox from '../SizeBox';
import {
  SizeStyled,
  SizeGuideLabelStyled,
  SizeTypeStyled,
  SizeBoxLayoutStyled,
} from './styled';

const SizeGuideMobile = ({
  translate,
  setShowSizeModalFlag,
  selectedSize,
  setSelectedSize,
  selectedSizeType,
  setSelectedSizeType,
  sizeListSalable,
  selectedSizeList,
}) => {
  return (
    <>
      <SizeStyled>
        <SizeGuideLabelStyled onClick={() => setShowSizeModalFlag(true)}>
          <p>{translate('product_detail.size_guide')}</p>
          <img src="/static/icons/SizeGuide.svg" />
        </SizeGuideLabelStyled>
        {selectedSizeList && (
          <>
            <h3>{translate('product_detail.select_size')}</h3>
            <SizeTypeStyled>
              {Object.keys(sizeListSalable).map(value => {
                return (
                  <SizeTypeBox
                    sizeType={value}
                    selectedSizeType={selectedSizeType}
                    setSelectedSizeType={setSelectedSizeType}
                    isSelected={selectedSizeType === value}
                    key={value}
                  />
                );
              })}
            </SizeTypeStyled>
            <SizeBoxLayoutStyled>
              {selectedSizeList.map(size => {
                return (
                  <SizeBox
                    setSelectedSize={setSelectedSize}
                    size={size}
                    selectedSize={selectedSize}
                    key={size.size}
                  />
                );
              })}
            </SizeBoxLayoutStyled>
          </>
        )}
      </SizeStyled>
    </>
  );
};

export default withLocales(SizeGuideMobile);
