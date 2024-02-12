import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import withLocales from '../../../utils/decorators/withLocales';
import t from './translation.json';
import s from './AccountDetail.scss';
import { connect } from 'react-redux';
import AccountOverview from '../AccountOverview/AccountOverview';

@withLocales(t)
@withStyles(s)
class AccountDetail extends React.PureComponent {
  render() {
    return (
      <div>
        <AccountOverview customer={this.props.customer} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.account.accountInfo,
  customer: state.customer.customer,
  loading: state.customer.loading,
});

export default connect(mapStateToProps, null)(AccountDetail);
