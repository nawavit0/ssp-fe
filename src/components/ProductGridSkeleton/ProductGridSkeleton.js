import React, { memo } from 'react';
import styled from 'styled-components';
import { Skeleton } from '@central-tech/core-ui';

const Wrapper = styled.div`
  opacity: 1;
  transition: 450ms ease;
  margin: 0 12px;
  ${props =>
    !props.isHide &&
    `
    display: none !important;
    opacity: 0;
  `}
`;
const ProductGridImg = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  margin: 8px 0;
  &:before {
    content: '';
    float: left;
    padding-top: 100%;
  }
  > div {
    position: absolute;
  }
`;
const ProductGridContent = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  > div {
    display: inline-flex;
    float: none;
  }
`;
const ProductGridSkeleton = props => {
  const { loading, width } = props;
  return (
    <Wrapper isHide={loading}>
      <ProductGridImg>
        <Skeleton time={1} width={width} borderRadius={0} height="100%" />
      </ProductGridImg>
      <ProductGridContent>
        <Skeleton
          time={1}
          width="100%"
          borderRadius={0}
          height="15px"
          margin="0px 0px 2px 0px"
        />
        <Skeleton
          time={1}
          width="100%"
          borderRadius={0}
          height="15px"
          margin="2px 0px 2px 0px"
        />
        <Skeleton
          time={1}
          width="60px"
          borderRadius={0}
          height="18px"
          margin="6px 0px 8px 0px"
        />
      </ProductGridContent>
    </Wrapper>
  );
};

ProductGridSkeleton.defaultProps = {
  loading: true,
};

export default memo(ProductGridSkeleton);
