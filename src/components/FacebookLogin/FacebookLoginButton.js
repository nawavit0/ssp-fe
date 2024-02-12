import React from 'react';
import styled from 'styled-components';
import { compose } from 'redux';
import { connect } from 'react-redux';
import pt from 'prop-types';
import { setCookie } from '../../utils/cookie';
import { withStoreConfig } from '@central-tech/core-ui';

const ButtonFB = styled.a`
  background-color: #3b5899;
  width: 100%;
  height: 48px;
  display: flex;
  color: #ffffff;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 14px;
  line-height: 48px;
  cursor: pointer;
  &:hover {
    background-color: darken($blue-base, 10%);
    transition: 0.3s;
  }
`;
const SvgIcon = styled.svg`
  width: 16px;
  height: 16px;
  color: #ffffff;
  margin-right: 10px;
  fill: currentColor;
  ${props => (props.iconStyle ? props.iconStyle : '')}
`;

@withStoreConfig
class FacebookLoginButton extends React.PureComponent {
  static propTypes = {
    activeConfig: pt.object,
    loading: pt.bool,
    popup: pt.func,
    mergeCart: pt.bool,
  };
  static defaultProps = {
    loading: false,
  };

  login = () => {
    const { activeConfig, loading, popup, mergeCart } = this.props;
    if (loading) return;

    const loginUrl = `${activeConfig.base_url}sociallogin/auth/login/provider/facebook`;

    setCookie('mergeCartFB', mergeCart);
    popup(loginUrl);
  };

  render() {
    const { children, iconStyle, loading, ...rest } = this.props;
    return (
      <ButtonFB onClick={this.login} disabled={loading} {...rest}>
        <SvgIcon
          iconStyle={iconStyle}
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22 16l1-5h-5V7c0-1.544.784-2 3-2h2V0h-4c-4.072 0-7 2.435-7 7v4H7v5h5v14h6V16h4z" />
        </SvgIcon>
        <span>{children}</span>
      </ButtonFB>
    );
  }
}

// private function map into props
const popup = url => {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : screen.left;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : screen.top;

  let innWidth = 0;
  if (window.innerWidth) {
    innWidth = window.innerWidth;
  } else if (document.documentElement.clientWidth) {
    innWidth = document.documentElement.clientWidth;
  } else {
    innWidth = screen.width;
  }

  let innHeight = '';
  if (window.innerHeight) {
    innHeight = window.innerHeight;
  } else if (document.documentElement.clientHeight) {
    innHeight = document.documentElement.clientHeight;
  } else {
    innHeight = screen.height;
  }

  const sizeWidth = 650;
  const sizeHeight = 650;
  const left = innWidth / 2 - sizeWidth / 2 + dualScreenLeft;
  const top = innHeight / 2 - sizeHeight / 2 + dualScreenTop;

  const newWindow = window.open(
    url,
    'popup',
    `scrollbars=yes, width=${sizeWidth}, height=${sizeHeight}, top=${+top}, left=${left}, titlebar=no`,
  );

  newWindow.focus();
};

const mapStateToProps = state => ({
  loading: state.auth.loading,
});

const mapDispatchToProps = () => ({
  popup,
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(FacebookLoginButton);
