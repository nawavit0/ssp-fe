import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import s from './AccountProfile.scss';
import t from './translation.json';
import ProfileForm from '../../../components/Account/ProfileForm';
import Button from '../../../components/Button';
import history from '../../../history';
import FullPageLoader from '../../../components/FullPageLoader';

@withStyles(s)
@withLocales(t)
class AccountProfile extends Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.profileForm &&
      prevProps.profileForm &&
      !prevProps.profileForm.submitSucceeded &&
      this.props.profileForm.submitSucceeded
    ) {
      this.handleSubmitSuccess();
    }
  }

  handleSaveProfile = () => {
    this.props.updateCustomerProfile();
  };

  handleBackToProfile = () => {
    const { langCode } = this.props;
    history.push(`/${langCode}/account/profile`);
  };

  handleDiscardPage = () => {
    const { translate } = this.props;
    if (confirm(translate('alertDiscard'))) {
      location.reload();
    }
  };

  handleSubmitSuccess = () => {
    const { profileError } = this.props;
    if (profileError) {
      alert(profileError);
    } else {
      this.handleBackToProfile();
    }
  };

  render() {
    const { profileForm = {}, translate, isMobile } = this.props;
    return (
      <div className={s.root}>
        <div className={s.AccountHeader}>
          <h3 className={s.AccountTitle}>{translate('my_profile')}</h3>
        </div>
        <div className={s.accountContent}>
          <h3 className={s.accountMiniTitle}>
            {translate('personal_information')}
          </h3>
          <div className={s.accountForm}>
            <ProfileForm isMobile={isMobile} />
            <div className={s.formButton}>
              <Button className={s.submit} onClick={this.handleSaveProfile}>
                {translate('save_btn')}
              </Button>
              <Button
                className={s.discard}
                outline
                onClick={this.handleDiscardPage}
              >
                {translate('discard_btn')}
              </Button>
            </div>
          </div>
        </div>
        <FullPageLoader show={profileForm.submitting} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  langCode: state.locale.langCode,
  profileForm: state.form.profileForm,
  profileError: state.account.error,
});

const mapDispatchToProps = dispatch => ({
  updateCustomerProfile: () => dispatch(submit('profileForm')),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountProfile);
