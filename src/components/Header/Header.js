import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import UpperHeader from '../UpperHeader';
import MainHeader from '../MainHeader';
import { UPPER_HEADER_HEIGHT } from '../../constants/styles';
import s from './Header.scss';
import { CategoriesWidget } from '@central-tech/core-ui';
import {
  transFormCategory,
  getActiveCategoryList,
} from '../../utils/categories';
import { get } from 'lodash';

class Header extends React.PureComponent {
  state = {};

  pageYOffset = 0;

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.setState({
      fixed: pageYOffset >= UPPER_HEADER_HEIGHT,
    });

    this.pageYOffset = pageYOffset;
  };

  render() {
    const { fixed } = this.state;

    return (
      <div className={s.root}>
        {/*<UpperHeader />*/}
        <div className={cx(s.mainHeaderContainer, { [s.fixed]: fixed })}>
          <CategoriesWidget>
            {({ data }) => {
              if (get(data, 'categories')) {
                const categories = getActiveCategoryList(
                  transFormCategory(data.categories),
                );
                return <MainHeader category={categories} />;
              }
              return <span />;
            }}
          </CategoriesWidget>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
