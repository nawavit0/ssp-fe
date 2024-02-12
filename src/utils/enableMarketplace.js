import { get as prop } from 'lodash';

const enableMarketplace = envConfigs => {
  return prop(envConfigs, 'enableMarketplace', false);
};

export default enableMarketplace;
