import React from 'react';
import { Cms } from '../../components/CMSGrapesjsView';

const Home = ({ cmsUrlKey }) => {
  return (
    <div id="home-page">
      <Cms urlKey={cmsUrlKey} ssr renderSeo />
    </div>
  );
};

export default Home;
