import React, { useState } from 'react';
import { isEmpty, map, concat, compact } from 'lodash';
import { withLocales } from '@central-tech/core-ui';
import { Cms } from '../../components/CMSGrapesjsView';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import CollapseBarMobile from './components/CollapseBarMobile';

const AlphabeticBrandsIndexMobile = ({ rawBrandList, translate }) => {
  const [brandLetters, setBrandLetters] = useState([]);
  const [brandsCollectionsByLetters, setBrandsCollectionsByLetters] = useState(
    [],
  );
  const parseBrandsAndExtractFirstLetter = brandLetters => {
    return concat([translate('brand.all')], brandLetters.sort());
  };
  if (
    rawBrandList &&
    isEmpty(brandsCollectionsByLetters) &&
    !isEmpty(rawBrandList)
  ) {
    const sortBrandLetters = parseBrandsAndExtractFirstLetter(
      rawBrandList.characters,
    );
    let character = compact(
      map(sortBrandLetters, alphabet => {
        if (!Number(alphabet)) return alphabet;
      }),
    );
    if (character.length !== sortBrandLetters.length) {
      character = concat(character, '0-9');
    }
    setBrandLetters(character);
    setBrandsCollectionsByLetters(rawBrandList.groups);
  }
  const getBreadcrumbs = () => [
    {
      name: translate('brand.brands'),
    },
  ];
  return (
    <>
      <Breadcrumbs breadcrumbsData={getBreadcrumbs()} marginBottom={false} />
      <Cms identifier="mobileWeb|ALL_BRAND_BANNER" ssr />
      {brandLetters && brandLetters.length
        ? brandLetters.map(letter => {
            return (
              letter !== translate('brand.all') && (
                <CollapseBarMobile
                  letter={letter}
                  brandLetters={brandLetters}
                  brandCollection={brandsCollectionsByLetters[letter]}
                />
              )
            );
          })
        : translate('brand.wait_to_loading_brands')}
    </>
  );
};

export default withLocales(AlphabeticBrandsIndexMobile);
