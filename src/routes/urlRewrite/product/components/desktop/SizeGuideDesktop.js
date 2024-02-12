import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import SizeBox from '../SizeBox';
import { SizeStyled, SizeBoxLayoutStyled } from './styled';

const SizeGuideDesktop = ({
  translate,
  selectedSize,
  setSelectedSize,
  selectedSizeList,
}) => {
  return (
    <>
      {selectedSizeList && (
        <SizeStyled>
          <h3>{translate('product_detail.select_size')}</h3>
          <SizeBoxLayoutStyled>
            {selectedSizeList.map(size => (
              <SizeBox
                setSelectedSize={setSelectedSize}
                size={size}
                selectedSize={selectedSize}
                key={size.size}
              />
            ))}
          </SizeBoxLayoutStyled>
        </SizeStyled>
      )}
    </>
  );
};

export default withLocales(SizeGuideDesktop);
