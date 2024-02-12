import React from 'react';
import { isEmpty, get } from 'lodash';
import withLocales from '../../../utils/decorators/withLocales';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import t from './translation.json';
import s from './The1AccountModal.scss';
import { the1cardLogin } from '../../../reducers/the1card/actions';
import { getStorage, setStorage } from '../../../utils/localStorage';
import { setCookie } from '../../../utils/cookie';
import { The1CardModel } from '../../../model/The1Card/The1CardModel';
import Modal from '../../Modal';
import Image from '../../Image';
import FormInput from '../../FormInput';

@withStyles(s)
@withLocales(t)
class The1AccountModal extends React.PureComponent {
  state = {
    errorMsgT1C: '',
    model: new The1CardModel(),
  };

  componentDidMount() {
    if (!isEmpty(getStorage('t1c-email'))) {
      this.setState({
        model: { ...this.state.model, ['email']: getStorage('t1c-email') },
      });
    }
  }

  inputChanged = e => {
    const {
      target: { name, checked, value, type },
    } = e;
    const val = type === 'checkbox' ? checked : value;

    this.setState({ model: { ...this.state.model, [name]: val } });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { the1cardLogin, translate } = this.props;
    const { model } = this.state;

    if (!isEmpty(model)) {
      const response = the1cardLogin(model.email, model.password);
      response.then(val => {
        if (!isEmpty(val)) {
          setStorage('t1-overview', {
            card_no: val.card_no,
            points: val.points,
          });
          setCookie('earn_no', val.card_no);

          window.location.reload();
        } else {
          this.setState({
            errorMsgT1C: translate('errorMsgT1C'),
          });
        }
      });
    }
  };

  renderModalHeader = () => {
    return (
      <div className={s.modalHeader}>
        <Image src="/icons/t-1-c-logo.svg" />
        <div className={s.title}>Login to your The 1 account</div>
      </div>
    );
  };

  renderModalBody = () => {
    const { translate, loading } = this.props;
    const { errorMsgT1C, model } = this.state;
    let t1cUrlRegister = '';
    let t1cUrlForgotpassword = '';
    if (typeof window !== 'undefined') {
      t1cUrlRegister = get(window, 'App.t1cUrl.register');
      t1cUrlForgotpassword = get(window, 'App.t1cUrl.forgotpassword');
    }

    return (
      <div className={s.formGroupLogin}>
        <label className={s.error}>{errorMsgT1C}</label>
        <form onSubmit={this.handleSubmit} method="post">
          <div className={s.formGroup}>
            <FormInput
              label={translate('email')}
              type="email"
              name="email"
              required
              placeholder={translate('placeholder_email')}
              value={model.email}
              onChange={e => this.inputChanged(e)}
            />
          </div>
          <div className={s.formGroup}>
            <FormInput
              label={translate('password')}
              type="password"
              name="password"
              required
              placeholder={translate('placeholder_password')}
              value={model.password}
              onChange={e => this.inputChanged(e)}
            />
          </div>
          <a className={s.forgotPassword} href={t1cUrlForgotpassword}>
            {translate('forgot_password')}
          </a>
          <button
            className={s.connectT1CButton}
            type="submit"
            disabled={loading}
          >
            {loading && translate('loading')}
            {!loading && translate('connect_t1c_button')}
          </button>
          <label className={s.labelNoAccountT1}>
            {translate('dont_have_t1_account')}
          </label>
          <a className={s.linkRegisterT1} href={t1cUrlRegister}>
            {translate('register_now')}
          </a>
        </form>
      </div>
    );
  };

  render() {
    const { show, onCloseClick } = this.props;

    return (
      <Modal
        classNameModal={s.root}
        classNameModalHeader={s.headerWrapper}
        show={show}
        header={this.renderModalHeader()}
        onModalClose={onCloseClick}
      >
        <div className={s.modalBody}>{this.renderModalBody()}</div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  the1card: state.the1card.the1card,
  loading: state.the1card.loading,
});

const mapDispatchToProps = dispatch => ({
  the1cardLogin: (email, password) => dispatch(the1cardLogin(email, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(The1AccountModal);
