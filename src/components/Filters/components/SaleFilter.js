import React, { memo, useEffect } from 'react';
import { Switch, withLocales } from '@central-tech/core-ui';
import FilterTypeToggle from './FilterTypeToggle';
import styled from 'styled-components';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';

const CustomSwitch = styled.div`
  > div {
    background: #c3c3c3;
    z-index: 1;
    > div > div {
      color: #ffffff;
      font-size: 11px;
    }
    ${props =>
      props.isSale &&
      `
      background: #78E61E;
      > div > div {
        color: #1A1B1A;
      }
    `}
  }
`;
let isActiveSale = false;

function SaleFilter({
  translate = () => null,
  onChange = () => null,
  getActiveFilter = [],
}) {
  const activeValue = getActiveFilter
    .filter(
      active =>
        active.filters[0] && active.filters[0].field === 'online_price_enabled',
    )
    .map(filter => filter.filters[0]);

  useEffect(() => {
    isActiveSale =
      activeValue.length && activeValue[0].value && activeValue[0].value > 0;
  });

  return (
    <FilterTypeToggle
      type="Sale"
      customStyle={`
        display: flex;
        justify-content: space-between;
      `}
      disable
      id={generateElementId(
        ELEMENT_TYPE.BUTTON,
        ELEMENT_ACTION.VIEW,
        'SaleFilter',
        'Plp',
      )}
    >
      <CustomSwitch
        isSale={isActiveSale}
        id={generateElementId(
          ELEMENT_TYPE.CHECKBOX,
          ELEMENT_ACTION.CHECK,
          'SaleFilter',
          'Plp',
        )}
      >
        <Switch
          textOff={translate('no')}
          textOn={translate('yes')}
          onChange={checked => onChange({ value: checked === true ? 1 : 0 })}
          checked={!!isActiveSale}
        />
      </CustomSwitch>
    </FilterTypeToggle>
  );
}
export default memo(withLocales(SaleFilter));
