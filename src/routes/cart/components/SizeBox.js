import React, { useState } from 'react';
import { withLocales } from '@central-tech/core-ui';
import styled, { keyframes } from 'styled-components';
import OutsideClickHandler from 'react-outside-click-handler';
import { groupBy } from 'lodash';
import { useProductBySkuLazyQuery } from '@central-tech/react-hooks';
import { Skeleton } from '@central-tech/core-ui';

const textPopUpBottom = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(-38px);
            transform: translateY(-38px);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    z-index: -1;
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
            transform: translateY(0);
    -webkit-transform-origin: 50% 50%;
            transform-origin: 50% 50%;
    z-index: 1;
  }
`;
const DropdownBlockStyled = styled.div`
  height: 38px;
  width: ${props => (props.width ? props.width : '120px')};
  display: inline-block;
  pointer-events: ${props =>
    props.disabled || !props.hasToggle ? 'none' : 'auto'};
  line-height: 150%;
  color: #474747;
  font-weight: bold;
  position: relative;
  transition: all 300ms ease;
  -webkit-transition: all 300ms ease;
  -moz-transition: all 300ms ease;
  border: 1px solid #e1e1e1;
  &.active {
    z-index: 2;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  }
  &.active img {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
  }
  z-index: 2;
  user-select: none;
  cursor: pointer;
`;
const ArrowDropdownStyled = styled.div`
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  -webkit-transform: translate3d(0, -50%, 0);
  -moz-transform: translate3d(0, -50%, 0);
  img {
    height: 30px;
    width: 20px;
    transition: all 300ms;
    -webkit-transition: all 300ms;
    -moz-transition: all 300ms;
  }
`;
const DropdownListStyled = styled.div`
  display: ${props => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: calc(100% - 1px);
  right: -1px;
  width: ${props =>
    props.width
      ? `calc(${props.width} - 
          ${props.hasSizeType ? '33px' : '0px'})`
      : `calc(120px - 
          ${props.hasSizeType ? '33px' : '0px'})`};
  list-style: none;
  text-align: left;
  background-color: #fff;
  border: 1px solid #e1e1e1;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  border-top: 1px solid #e1e1e1;
  -webkit-animation: ${textPopUpBottom} 0.3s
    cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  animation: ${textPopUpBottom} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  overflow: visible;
  cursor: pointer;
`;
const DropdownListItemStyled = styled.div`
  height: 100%;
  padding-top: 8px;
  padding-right: ${props => (props.hasToggle ? '24px' : '0')};
  padding-bottom: 8px;
  padding-left: 0;
  text-align: center;
  font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
  color: ${props => (props.salableFlag ? '#474747' : 'lightgrey')};
  cursor: ${props => (props.salableFlag ? 'pointer' : 'not-allowed')};
  :hover {
    background: ${props => (props.salableFlag ? '#eee' : '')};
  }
`;
const DropdownText = styled.div`
  color: #474747;
  height: 100%;
  padding-top: 8px;
  padding-right: ${props => (props.hasToggle ? '24px' : '0')};
  padding-left: ${props => (props.hasSizeType ? '33px' : '0')};
  text-align: center;
  position: relative;
  background: #fff;
  z-index: 1;
  font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
  white-space: nowrap;
`;
const SizeTypeStyled = styled.div`
  height: 100%;
  width: 33px;
  font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
  color: #474747;
  position: absolute;
  background-color: #ebebeb;
  z-index: 20;
  padding-top: 8px;
  text-align: center;
  border-right: 1px solid #e1e1e1;
`;
const DropDownListSkeletonStyled = styled.div`
  padding-top: 8px;
  padding-right: ${props => (props.hasToggle ? '24px' : '4px')};
  padding-bottom: 8px;
  padding-left: 4px;
  text-align: center;
  cursor: auto;
  color: lightgrey;
  font-size: ${props => (props.fontSize ? props.fontSize : '14px')};
  > * {
    margin: auto;
    float: none;
  }
`;
const SizeBox = ({
  changeSizeItemHandler,
  sku,
  qty,
  productId,
  parentSku,
  isConfigurable,
  selectedSize,
  disableFlag,
  fontSize,
  width,
  sizeType,
}) => {
  const currentProductSku = sku;
  const currentProductId = productId;
  const hasToggle = !!parentSku;
  const convertedFontSize = fontSize || '14px';
  let selectedSizeFontSize = convertedFontSize;
  if (selectedSize.length > 8 && selectedSize.length <= 10) {
    selectedSizeFontSize = '11px';
  } else if (selectedSize.length > 10) {
    selectedSizeFontSize = '10px';
  }
  const [isOpen, setIsOpen] = useState(false);
  const [fetch, { data, loading }] = useProductBySkuLazyQuery({
    variables: {
      sku: parentSku,
    },
  });
  const handleOpenPanel = () => {
    setIsOpen(true);
    fetch();
  };
  const handleChangeSize = async (
    qty,
    currentProductId,
    parentSku,
    optionId,
    optionValue,
  ) => {
    setIsOpen(false);
    await changeSizeItemHandler(
      qty,
      parentSku,
      optionId,
      optionValue,
      currentProductId,
    );
  };
  const options = [];
  if (!loading) {
    const parentProduct = data?.productBySku || {};
    const parentSku = parentProduct?.sku || '';
    const configurableProductOptions =
      parentProduct?.extension_attributes?.configurable_product_options?.find(
        o => o.label === 'Product Size Simple',
      ) || [];
    const configurableProductItems =
      parentProduct?.configurable_product_items || [];
    const sizeMaps = parentProduct?.extension_attributes?.size_maps || [];
    const sizeList = groupBy(sizeMaps, sizeMaps => sizeMaps.type);
    configurableProductItems.map(item => {
      const targetMinQty =
        item?.extension_attributes?.stock_item?.min_sale_qty || 0;
      const targetMaxSaleQty =
        item?.extension_attributes?.stock_item?.max_sale_qty || 0;
      const targetStockQty = item?.extension_attributes?.stock_item?.qty || 0;
      const targetMaxQty = Math.min(targetMaxSaleQty, targetStockQty);
      const childSizeValue =
        item?.custom_attributes_option?.product_size_simple || '';
      const childSizeType = item?.custom_attributes?.size_type || '';
      const targetProductId = item?.id || '';
      const targetProductSku = item?.sku || '';
      const salableFlag = item?.extension_attributes?.salable || false;
      if (childSizeType !== sizeType || childSizeValue !== selectedSize) {
        let mappedSizeValue = childSizeValue;
        if (childSizeType !== sizeType) {
          const sizeListFilterByChilrenSizeType =
            sizeList?.[childSizeType] || [];
          const childSizeInSizeListIndex = sizeListFilterByChilrenSizeType.findIndex(
            o => {
              o.size === childSizeValue;
            },
          );
          if (childSizeInSizeListIndex !== -1) {
            mappedSizeValue =
              sizeMaps?.[sizeType]?.[childSizeInSizeListIndex]?.size || '';
          }
        }
        if (mappedSizeValue) {
          const optionId = configurableProductOptions?.attribute_id || '';
          const optionValueIndex = configurableProductOptions?.values.findIndex(
            o => o.extension_attributes.label === mappedSizeValue,
          );
          const optionValue =
            configurableProductOptions?.values?.[optionValueIndex]
              ?.value_index || 0;
          options.push({
            parentSku,
            currentProductId,
            targetProductId,
            targetProductSku,
            currentProductSku,
            optionId,
            optionValue,
            targetMinQty,
            targetMaxQty,
            salableFlag,
            sizeValue: mappedSizeValue,
            sizeType: childSizeType,
          });
        }
      }
    });
  }
  const dropDownListItem = {
    loading: (
      <DropDownListSkeletonStyled
        hasSizeType={!!sizeType}
        isConfigurable={isConfigurable}
        hasToggle={hasToggle}
      >
        <Skeleton
          time={1}
          width="16px"
          borderRadius={0}
          height="16px"
          float="none"
        />
      </DropDownListSkeletonStyled>
    ),
    noProduct: null,
    hasProduct: options.map((option, index) => {
      const currentProductId = option?.currentProductId || '';
      const optionId = option?.optionId || '';
      const optionValue = option?.optionValue || 0;
      const targetMinQty = option?.targetMinQty || 0;
      const targetMaxQty = option?.targetMaxQty || 0;
      const salableFlag = option?.salableFlag || false;
      const optionLabel = option?.sizeValue || '';
      let fontSize = convertedFontSize;
      if (optionLabel.length > 8 && optionLabel.length <= 10) {
        fontSize = '11px';
      } else if (optionLabel.length > 10) {
        fontSize = '10px';
      }
      let targetQty = qty;
      if (qty >= targetMaxQty) {
        targetQty = targetMaxQty;
      }
      if (qty <= targetMinQty) {
        targetQty = targetMinQty;
      }
      return (
        <DropdownListItemStyled
          key={`dropdownListItem${index}`}
          onClick={salableFlag => {
            salableFlag &&
              handleChangeSize(
                (qty = targetQty),
                currentProductId,
                parentSku,
                optionId,
                optionValue,
              );
          }}
          hasSizeType={!!sizeType}
          hasToggle={hasToggle}
          isConfigurable={isConfigurable}
          fontSize={fontSize}
          salableFlag={salableFlag}
        >
          {optionLabel}
        </DropdownListItemStyled>
      );
    }),
  };
  const getDropDownListItem = (loading, hasOptionFlag) => {
    if (loading) {
      return dropDownListItem?.loading || null;
    }
    if (!loading && hasOptionFlag) {
      return dropDownListItem?.hasProduct || null;
    }
    return dropDownListItem?.noProduct || null;
  };
  const hasOptionFlag = !!options.length;
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setIsOpen(false);
      }}
    >
      <DropdownBlockStyled
        className={isOpen ? 'active' : ''}
        width={width}
        disabled={disableFlag}
        hasToggle={hasToggle}
      >
        {sizeType && (
          <SizeTypeStyled fontSize={convertedFontSize}>
            {sizeType}
          </SizeTypeStyled>
        )}
        <DropdownText
          disabled={disableFlag}
          fontSize={selectedSizeFontSize}
          hasSizeType={!!sizeType}
          hasToggle={hasToggle}
          isConfigurable={isConfigurable}
          onClick={() => (isOpen ? setIsOpen(false) : handleOpenPanel())}
        >
          {selectedSize}
          {hasToggle && (
            <ArrowDropdownStyled>
              <img src={`/icons/arrow-down.svg`} />
            </ArrowDropdownStyled>
          )}
        </DropdownText>
        <DropdownListStyled
          isOpen={isOpen}
          width={width}
          isConfigurable={isConfigurable}
          hasSizeType={!!sizeType}
        >
          {getDropDownListItem(loading, hasOptionFlag)}
        </DropdownListStyled>
      </DropdownBlockStyled>
    </OutsideClickHandler>
  );
};

export default withLocales(SizeBox);
