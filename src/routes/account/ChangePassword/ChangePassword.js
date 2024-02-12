import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withLocales } from '@central-tech/core-ui';
import s from './style.scss';
import FullPageLoader from '../../../components/FullPageLoader';
import ChangePasswordForm from '../../../components/Account/ChangePasswordForm';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import Button from '../../../components/Button';
import cx from 'classnames';

@withStyles(s)
@withLocales()
class ChangePassword extends Component {
  handleChangePassword = () => {
    this.props.changePassword();
  };
  submitPasswordTranslator = (responseMessage, translate) => {
    if (responseMessage === 'success') {
      return translate('change_password.change_password_success');
    } else if (responseMessage === 'incorrectPassword') {
      return translate('change_password.incorrect_password');
    }
    return translate('change_password.incorrect_password_format');
  };

  render() {
    const { translate, passwordChangeMessage, isMobile } = this.props;
    return (
      <div className={s.root}>
        <div className={s.AccountHeader}>
          <h3 className={s.AccountTitle}>
            {translate('change_password.change_password')}
          </h3>
        </div>
        <div className={s.accountContent}>
          <ChangePasswordForm isMobile={isMobile} />
          {passwordChangeMessage && (
            <div
              className={cx(s.errMsg, {
                [s.success]: passwordChangeMessage === 'success',
              })}
            >
              {this.submitPasswordTranslator(passwordChangeMessage, translate)}
            </div>
          )}
          <Button className={s.submit} onClick={this.handleChangePassword}>
            {translate('change_password.save_change')}
          </Button>
        </div>

        <FullPageLoader />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  passwordChangeMessage: state.customer.passwordChangeMessage,
});

const mapDispatchToProps = dispatch => ({
  changePassword: () => dispatch(submit('ChangePasswordForm')),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
