import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import { fetchOrderByIncrementId } from '../../../reducers/order/actions';
import t from './translation.json';
import s from './OrderDetail.scss';
import OrderDetailContainer from '../../../components/OrderDetailContainer';

@withLocales(t)
@withStyles(s)
class OrderDetail extends React.PureComponent {
  componentDidMount() {
    const { fetchOrder, id } = this.props;
    fetchOrder(id);
  }

  render() {
    return (
      <>
        <OrderDetailContainer {...this.props} />
      </>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.locale.lang,
  order: state.order.order,
  orderFetchFailed: state.order.orderFetchFailed,
});

const matchDispatchToProps = dispatch => ({
  fetchOrder: id => dispatch(fetchOrderByIncrementId(id)),
});

export default connect(mapStateToProps, matchDispatchToProps)(OrderDetail);
