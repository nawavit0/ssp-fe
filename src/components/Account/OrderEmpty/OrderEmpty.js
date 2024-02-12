import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import t from './translation.json';
import s from './OrderEmpty.scss';
import Image from '../../Image';
import Link from '../../Link';
@withStyles(s)
@withLocales(t)
class OrderEmpty extends React.PureComponent {
  render() {
    const { translate } = this.props;
    return (
      <div className={s.root}>
        <div className={s.imageEmpty}>
          <Image src="/icons/empty-orderlist.svg" alt="empty-order-list" />
        </div>
        <div className={s.label1}>{translate('label1')}</div>
        <div className={s.label2}>{translate('label2')}</div>
        <Link id="lnk-viewHome" to={'/'} className={s.button}>
          <span className={s.buttonLayer}>{translate('continueShopping')}</span>
        </Link>
      </div>
    );
  }
}
export default OrderEmpty;
