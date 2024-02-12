import React, { memo } from 'react';
import styled from 'styled-components';
import pt from 'prop-types';
import withDeviceDetect from '../../DeviceDetect/withDeviceDetect';

const WrapperDesktopStyled = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 1;
`;
const WrapperMobileStyled = styled.div`
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: 1;
`;
const BadgeDesktopStyled = styled.div`
  display: inline-block;
  color: #ffffff;
  border-radius: 12px 8px 0 12px;
  border-bottom-right-radius: 0;
  background: #ffffff;
  text-align: center;
  line-height: 31px;
  font-size: 18px;
  font-weight: 300;
  width: 72px;
  height: 31px;
  background: #13283f;
  text-transform: uppercase;
  ${props =>
    props.type && props.type === 'PDP'
      ? `
        width: 100px;
        height: 48px;
        font-size: 26px;
        line-height: 48px;
      `
      : ''}
`;
const BadgeMobileStyled = styled.div`
  display: inline-block;
  color: #ffffff;
  border-radius: 12px 8px 0 12px;
  border-bottom-right-radius: 0;
  background: #ffffff;
  text-align: center;
  vertical-align: middle;
  line-height: 29px;
  font-size: 14px;
  font-weight: 300;
  width: 56px;
  height: 29px;
  background: #13283f;
  text-transform: uppercase;
`;
const renderBadgeDesktop = (isNew, id, type) => {
  return (
    <WrapperDesktopStyled>
      {(isNew && (
        <BadgeDesktopStyled type={type} id={id}>
          {type === 'PDP' ? 'NEW' : 'New'}
        </BadgeDesktopStyled>
      )) ||
        null}
    </WrapperDesktopStyled>
  );
};
const renderBadgeMobile = (isNew, id) => {
  return (
    <WrapperMobileStyled>
      {(isNew && <BadgeMobileStyled id={id}>New</BadgeMobileStyled>) || null}
    </WrapperMobileStyled>
  );
};
const ProductPromotionBadge = ({ isNew, id, isMobile, type }) => {
  return !isMobile
    ? renderBadgeDesktop(isNew, id, type)
    : renderBadgeMobile(isNew, id, type);
};

ProductPromotionBadge.propTypes = {
  product: pt.object,
  id: pt.string,
  type: pt.string,
};
ProductPromotionBadge.defaultProps = {
  product: {},
  id: '',
  type: '',
};
export default withDeviceDetect(memo(ProductPromotionBadge));
