import React from 'react';
import { Cms } from '../../../components/CMSGrapesjsView';
import styled from 'styled-components';

const AccountReturnStyled = styled.div`
  padding-bottom: 30px;
`;

const blockLoading = () => {
  return <div></div>;
};

export default function Return({ identifier }) {
  return (
    <AccountReturnStyled>
      <Cms identifier={identifier} blockLoading={blockLoading} ssr={false} />
    </AccountReturnStyled>
  );
}
