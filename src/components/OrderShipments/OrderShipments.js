import { connect } from 'react-redux';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import withLocales from '../../utils/decorators/withLocales';

import PackItem from './PackItem/PackItem';
import s from './OrderShipments.scss';
import t from './translation.json';

@withLocales(t)
@withStyles(s)
class OrderShipments extends React.PureComponent {
  renderShipmentItems = shipment => {
    const { order, activeStoreConfig } = this.props;
    const hasPackageWithStatus = shipment.items.find(
      item => item.status !== '',
    );
    const showOtherItems = hasPackageWithStatus;
    return shipment.items.map((packaging, index) => (
      <PackItem
        packaging={packaging}
        index={index}
        order={order}
        activeStoreConfig={activeStoreConfig}
        showOtherItems={showOtherItems}
      />
    ));
  };
  render() {
    const { translate, order } = this.props;
    const { shipments } = order;
    return (
      <>
        {shipments.map((shipment, index) => (
          <div key={index} className={s.ShipmentContainer}>
            <div className={s.Header}>
              {translate('sold_by')}{' '}
              <strong>
                {shipment.sold_by === '' ? 'Supersports' : shipment.sold_by}
              </strong>
            </div>
            {this.renderShipmentItems(shipment)}
          </div>
        ))}
      </>
    );
  }
}

const mapStateToProps = state => ({
  order: state.order.order,
  shipments: state.order.order.shipments,
  activeStoreConfig: state.storeConfig.activeConfig,
});

export default connect(mapStateToProps, null)(OrderShipments);
