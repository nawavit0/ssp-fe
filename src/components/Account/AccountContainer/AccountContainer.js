import React, { PureComponent } from 'react';
import AccountMenuMobile from '../AccountMenu/mobile/AccountMenuMobile';
import AccountMenuDesktop from '../AccountMenu/desktop/AccountMenuDesktop';
import Container from '../../Container';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './AccountContainer.scss';
import history from '../../../history';
import { withLocales, withRoutes, Col, Row } from '@central-tech/core-ui';
import { isEmpty } from 'lodash';
import Cms from '../../CMSGrapesjsView/Cms';
import cx from 'classnames';

@withLocales
@withStyles(s)
@withRoutes
class AccountContainer extends PureComponent {
  state = {
    isOpen: false,
  };

  componentDidMount() {
    const { customer, location } = this.props;
    if (isEmpty(customer)) {
      location.push('/');
    }
  }

  handleUrlChange = url => {
    const { lang: langCode } = this.props;
    history.push(`/${langCode}${url}`);
  };

  handleOverlay = isOpen => {
    this.setState({ isOpen: isOpen });
  };

  render() {
    const menuList = [
      {
        key: '/account/overview',
        value: '/account/overview',
        label: 'Overview',
        labelMobile: 'Account Overview',
      },
      {
        key: '/account/profile',
        value: '/account/profile',
        label: 'My Profile',
        labelMobile: 'My Profile',
      },
      {
        key: '/account/address',
        value: '/account/address',
        label: 'Address Book',
        labelMobile: 'Address Book',
      },
      {
        key: '/account/wishlist',
        value: '/account/wishlist',
        label: 'Wishlist',
        labelMobile: 'Wishlist',
      },
      {
        skip: true,
      },
      {
        key: '/account/orders',
        value: '/account/orders',
        label: 'My Orders',
        labelMobile: 'My Orders',
      },
      {
        key: '/account/return',
        value: '/account/return',
        label: 'Return & Exchange',
        labelMobile: 'Return & Exchange',
      },
      {
        skip: true,
      },
      {
        key: '/account/change-password',
        value: '/account/change-password',
        label: 'Change Password',
        labelMobile: 'Change Password',
      },
    ];
    const {
      children,
      customer,
      currentPath,
      lang: langCode,
      isMobile,
      translate,
    } = this.props;
    const formatCurrentPath = currentPath.replace(`/${langCode}`, '');
    if (isEmpty(customer)) {
      return null;
    }

    const firstName = customer?.firstname || '';
    const activeMenu = menuList.find(menu =>
      formatCurrentPath.includes(menu.value),
    );

    return (
      <Container>
        <div id="account-container">
          <Row className={s.root}>
            <Col className={s.accountMenu} lg={3} md={4} sm={12}>
              {!isMobile && (
                <AccountMenuDesktop
                  menuList={menuList}
                  currentPath={formatCurrentPath}
                  isMobile={isMobile}
                  activeMenu={activeMenu}
                  onUrlChange={this.handleUrlChange}
                  translate={translate}
                />
              )}
            </Col>
            <Col className={s.accountContent} lg={9} md={8} sm={12}>
              <div className={s.cmsBlockAccount}>
                {!isMobile ? (
                  <Cms
                    identifier="ACCOUNT_SUMMARY"
                    ssr={false}
                    customStyleObject={{ style: 'width: 100%' }}
                    hasRenderJs={false}
                    replaceHtml={[
                      {
                        searchValue: '[:customer_name:]',
                        newValue: firstName,
                      },
                    ]}
                  />
                ) : (
                  <Cms
                    identifier="mobileWeb|ACCOUNT_SUMMARY"
                    ssr={false}
                    customStyleObject={{ style: 'width: 100%' }}
                    hasRenderJs={false}
                    replaceHtml={[
                      {
                        searchValue: '[:customer_name:]',
                        newValue: firstName,
                      },
                    ]}
                  />
                )}
              </div>
              {isMobile && (
                <AccountMenuMobile
                  menuList={menuList}
                  currentPath={formatCurrentPath}
                  activeMenu={activeMenu}
                  onUrlChange={this.handleUrlChange}
                  onExpandMenu={this.handleOverlay}
                  translate={translate}
                />
              )}
              <div className={s.childrenBox}>
                <div
                  className={cx(s.overlay, { [s.active]: this.state.isOpen })}
                />
                {children}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

export default AccountContainer;
