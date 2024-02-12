import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import DropdownList from '../Select/DropdownList/DropdownList';
import { OutterBlockStyled } from '../Select/DropdownList/styled';

const SortDesktop = props => {
  const { sortLists, activeOptionString, handleFilterClick, translate } = props;
  return (
    <OutterBlockStyled>
      <DropdownList
        width={`200px`}
        margin={`8px`}
        options={sortLists}
        selectedOption={activeOptionString}
        id="sel-formFilter-sort"
        placeholder={translate('sort_and_list.sort')}
        value=""
        onChange={change => handleFilterClick('sort', change.value)}
      />
    </OutterBlockStyled>
  );
};

export default withLocales(SortDesktop);
