import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { isEmpty } from 'lodash';
import withLocales from '../../utils/decorators/withLocales';
import IosLogOut from 'react-ionicons/lib/IosLogOut';
import s from './CustomerMenu.scss';
import t from './translation.json';
import { getStorage } from '../../utils/localStorage';
import { logout } from '../../reducers/auth/actions';
import Link from '../Link';

@withStyles(s)
@withLocales(t)
class CustomerMenu extends React.PureComponent {
  render() {
    const { translate, logout } = this.props;

    let t1Account;
    if (!isEmpty(getStorage('t1-overview'))) {
      t1Account = getStorage('t1-overview');
    }

    return (
      <div className={s.container}>
        <div className={s.menuList}>
          {!isEmpty(t1Account) && (
            <div className={s.title}>
              <img src="/icons/t-1-c-logo.svg" className={s.iconT1C} />
              <label className={s.t1cPoint}>
                {translate('point', {
                  points: (+t1Account.points).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }),
                })}
              </label>
            </div>
          )}
          <Link className={s.menuItems} to="/account/overview" native>
            {translate('my_account')}
          </Link>
          <Link className={s.menuItems} to="/account/orders" native>
            {translate('my_orders')}
          </Link>
          {/* <Link className={s.menuItems} to="/">
            {translate('return_and_exchange')}
          </Link> */}
        </div>
        <div className={s.logout}>
          <Link to="#" className={s.labelLogout} onClick={() => logout()}>
            {translate('log_out')}
            <IosLogOut
              className={s.logoutIcon}
              icon="ios-log-out"
              fontSize="24px"
              color="#0B233D"
            />
          </Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(
  null,
  mapDispatchToProps,
)(CustomerMenu);
