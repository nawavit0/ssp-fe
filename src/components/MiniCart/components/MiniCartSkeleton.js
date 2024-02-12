import React from 'react';
import styled from 'styled-components';

import { Skeleton } from '@central-tech/core-ui';

const MiniCartSkeleton = ({ className }) => {
  return (
    <div className={className}>
      <div className="itembox">
        <div className="itemline">
          <div className="item-img">
            <Skeleton
              time={1}
              width="120px"
              borderRadius={0}
              height="120px"
              margin="0"
            />
          </div>
          <div className="item-text">
            <div className="item-text-line">
              <div className="item-product-name">
                <Skeleton
                  time={1}
                  width="100%"
                  borderRadius={0}
                  height="22px"
                  margin="0 0 4px 0"
                />
                <Skeleton
                  time={1}
                  width="100%"
                  borderRadius={0}
                  height="22px"
                  margin="0"
                />
              </div>
              <div className="item-product-price">
                <Skeleton
                  time={1}
                  width="100px"
                  borderRadius={0}
                  height="28px"
                  margin="0 0 0 0"
                />
              </div>
            </div>
          </div>
          <div className="item-action">
            <Skeleton
              time={1}
              width="38px"
              borderRadius={0}
              height="38px"
              margin="0"
            />
          </div>
        </div>
        <div className="itemline">
          <div className="item-sizing">
            <div className="item-text-line">
              <Skeleton
                time={1}
                width="120px"
                borderRadius={0}
                height="21px"
                margin="0 0 4px 0"
              />
              <Skeleton
                time={1}
                width="120px"
                borderRadius={0}
                height="38px"
                margin="0"
              />
            </div>
          </div>
          <div className="item-qty">
            <div className="item-text-line">
              <Skeleton
                time={1}
                width="120px"
                borderRadius={0}
                height="21px"
                margin="0 0 4px 0"
              />
              <Skeleton
                time={1}
                width="120px"
                borderRadius={0}
                height="38px"
                margin="0"
              />
            </div>
          </div>
          <div className="item-total">
            <div className="item-text-line">
              <div className="item-total-text">
                <Skeleton
                  time={1}
                  width="150px"
                  borderRadius={0}
                  height="54px"
                  margin="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StyledMiniCartSkeleton = styled(MiniCartSkeleton)`
  width: 500px;
  > .itembox {
    width: 100%;
    display: block;
    height: 244px;
    > .itemline {
      display: flex;
      margin: 8px;
      > .item-img {
        margin: 8px;
        display: flex;
        width: 120px;
        height: 120px;
        > img {
          max-width: 100%;
          height: auto;
        }
      }
      > .item-text {
        margin: 8px;
        display: flex;
        flex-basis: 0;
        -ms-flex-positive: 1;
        flex-grow: 1;
        max-width: 100%;
      }
      > .item-action {
        margin: 8px;
        display: flex;
        > img {
          cursor: pointer;
          padding: 8px;
        }
      }
      > .item-sizing,
      > .item-qty {
        margin: 8px;
        -ms-flex-preferred-size: 0;
        flex-basis: 0;
        -ms-flex-positive: 1;
        flex-grow: 1;
        max-width: 120px;
        display: inline-flex;
      }
      > .item-total {
        margin: 8px;
        -ms-flex-preferred-size: 0;
        flex-basis: 0;
        -ms-flex-positive: 1;
        flex-grow: 1;
        max-width: 100%;
        display: inline-flex;
      }

      > .item-text > .item-text-line,
      > .item-sizing > .item-text-line,
      > .item-qty > .item-text-line,
      > .item-total > .item-text-line {
        width: 100%;
        display: inline-block;
        > .item-product-name {
          font-size: 16px;
          line-height: 150%;
          margin-bottom: 16px;
          display: grid;
          color: #000000;
        }
        > .item-product-price {
          margin-bottom: 4px;
          > span {
            vertical-align: middle;
            line-height: 150%;
          }
        }
        > .item-total-text {
          text-align: right;
        }
      }
    }
  }
`;

const MemoMiniCartSkeleton = React.memo(StyledMiniCartSkeleton);

export {
  MemoMiniCartSkeleton as MiniCartSkeleton,
  MemoMiniCartSkeleton as default,
};
