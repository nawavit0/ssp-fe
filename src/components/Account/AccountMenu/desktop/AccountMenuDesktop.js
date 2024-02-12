import React from 'react';
import cx from 'classnames';
import s from '../AccountMenu.scss';
import { map } from 'lodash';
import ImageV2 from '../../../Image/ImageV2';
import Link from '../../../Link';
import styled from 'styled-components';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import withLocales from '../../../../utils/decorators/withLocales';
import t from '../../AccountMenu/translation';

const LinkStyled = styled(Link)`
  display: flex !important;
  span {
    width: 100%;
  }
`;

const AccountMenuDesktop = props => {
  const { menuList, currentPath, translate } = props;
  return (
    <div id="account-menu" className={s.root}>
      <h3 className={s.menuTitle}>{translate('myAccount')}</h3>
      <ul className={s.menuList}>
        {map(menuList, (menu, index) => {
          if (menu.skip) {
            return (
              <li key={index}>
                <hr />
              </li>
            );
          }
          return (
            <li
              key={index}
              className={cx({ [s.active]: currentPath.includes(menu.value) })}
            >
              <LinkStyled className={s.menuLink} to={menu.value}>
                <span>{translate(menu.label)}</span>
                {currentPath.includes(menu.value) && (
                  <ImageV2 width={'22px'} src={'/static/icons/ArrowUp.svg'} />
                )}
              </LinkStyled>
            </li>
          );
        })}
        <li>
          <LinkStyled className={s.signOutBtn} to={`/logout`}>
            <span>
              {translate('signOut')}{' '}
              <ImageV2 src={'/static/icons/LogOut.svg'} width={'22px'} />
            </span>
          </LinkStyled>
        </li>
      </ul>
    </div>
  );
};

export default compose(withLocales(t), withStyles(s))(AccountMenuDesktop);
