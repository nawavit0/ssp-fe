import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Logout.scss';
// import Ionicon from 'react-ionicons';
import { withLocales, Link, withRoutes } from '@central-tech/core-ui';
import { logout } from '../../reducers/auth/actions';
import { get } from 'lodash';

@withRoutes
@withLocales
class Logout extends React.PureComponent {
  afterLogout = () => {
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  componentDidMount() {
    const { logout, customer, lang } = this.props;
    if (get(customer, 'id')) {
      // eslint-disable-next-line no-unused-vars
      logout(lang, '/').then(response => {
        this.afterLogout();
      });
    } else {
      this.afterLogout();
    }
  }

  render() {
    const { translate } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.icon}>
            <img src={'/static/icons/LogoutPage.svg'} />
          </div>
          <div className={s.message}>{translate('logout.logout_message')}</div>
          <div className={s.redirect}>
            {translate('logout.logout_redirect')}
          </div>
          <Link to={'/'} className={s.button}>
            <span className={s.buttonLayer}>
              {translate('logout.back_home_button_title')}
            </span>
          </Link>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

export default compose(
  withStyles(s),
  connect(
    null,
    mapDispatchToProps,
  ),
)(Logout);
