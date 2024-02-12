import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './OrderStatus.scss';
import t from './translation';
import withLocales from '../../utils/decorators/withLocales';
import {
  generateElementId,
  ELEMENT_TYPE,
  ELEMENT_ACTION,
} from '../../utils/generateElementId';

@withLocales(t)
@withStyles(s)
class OrderStatus extends PureComponent {
  static propTypes = {
    status: PropTypes.string.isRequired,
  };

  static ICON_CHECK_MARK = '/static/icons/IcDoneGreen.svg';
  static ICON_ALARM = '/static/icons/IcInprogress.svg';
  static ICON_CLOSE = '/static/icons/IcFail.svg';

  getImageSource(status) {
    switch (status) {
      case 'successful':
      case 'delivered':
      case 'partial_delivered':
      case 'collected':
        return OrderStatus.ICON_CHECK_MARK;
      case 'awaiting_payment':
      case 'processing':
      case 'shipping':
      case 'ready_to_ship':
      case 'ready_to_pickup':
      case 'in_transit':
      case 'ready_to_collect':
        return OrderStatus.ICON_ALARM;
      case 'payment_fail':
      case 'cancel':
      case 'delivery_fail':
      case 'rejected':
      default:
        return OrderStatus.ICON_CLOSE;
    }
  }

  getTextColor(status) {
    switch (status) {
      case 'successful':
      case 'delivered':
      case 'partial_delivered':
      case 'collected':
        return s.completed;
      case 'awaiting_payment':
      case 'processing':
      case 'shipping':
      case 'ready_to_ship':
      case 'ready_to_pickup':
      case 'in_transit':
      case 'ready_to_collect':
        return s.inprogress;
      case 'payment_fail':
      case 'cancel':
      case 'delivery_fail':
      case 'rejected':
      default:
        return s.cancel;
    }
  }

  render() {
    const { status, translate } = this.props;
    return (
      <div
        id={generateElementId(
          ELEMENT_TYPE.TEXT,
          ELEMENT_ACTION.VIEW,
          'OrderDetail',
          'OrderStatus',
        )}
        className={s.orderStatusIcon}
      >
        <div className={s.icon}>
          <img
            width="16"
            className={s.statusIcon}
            src={this.getImageSource(status)}
          />
        </div>
        <span className={cx(s.orderStatusText, this.getTextColor(status))}>
          {translate(status)}
        </span>
      </div>
    );
  }
}

export default OrderStatus;
