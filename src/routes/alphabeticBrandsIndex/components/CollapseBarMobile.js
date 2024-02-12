import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, withLocales } from '@central-tech/core-ui';

const CollapseBarMobileStyled = styled.div`
  border-bottom: solid 1px #d5d6d7;
  padding-bottom: 5px;
`;
const CollapseBarMobileHeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  p {
    font-size: 16px;
    color: #1a1b1a;
    font-weight: bold;
    margin: 15px 0 10px;
  }
  img {
    width: 30px;
    height: 30px;
    transform: ${props => (props.openFlag ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;
const CollapseBarMobileContentStyled = styled.div`
  display: ${props => (props.openFlag ? 'block' : 'none')};
`;
const BrandStyled = styled.div`
  padding: 10px 15px;
  p {
    font-weight: bold;
    font-size: 13px;
    color: #1a1b1a;
    margin: 5px 0;
  }
`;
const CollapseBarMobile = ({ letter, brandCollection }) => {
  const [openFlag, setOpenFlag] = useState(false);
  return (
    <CollapseBarMobileStyled>
      <CollapseBarMobileHeaderStyled
        onClick={() => setOpenFlag(!openFlag)}
        openFlag={openFlag}
      >
        <p>{letter}</p>
        <img openFlag={openFlag} src="/static/icons/ArrowDown.svg" />
      </CollapseBarMobileHeaderStyled>
      <CollapseBarMobileContentStyled openFlag={openFlag}>
        {brandCollection &&
          brandCollection.length &&
          brandCollection.map(brand => {
            const brandName = brand?.name || '';
            const brandId = brand?.brand_id || 0;
            return (
              <BrandStyled>
                <Link to={`/${brand.url_key}`} key={brandId} native>
                  <p>{brandName}</p>
                </Link>
              </BrandStyled>
            );
          })}
      </CollapseBarMobileContentStyled>
    </CollapseBarMobileStyled>
  );
};

export default withLocales(CollapseBarMobile);
