import React, { Component } from 'react';
import Button from '../../components/Button';
import withLocales from '../../utils/decorators/withLocales';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GuestLogin.scss';
import t from './translation.json';
import Container from '../../components/Container';
import Link from '../../components/Link';
import MiniLoginCDS from '../../components/MiniLoginCDS';
import cx from 'classnames';

@withStyles(s)
@withLocales(t)
class GuestLogin extends Component {
  render() {
    const { translate, isMobile } = this.props;
    let styleMobile = {};

    if (isMobile) {
      styleMobile = {
        paddingLeft: '15px',
        paddingRight: '15px',
      };
    }

    return (
      <Container style={styleMobile}>
        <div id="guest-login" className={s.root}>
          <div className={s.mainTitle}>{translate('title')}</div>
          <div className={s.mainContent}>
            <div className={s.loginContainer}>
              <div className={s.regisTitle}>{translate('registerd')}</div>
              <MiniLoginCDS
                className={cx(s.miniLogin)}
                isRegister
                forgotLinkCentered
                mergeCart={false}
              />
            </div>
            <div className={s.continue}>
              <div className={s.descBox}>
                <div className={s.title}>{translate('new_member')}</div>
                <div className={s.desc}>{translate('detail')}</div>
                <Link to="/checkout" native>
                  <Button className={s.button} outline>
                    {translate('checkout_as_guest')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default GuestLogin;
