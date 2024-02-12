import React, { Fragment, memo } from 'react';
import CheckBoxList from './CheckBoxList';

const SizeFilter = () => (
  <Fragment>
    <CheckBoxList list={[...Array(8)]} />
  </Fragment>
);

export default memo(SizeFilter);
