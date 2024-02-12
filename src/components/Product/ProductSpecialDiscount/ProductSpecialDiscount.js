import React, { memo } from 'react';
import styled from 'styled-components';
import withDeviceDetect from '../../DeviceDetect/withDeviceDetect';

const DiscountDesktopStyled = styled.div`
  position: absolute;
  right: 0;
  top: 4px;
  display: inline-block;
  width: 53px;
  text-align: center;
  height: 37px;
  background-color: #9c0a1f;
  -webkit-border-radius: 3px 5px 5px 3px;
  -moz-border-radius: 3px 5px 5px 3px;
  border-radius: 3px 5px 5px 3px;
  border-left: 1px solid #9c0a1f;
  margin-left: 19px;
  color: white;
  font-weight: 400;
  font-size: 18px;
  line-height: 37px;
  z-index: 1;
  ${props => props.customStyle || ''}
`;
const OuterTriangleDesktopStyled = styled.div`
  position: absolute;
  top: 4px;
  right: 50px;
  width: 26px;
  height: 38px;
  overflow: hidden;
  z-index: 1;
  ${props => props.customStyle || ''}
`;
const TriangleDesktopStyled = styled.div`
  background-color: #9c0a1f;
  transform: rotate(45deg);
  width: 28px;
  height: 29px;
  top: 4px;
  left: 11px;
  position: relative;
  border-radius: 5px;
  :after {
    content: '';
    background-color: white;
    border-radius: 50%;
    width: 4px;
    height: 4px;
    display: block;
    position: absolute;
    left: 6px;
    top: 20px;
  }
  ${props => props.customStyle || ''}
`;

const DiscountMobileStyled = styled.div`
  position: absolute;
  right: 0;
  top: 4px;
  display: inline-block;
  width: 44px;
  text-align: center;
  height: 29px;
  background-color: #9c0a1f;
  -webkit-border-radius: 3px 5px 5px 3px;
  -moz-border-radius: 3px 5px 5px 3px;
  border-radius: 3px 5px 5px 3px;
  border-left: 1px solid #9c0a1f;
  margin-left: 19px;
  color: white;
  font-weight: 400;
  font-size: 14px;
  line-height: 29px;
  vertical-align: middle;
  z-index: 1;
`;
const OuterTriangleMobileStyled = styled.div`
  position: absolute;
  top: 4px;
  right: 40px;
  width: 29px;
  height: 29px;
  overflow: hidden;
  z-index: 1;
`;
const TriangleMobileStyled = styled.div`
  background-color: #9c0a1f;
  transform: rotate(45deg);
  width: 29px;
  height: 29px;
  top: 0px;
  left: 14px;
  position: relative;
  border-radius: 5px;
  :after {
    content: '';
    background-color: white;
    border-radius: 50%;
    width: 4px;
    height: 4px;
    display: block;
    position: absolute;
    left: 4px;
    top: 20px;
  }
`;

const renderDiscountDesktop = (percentDiscount, id, type) => {
  if (type === 'PDP') {
    return percentDiscount && percentDiscount > 0 ? (
      <>
        <OuterTriangleDesktopStyled
          customStyle={`
            top: 4px;
            right: 62px;
            width: 36px;
            height: 48px;
          `}
        >
          <TriangleDesktopStyled
            customStyle={`
              border-radius: 6px;
              width: 38px;
              height: 39px;
              top: 4px;
              left: 8px;
              :after {
                width: 8px;
                height: 8px;
                display: block;
                position: absolute;
                left: 6px;
                top: 25px;
              }
            `}
          />
        </OuterTriangleDesktopStyled>
        <DiscountDesktopStyled
          id={id}
          customStyle={`
            width: 72px;
            height: 48px;font-size: 26px;
            line-height: 48px;
          `}
        >
          {percentDiscount}%
        </DiscountDesktopStyled>
      </>
    ) : null;
  }
  return percentDiscount && percentDiscount > 0 ? (
    <>
      <OuterTriangleDesktopStyled>
        <TriangleDesktopStyled />
      </OuterTriangleDesktopStyled>
      <DiscountDesktopStyled id={id}>{percentDiscount}%</DiscountDesktopStyled>
    </>
  ) : null;
};

const renderDiscountMobile = (percentDiscount, id) => {
  return percentDiscount && percentDiscount > 0 ? (
    <>
      <OuterTriangleMobileStyled>
        <TriangleMobileStyled />
      </OuterTriangleMobileStyled>
      <DiscountMobileStyled id={id}>{percentDiscount}%</DiscountMobileStyled>
    </>
  ) : null;
};

const ProductSpecialDiscount = ({
  isMobile,
  percentDiscount,
  id = '',
  type = '',
}) => {
  return !isMobile
    ? renderDiscountDesktop(percentDiscount, id, type)
    : renderDiscountMobile(percentDiscount, id, type);
};

export default withDeviceDetect(memo(ProductSpecialDiscount));
