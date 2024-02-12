import React from 'react';
import { Cms } from '../../components/CMSGrapesjsView';

const Store = ({ cmsUrlKey }) => {
  return (
    <Cms urlKey={cmsUrlKey} ssr={false} renderSeo className={'cms-store'} />
  );
};

export default Store;
