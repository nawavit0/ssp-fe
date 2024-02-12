import React from 'react';
import styled from 'styled-components';
import { Skeleton, Row, Col } from '@central-tech/core-ui';

const ProductListSkeletonStyled = styled(Row)`
  margin-bottom: 65px;
`;

const ProductListPageSkeleton = () => {
  return (
    <>
      <Skeleton
        time={1}
        width="100%"
        borderRadius={0}
        height="50px"
        margin="16px 0 16px 0"
        style={{
          float: 'none',
        }}
      />
      <ProductListSkeletonStyled>
        <Col xs={12} md={3} lg="240px">
          <Skeleton
            time={3}
            width="100%"
            borderRadius={0}
            height="600px"
            margin="0"
            style={{
              float: 'none',
            }}
          />
        </Col>
        <Col xs="0px" md="0" lg="26px" />
        <Col xs={12} md={9} lg="auto">
          <Skeleton
            time={3}
            width="100%"
            borderRadius={0}
            height="600px"
            margin="0"
            style={{
              float: 'none',
            }}
          />
        </Col>
      </ProductListSkeletonStyled>
    </>
  );
};
export default ProductListPageSkeleton;
