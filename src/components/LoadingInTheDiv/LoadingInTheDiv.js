import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoadingInTheDiv.scss';
import { get } from 'lodash';
import styled from 'styled-components';

const LdsEllipsisWrapper = styled.div`
  width: 100%;
  height: auto;
  align-items: center;
  text-align: center;
  padding-top: 50px;
`;

const LoadingInTheDiv = props => {
  if (get(props, 'hide')) {
    return <span></span>;
  }

  return (
    <LdsEllipsisWrapper>
      <div className={s.ldsFlickrBox}>
        <div className={s.ldsFlickr}>
          <div />
          <div />
          <div />
        </div>
      </div>
    </LdsEllipsisWrapper>
  );
};

export default withStyles(s)(LoadingInTheDiv);
