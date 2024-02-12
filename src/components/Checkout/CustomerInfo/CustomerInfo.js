import React from 'react';
import pt from 'prop-types';
import { withLocales } from '@central-tech/core-ui';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './CustomerInfo.scss';
import { setCookie, getCookie, unsetCookie } from '../../../utils/cookie';
import { getStorage } from '../../../utils/localStorage';
import Button from '../../Button';
import Input from '../../Input';
import {
  clearErrorsT1cEarnApply,
  setErrorsT1cEarnApply,
} from '../../../reducers/checkout/actions';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../../utils/generateElementId';
import { Link } from '@central-tech/core-ui';

@withStyles(s)
@withLocales
export class CustomerInfo extends React.PureComponent {
  state = {
    the1: '',
    the1ShowCard: false,
    isCheckT1cLength: false,
  };

  static propTypes = {
    firstname: pt.string,
    lastname: pt.string,
    email: pt.string,
    telephone: pt.string,
  };

  componentDidMount() {
    let t1Account;
    if (!isEmpty(getStorage('t1-overview')) && isEmpty(getCookie('earn_no'))) {
      t1Account = getStorage('t1-overview');
      setCookie('earn_no', t1Account.card_no);
    }
    this.props.clearErrorsT1cEarnApply();
    this.setState({
      the1: getCookie('earn_no'),
      the1ShowCard: !isEmpty(getCookie('earn_no')),
    });
  }

  handleChangeValue = e => {
    const { value } = e.target;
    this.setState({
      the1: value,
    });

    if (
      (value.length > 0 && value.length !== 10 && value.length !== 16) ||
      isNaN(Number(value)) ||
      (value.length > 0 && !/^[1-9][0-9]+$/.test(value))
    ) {
      this.setState({
        isCheckT1cLength: true,
      });
      this.props.setErrorsT1cEarnApply();
    } else {
      this.setState({
        isCheckT1cLength: false,
      });
      this.props.clearErrorsT1cEarnApply();
    }
  };

  handleAddT1Earn = () => {
    const { the1 = '' } = this.state;
    if (
      (the1.length === 10 || the1.length === 16) &&
      /^[1-9][0-9]+$/.test(the1) &&
      !isNaN(Number(the1))
    ) {
      this.setState({
        the1: this.state.the1,
        the1ShowCard: true,
      });
      setCookie('earn_no', this.state.the1);
      this.props.clearErrorsT1cEarnApply();
    } else {
      this.setState({
        isCheckT1cLength: true,
      });
      this.props.setErrorsT1cEarnApply();
    }
  };

  handleRemoveT1Earn = () => {
    unsetCookie('earn_no');
    this.setState({
      the1: '',
      the1ShowCard: false,
    });
    this.props.clearErrorsT1cEarnApply();
  };

  render() {
    const { firstname, lastname, email, telephone, translate } = this.props;
    const { isCheckT1cLength } = this.state;
    return (
      <div className={s.root}>
        <div
          id={generateElementId(
            ELEMENT_TYPE.INFO,
            ELEMENT_ACTION.VIEW,
            'Customer',
            '',
            'name',
          )}
          className={s.customerName}
        >
          {firstname} {lastname}
        </div>
        <div className={s.row}>
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'Customer',
              '',
              'email',
            )}
            className={s.customEmail}
          >
            {email}
          </div>
        </div>
        <div className={s.row}>
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'Customer',
              '',
              'telephone',
            )}
            className={s.customTelephone}
          >
            {telephone}
          </div>
        </div>
        <div
          className={cx(s.row, s.t1cRow, {
            [s.normalDisplay]: this.state.the1ShowCard,
          })}
        >
          <p className={s.titleT1Earn}>{translate('customer_info.t1c')}</p>
          <div
            className={cx(s.the1Input, {
              [s.hidden]: this.state.the1ShowCard,
            })}
          >
            <Input
              id={generateElementId(
                ELEMENT_TYPE.TEXT,
                ELEMENT_ACTION.ADD,
                'T1Earn',
                '',
              )}
              wrapperClassName={s.the1Wrapper}
              className={cx(s.inputT1, isCheckT1cLength ? s.borderRed : '')}
              placeholder={translate('customer_info.placeholder_t1c')}
              value={this.state.the1}
              maxLength={16}
              onChange={this.handleChangeValue}
              after={
                <Button
                  id={generateElementId(
                    ELEMENT_TYPE.BUTTON,
                    ELEMENT_ACTION.ADD,
                    'T1Number',
                    '',
                  )}
                  value={this.state.the1}
                  color="custom"
                  className={s.earnT1Btn}
                  onClick={this.handleAddT1Earn}
                >
                  {translate('customer_info.add')}
                </Button>
              }
            />
            {isCheckT1cLength && (
              <label className={s.txt_error}>
                {translate('customer_info.text_error_t1c')}
              </label>
            )}
          </div>
          <div
            id={generateElementId(
              ELEMENT_TYPE.INFO,
              ELEMENT_ACTION.VIEW,
              'T1Number',
              '',
            )}
            className={cx(s.the1Display, {
              [s.hidden]: !this.state.the1ShowCard,
            })}
          >
            <label className={s.cardT1No}>
              {translate('customer_info.card_no', { cardNo: this.state.the1 })}
              <Link
                id={generateElementId(
                  ELEMENT_TYPE.BUTTON,
                  ELEMENT_ACTION.REMOVE,
                  'T1Number',
                  '',
                )}
                className={s.removeT1CardNo}
                onClick={this.handleRemoveT1Earn}
              >
                {translate('customer_info.remove_t1_earn')}
              </Link>
            </label>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  clearErrorsT1cEarnApply: () => dispatch(clearErrorsT1cEarnApply()),
  setErrorsT1cEarnApply: () => dispatch(setErrorsT1cEarnApply()),
});
export default connect(null, mapDispatchToProps)(CustomerInfo);
