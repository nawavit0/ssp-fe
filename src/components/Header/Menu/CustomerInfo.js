import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import ImageV2 from '../../Image/ImageV2';
import ClickOutside from '../../ClickOutside';
import { withLocales, withRoutes, Link } from '@central-tech/core-ui';
import { useStore } from '../../../reactReducers/store';
import {
  setPopupLoginDesktopOpen,
  setPopupLoginDesktopClose,
} from '../../../reactReducers/actions';
import {
  CustomerInfoStyled,
  ButtonCollapseStyled,
  TextLoginStyled,
  LoginCollapse,
  AfterLoginStyled,
  BeforeLoginStyled,
  AfterLoginMenuStyled,
  AfterLoginCollapse,
  CustomerMenuStyled,
  WelcomeNameStyled,
  CustomerLogoutStyled,
} from '../styled';
import MiniLogin from '../../MiniLogin';
import LazyLoad from 'react-lazyload';
import { get } from 'lodash';
import {
  ELEMENT_ACTION,
  ELEMENT_TYPE,
  generateElementId,
} from '../../../utils/generateElementId';
import history from '../../../history';

const toggle = {
  login: false,
};

const logout = () => {
  window.location.href = `/logout`;
};

const toggleCollapse = dispatch => {
  const isOpen = !toggle.login;
  dispatch(isOpen ? setPopupLoginDesktopOpen() : setPopupLoginDesktopClose());
};

const ChangeLanguage = ({ translate }, { customer }) => {
  const [{ isPopupLoginDesktopOpen }, dispatch] = useStore();

  useEffect(() => {
    toggle.login = isPopupLoginDesktopOpen;
  });
  useEffect(() => {
    return history.listen(() => {
      dispatch(setPopupLoginDesktopClose());
    });
  }, [dispatch]);

  return (
    <>
      <CustomerInfoStyled>
        {get(customer, 'firstname', '') ? (
          <>
            <ButtonCollapseStyled
              onClick={() => {
                toggleCollapse(dispatch);
              }}
              id={generateElementId(
                ELEMENT_TYPE.MENU,
                ELEMENT_ACTION.VIEW,
                'WelcomeArea',
                'CustommerMenu',
              )}
            >
              <ImageV2
                src={'/static/icons/AfterLogin.svg'}
                width={35}
                height={35}
              />
              <AfterLoginStyled>
                <div>{translate('header.welcome_customer')}</div>
                <WelcomeNameStyled>
                  {get(customer, 'firstname', '')}
                </WelcomeNameStyled>
              </AfterLoginStyled>
            </ButtonCollapseStyled>
            {isPopupLoginDesktopOpen && (
              <AfterLoginCollapse>
                <ClickOutside
                  visible={isPopupLoginDesktopOpen}
                  fnCallback={() => dispatch(setPopupLoginDesktopClose())}
                >
                  <AfterLoginMenuStyled>
                    <CustomerMenuStyled>
                      <Link
                        to="/account/overview"
                        id={generateElementId(
                          ELEMENT_TYPE.MENU,
                          ELEMENT_ACTION.VIEW,
                          'MyAccount',
                          'CustommerMenu',
                        )}
                      >
                        {translate('header.my_account')}
                      </Link>
                      <Link
                        to="/account/orders"
                        id={generateElementId(
                          ELEMENT_TYPE.MENU,
                          ELEMENT_ACTION.VIEW,
                          'MyOrders',
                          'CustommerMenu',
                        )}
                      >
                        {translate('header.my_orders')}
                      </Link>
                    </CustomerMenuStyled>
                    <CustomerLogoutStyled>
                      <a
                        onClick={() => logout()}
                        id={generateElementId(
                          ELEMENT_TYPE.MENU,
                          ELEMENT_ACTION.VIEW,
                          'Logout',
                          'CustommerMenu',
                        )}
                      >
                        {translate('header.log_out')}
                        <ImageV2
                          src={`/static/icons/LogOut.svg`}
                          alt={`logout`}
                          width={`18px`}
                          customStyle={{
                            marginLeft: `8px`,
                            marginBottom: `2px`,
                          }}
                        />
                      </a>
                    </CustomerLogoutStyled>
                  </AfterLoginMenuStyled>
                </ClickOutside>
              </AfterLoginCollapse>
            )}
          </>
        ) : (
          <>
            <ButtonCollapseStyled
              onClick={() => {
                toggleCollapse(dispatch);
              }}
              id={generateElementId(
                ELEMENT_TYPE.MENU,
                ELEMENT_ACTION.VIEW,
                'WelcomeArea',
                'CustommerMenu',
              )}
            >
              <ImageV2
                src={'/static/icons/BeforeLogin.svg'}
                width={35}
                height={35}
              />
              <BeforeLoginStyled>
                <TextLoginStyled>
                  {translate('header.login_and_register')}
                </TextLoginStyled>
              </BeforeLoginStyled>
            </ButtonCollapseStyled>
            {isPopupLoginDesktopOpen && (
              <LoginCollapse visible>
                <ClickOutside
                  visible={isPopupLoginDesktopOpen}
                  fnCallback={() => dispatch(setPopupLoginDesktopClose())}
                >
                  <LazyLoad once>
                    <MiniLogin />
                  </LazyLoad>
                </ClickOutside>
              </LoginCollapse>
            )}
          </>
        )}
      </CustomerInfoStyled>
    </>
  );
};

ChangeLanguage.contextTypes = {
  customer: propTypes.object,
};

export default withLocales(withRoutes(ChangeLanguage));
