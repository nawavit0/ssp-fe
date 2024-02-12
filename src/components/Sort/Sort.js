import React from 'react';
import { withLocales } from '@central-tech/core-ui';
import { filter, omit, get as prop } from 'lodash';
import SortDesktop from './SortDesktop';
import SortMobile from './SortMobile';
import withDeviceDetect from '../DeviceDetect/withDeviceDetect';

class Sort extends React.PureComponent {
  handleFilterClick = (attributeCode, valueOption, encode = false) => {
    const { location } = this.props;
    let { queryParams } = location;
    let value = encode ? encodeURIComponent(valueOption) : valueOption;

    if (attributeCode === 'price_range') {
      value = `${value.min},${value.max}`;
      queryParams = omit(queryParams, ['price_range']);
    }

    if (
      queryParams[attributeCode] &&
      attributeCode !== 'sort' &&
      attributeCode !== 'category_id'
    ) {
      let currentValues = String(queryParams[attributeCode]).split(',');

      if (currentValues.includes(value)) {
        currentValues = filter(currentValues, v => v !== value);
      } else {
        currentValues.push(value);
      }
      queryParams[attributeCode] = currentValues.join(',');
    } else if (attributeCode === 'category_id') {
      queryParams[attributeCode] = valueOption;
    } else {
      queryParams[attributeCode] = value;
    }
    location.push(location.pathname, queryParams);
  };

  transformOption = (name, sort) => {
    const { translate } = this.props;
    return `${translate(name.toLowerCase())} ${translate(sort)}`;
  };

  render = () => {
    const { translate, activeSort, isMobile } = this.props;
    const activeOption = prop(activeSort, '[0]', {});
    let activeOptionString = false;
    if (activeOption !== {}) {
      activeOptionString = `${activeOption.field.toLowerCase()},${activeOption.direction.toLowerCase()}`;
    }
    const sortLists = [
      {
        key: 'recommended,desc',
        value: 'recommended,desc',
        label: translate('sort_and_list.recommended'),
      },
      {
        key: 'news_from_date,desc',
        value: 'news_from_date,desc',
        label: translate('sort_and_list.new_arrival'),
      },
      {
        key: 'price,desc',
        value: 'price,desc',
        label: this.transformOption(
          'sort_and_list.price',
          'sort_and_list.desc',
        ),
      },
      {
        key: 'price,asc',
        value: 'price,asc',
        label: this.transformOption('sort_and_list.price', 'sort_and_list.asc'),
      },
      {
        key: 'price_discount,desc',
        value: 'price_discount,desc',
        label: this.transformOption(
          'sort_and_list.price_discount',
          'sort_and_list.desc',
        ),
      },
      {
        key: 'price_discount,asc',
        value: 'price_discount,asc',
        label: this.transformOption(
          'sort_and_list.price_discount',
          'sort_and_list.asc',
        ),
      },
    ];
    return !isMobile ? (
      <SortDesktop
        sortLists={sortLists}
        activeOptionString={activeOptionString}
        handleFilterClick={this.handleFilterClick}
      />
    ) : (
      <SortMobile
        sortLists={sortLists}
        activeOptionString={activeOptionString}
        handleFilterClick={this.handleFilterClick}
      />
    );
  };
}

export default withDeviceDetect(withLocales(Sort));
